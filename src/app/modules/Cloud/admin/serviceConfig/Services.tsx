import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import styled from 'styled-components';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useComputed, useSignal } from '@preact/signals-react';

import { ServiceConfig, ServiceConfigKey } from '@/@types/Cloud/config';
import IndeterminateCheckBox from '@component/common/IndeterminateCheckBox';
import DefaultDialog from '@component/common/Dialog/DefaultDialog';
import DialogText from '@component/common/Dialog/DialogText';
import { _deleteServiceConfig } from '@api/cloud/identity';
import { serviceConfigKeys } from '@libs/utils/queryKeys';
import TableChip from '@component/common/Chip/TableChip';
import NoPageTable from '@component/common/Table/NoPageTable';

import AddServiceConfig from './AddServiceConfig';
import EditServiceConfig from './EditServiceConfig';

interface ServicesProps {
    services: ServiceConfig<ServiceConfigKey>[];
    type: ServiceConfigKey;
    title: string;
}

const columnHelper = createColumnHelper<ServiceConfig<ServiceConfigKey>>();
/**
 * Type 설정 (Service Node)
 */
const Services = ({ services, type, title }: ServicesProps) => {
    const queryClient = useQueryClient();

    const checkedServices = useSignal<ServiceConfig<ServiceConfigKey>[]>([]);
    const deleteModal = useSignal(false);
    const addModal = useSignal(false);
    const editModal = useSignal(false);

    const optionServices = services ? services?.filter(service => service.key === type && service.value) : [];

    // value가 undefined 인 배열. => 추가할 때 사용
    const addableServices = services ? services?.filter(service => service.key === type && !service.value) : [];

    /**
     * 체크박스 클릭 함수
     */
    const onCheckLogTypes = (logType: ServiceConfig<ServiceConfigKey>) => {
        if (checkedServices.value.findIndex(({ name }) => name === logType.name) >= 0) {
            checkedServices.value = checkedServices.value.filter(({ name }) => name !== logType.name);
        } else {
            checkedServices.value = [...checkedServices.value, logType];
        }
    };

    const columnHeader = useComputed(() => {
        if (type === 'service_log_type') {
            return '로그 타입';
        } else if (type === 'service_log_level') {
            return '로그 레벨';
        } else if (type === 'service_log_store_period') {
            return '로그 보유 기간 (일)';
        }
    });

    /**
     * 서비스 설정 삭제
     */
    const { isLoading: deleteLoading, mutate: deleteServiceConfig } = useMutation(
        () => _deleteServiceConfig(checkedServices.value),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    toast.success('서비스 설정이 정상적으로 삭제되었습니다.');
                    deleteModal.value = false;
                    queryClient.invalidateQueries(serviceConfigKeys.all);
                }
            },
        },
    );

    // 컬럼
    const serviceColumns = useComputed(() => [
        columnHelper.accessor('name', {
            id: 'select',
            header: ({ table }) => (
                <IndeterminateCheckBox
                    {...{
                        checked:
                            checkedServices.value.length !== 0 &&
                            optionServices.length === checkedServices.value.length,
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                    onClick={() => {
                        if (optionServices.length === checkedServices.value.length) {
                            // 전체 선택되어 있으면
                            // 전체 선택 해제
                            checkedServices.value = [];
                        } else {
                            // 전체 선택 되어있지 않으면
                            // 전체 선택
                            const rows = table.getRowModel().rows.map(row => row.original);
                            checkedServices.value = [...rows];
                        }
                    }}
                />
            ),
            cell: ({ row }) => (
                <IndeterminateCheckBox
                    {...{
                        // id: row.original.id,
                        name: row.original.name,
                        checked: checkedServices.value.some(({ name }) => name === row.original.name),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                    }}
                    onClick={() => {
                        onCheckLogTypes(row.original);
                    }}
                />
            ),
        }),
        columnHelper.accessor('name', {
            header: () => <Typography>서비스 이름</Typography>,
            cell: ({ row }) => <Typography>{row.original.name}</Typography>,
        }),
        columnHelper.accessor('value', {
            header: () => <Typography>{columnHeader.value}</Typography>,
            cell: ({ row }) => {
                if (type === 'service_log_level') {
                    return <TableChip label={row.original.value} color={row.original.value} />;
                } else {
                    return <Typography>{row.original.value}</Typography>;
                }
            },
        }),
    ]);

    return (
        <Wrapper>
            <ButtonWrapper>
                <Tooltip title="추가">
                    <span>
                        <IconButton onClick={() => (addModal.value = true)}>
                            <AddOutlinedIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="수정">
                    <span>
                        <IconButton
                            onClick={() => (editModal.value = true)}
                            disabled={checkedServices.value.length < 1}
                        >
                            <ModeEditOutlineOutlinedIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="삭제">
                    <span>
                        <IconButton
                            disabled={checkedServices.value.length === 0}
                            onClick={() => (deleteModal.value = true)}
                        >
                            <DeleteOutlineIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </ButtonWrapper>
            <NoPageTable
                columns={serviceColumns.value}
                data={optionServices || []}
                noDataMessage={`${columnHeader.value} 관련 서비스 설정을 추가할 수 있습니다.`}
                isLoading={false}
            />
            {deleteModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={deleteModal.value}
                    title={`${columnHeader.value} 설정 삭제`}
                    onClose={() => (deleteModal.value = false)}
                    onConfirm={deleteServiceConfig}
                    isLoading={deleteLoading}
                    actionType="confirm"
                    buttonColor="error"
                >
                    <DialogText
                        title={`선택한 서비스 설정을 삭제하시겠습니까?`}
                        body={
                            type === 'service_log_level'
                                ? '삭제된 로그 레벨 설정은 서비스가 재시작되어야만 적용됩니다.'
                                : ''
                        }
                    />
                </DefaultDialog>
            )}
            {addModal.value && (
                <AddServiceConfig
                    open={addModal.value}
                    onClose={() => (addModal.value = false)}
                    service={columnHeader.value}
                    title={title}
                    type={type}
                    services={addableServices || []}
                />
            )}
            {editModal.value && (
                <EditServiceConfig
                    open={editModal.value}
                    onClose={() => (editModal.value = false)}
                    title={title}
                    type={type}
                    services={checkedServices.value}
                />
            )}
        </Wrapper>
    );
};

export default Services;

const Wrapper = styled(Box)`
    display: flex;
    flex-direction: column;
`;

const ButtonWrapper = styled(Box)`
    display: flex;
    justify-content: flex-end;
`;
