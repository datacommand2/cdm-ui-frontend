import React from 'react';
import { Box, Dialog, DialogContent, DialogTitle, Divider } from '@mui/material';
import styled from 'styled-components';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useComputed, useSignal } from '@preact/signals-react';

import { serviceConfigKeys } from '@libs/utils/queryKeys';
import NoPageTable from '@component/common/Table/NoPageTable';
import { ServiceConfig, ServiceConfigKey } from '@/@types/Cloud/config';

import { useServiceConfigMutation } from './common/hooks';
import { defaultValues, getSubmitHandler, initServices, periodValidate } from './common/utils';
import { AddServiceConfigProps } from './common/types';
import {
    createColumns,
    ServiceConfigDialog,
    ServiceConfigDialogActions,
    ServiceConfigFormGroup,
} from './common/components';

/**
 * 서비스 설정 추가 컴포넌트
 */
const AddServiceConfig = ({ open, type, onClose, services = [], service, title }: AddServiceConfigProps) => {
    const queryClient = useQueryClient();
    const addData = useSignal<ServiceConfig<ServiceConfigKey>[]>([]);
    const addModal = useSignal(false);
    const copiedServices = useSignal(initServices(type, services));
    const checkedServices = useSignal<ServiceConfig<ServiceConfigKey>[]>([]);

    /**
     * 서비스 설정 추가
     */
    const { isLoading: addLoading, mutate: addServiceConfig } = useServiceConfigMutation({
        data: addData.value,
        successCallback: () => {
            toast.success(`서비스 설정이 추가되었습니다.`);
            queryClient.invalidateQueries(serviceConfigKeys.all);
            onClose();
        },
        failureCallback: () => {
            onClose();
        },
    });

    const { control, handleSubmit } = useForm({
        defaultValues,
        mode: 'all',
    });

    // 컬럼
    const serviceColumns = useComputed(() =>
        createColumns({
            type,
            service,
            services,
            checkedServices,
        }),
    );

    // isDisabled 함수를 computed signal로 만들어서 사용
    const isDisabled = useComputed(() => {
        if (services.length === 0 || checkedServices.value.length === 0) {
            return true;
        } else {
            return false;
        }
    });

    const changeTableOption = (value: any) => {
        const mockServices = [...copiedServices.value];
        copiedServices.value = mockServices.map(service => {
            return { ...service, value };
        });
    };

    return (
        <>
            <Dialog open={open} fullWidth maxWidth={'md'}>
                <DialogTitle>{title} 추가</DialogTitle>
                <Divider />
                <form onSubmit={handleSubmit(getSubmitHandler(type, addData, checkedServices.value, addModal))}>
                    <DialogContent>
                        <Wrapper>
                            <TableItem>
                                <NoPageTable
                                    columns={serviceColumns.value}
                                    data={copiedServices.value}
                                    isLoading={false}
                                    noDataMessage={'데이터가 존재하지 않습니다.'}
                                />
                            </TableItem>
                            <DividerItem>
                                <Divider orientation="vertical" />
                            </DividerItem>
                            <Item>
                                <FormWrapper>
                                    <OptionForm>
                                        <ServiceConfigFormGroup
                                            type={type}
                                            isLoading={addLoading}
                                            control={control}
                                            periodValidate={periodValidate}
                                            onLogLevelChange={params => {
                                                params.field.onChange(params.option.value);
                                                changeTableOption(params.option.value);
                                            }}
                                            onLogStorePeriodChange={changeTableOption}
                                            onLogTypeChange={params => {
                                                params.field.onChange(params.option.value);
                                                changeTableOption(params.option.value);
                                            }}
                                        />
                                    </OptionForm>
                                </FormWrapper>
                            </Item>
                        </Wrapper>
                    </DialogContent>
                    <Divider />
                    <ServiceConfigDialogActions disabled={isDisabled.value} buttonType="add" onClick={onClose} />
                </form>
            </Dialog>
            <ServiceConfigDialog
                title={`${title} 추가`}
                textTitle={`선택한 서비스의 ${title}을 추가하시겠습니까?`}
                body={type === 'service_log_level' ? '추가된 로그 레벨 설정은 서비스가 재시작되어야만 적용됩니다.' : ''}
                open={addModal.value}
                isLoading={addLoading}
                onConfirm={addServiceConfig}
                onClose={() => (addModal.value = false)}
            />
        </>
    );
};

export default AddServiceConfig;

const Wrapper = styled(Grid2).attrs({ container: true, columnSpacing: 4, columns: 13 })`
    display: flex;

    & .no-page-table-container,
    .no-page-table {
        padding: 0;
    }
`;
const TableItem = styled(Grid2).attrs({ xs: 8 })``;
const Item = styled(Grid2).attrs({ xs: 4 })``;

const DividerItem = styled(Grid2).attrs({ xs: 1 })``;

const FormWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    height: 100%;
`;

const OptionForm = styled(Box)`
    height: 100%;
`;
