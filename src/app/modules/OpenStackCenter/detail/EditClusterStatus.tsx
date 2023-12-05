import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Switch,
    Tab,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import TabContext from '@mui/lab/TabContext/TabContext';
import TabList from '@mui/lab/TabList/TabList';
import TabPanel from '@mui/lab/TabPanel/TabPanel';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorIcon from '@mui/icons-material/Error';
import { toast } from 'react-toastify';

import { _modifyClusterException } from '../../../../api/center/cluster';
import { clusterStatusKeys } from '../../../../libs/utils/queryKeys';
import TableHeader from '../../../component/common/Table/TableHeader';
import { TEXT } from '../../../../constant/text';
import NoPageTable from '../../../component/common/Table/NoPageTable';
import ActionButton from '../../../component/common/Button/ActionButton';
import DefaultDialog from '../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../component/common/Dialog/DialogText';
import { ClusterStatus, OpenStackCluster } from '../../../../@types/Cluster';

interface ClusterServices {
    id: string;
    binary: string;
    host: string;
    zone?: string;
    type?: string;
    status: string;
    last_updated: string;
    exception?: boolean;
    deleted?: boolean;
}

const columnHelper = createColumnHelper<ClusterServices>();

interface EditClusterStatusProps {
    open: boolean;
    handleClose: () => void;
    computes: ClusterStatus['computes'] | [];
    networks: ClusterStatus['networks'] | [];
    storages: ClusterStatus['storages'] | [];
    cluster: OpenStackCluster;
}

/**
 * 클러스터 서비스 정보를 수정하는 컴포넌트
 */
const EditClusterStatus = ({ cluster, computes, networks, storages, open, handleClose }: EditClusterStatusProps) => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const [computesInfo, setComputesInfo] = useState([...computes]);
    const [networksInfo, setNetworksInfo] = useState([...networks]);
    const [storagesInfo, setStoragesInfo] = useState([...storages]);

    const [editModal, setEditModal] = useState(false);
    const [value, setValue] = useState('1');

    const queryClient = useQueryClient();
    const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
        setValue(newValue);
    };

    /**
     * 클러스터 서비스 정보를 수정하는 함수
     */
    const { isLoading: modifyLoading, mutate: editClusterService } = useMutation(
        (payload: any) => _modifyClusterException(cluster.id, payload),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    toast.success('클러스터 서비스 정보가 수정되었습니다.');
                    queryClient.invalidateQueries(clusterStatusKeys.all);
                }
                setEditModal(false);
                setTimeout(() => {
                    handleClose();
                }, 50);
            },
        },
    );

    const computeColumns = useMemo(
        () => [
            columnHelper.accessor('binary', {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('host', {
                header: () => <TableHeader text={'호스트'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('status', {
                header: () => <TableHeader text={'상태'} />,
                cell: ({ getValue }) => (
                    <Typography className={getValue() === 'available' ? `${mode}-success` : `${mode}-error`}>
                        {TEXT[getValue()]}
                    </Typography>
                ),
            }),
            columnHelper.accessor('last_updated', {
                header: () => <TableHeader text={'마지막 수정 일시'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('exception', {
                id: 'exception',
                header: () => <TableHeader text={'제외 여부'} />,
                cell: ({ row }) => (
                    <ExceptionSwitch data={row.original} info={computesInfo} setInfo={setComputesInfo} />
                ),
            }),
        ],
        [computesInfo, mode],
    );

    const storageColumns = useMemo(
        () => [
            columnHelper.accessor('binary', {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('host', {
                header: () => <TableHeader text={'호스트'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('status', {
                header: () => <TableHeader text={'상태'} />,
                cell: ({ getValue }) => (
                    <Typography className={getValue() === 'available' ? `${mode}-success` : `${mode}-error`}>
                        {TEXT[getValue()]}
                    </Typography>
                ),
            }),
            columnHelper.accessor('last_updated', {
                header: () => <TableHeader text={'마지막 수정 일시'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('exception', {
                id: 'exception',
                header: () => <TableHeader text={'제외 여부'} />,
                cell: ({ row }) => (
                    <ExceptionSwitch data={row.original} info={storagesInfo} setInfo={setStoragesInfo} />
                ),
            }),
        ],
        [mode, storagesInfo],
    );

    const networkColumns = useMemo(
        () => [
            columnHelper.accessor('binary', {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('host', {
                header: () => <TableHeader text={'호스트'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('status', {
                header: () => <TableHeader text={'상태'} />,
                cell: ({ getValue }) => (
                    <Typography className={getValue() === 'available' ? `${mode}-success` : `${mode}-error`}>
                        {TEXT[getValue()]}
                    </Typography>
                ),
            }),
            columnHelper.accessor('last_updated', {
                header: () => <TableHeader text={'마지막 수정 일시'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('exception', {
                id: 'exception',
                header: () => <TableHeader text={'제외 여부'} />,
                cell: ({ row }) => (
                    <ExceptionSwitch data={row.original} info={networksInfo} setInfo={setNetworksInfo} />
                ),
            }),
        ],
        [mode, networksInfo],
    );

    const onSubmit = () => {
        setEditModal(true);
    };

    // exception: ture(제외) / false(제외 아님)
    return (
        <>
            <Dialog open={open} fullWidth maxWidth={'lg'}>
                <CustomTitle>
                    클러스터 서비스 정보 수정
                    <Tooltip
                        className="detail-tooltip"
                        title={<Typography>클러스터 서비스의 포함 또는 제외 여부를 수정할 수 있습니다.</Typography>}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <ErrorIcon />
                        </div>
                    </Tooltip>
                </CustomTitle>
                <Divider />
                <DialogContent>
                    <TabContext value={value}>
                        <Box>
                            <TabList
                                onChange={handleChange}
                                aria-label="lab API tabs example"
                                sx={{ borderBottom: 1, borderColor: 'divider' }}
                            >
                                <Tab label={<Typography>컴퓨트</Typography>} value="1" />
                                <Tab label={<Typography>블록 스토리지</Typography>} value="2" />
                                <Tab label={<Typography>네트워크</Typography>} value="3" />
                            </TabList>
                        </Box>
                        <StyledPanel value="1" sx={{ padding: 0 }}>
                            <NoPageTable
                                columns={computeColumns}
                                data={computesInfo}
                                isLoading={false}
                                noDataMessage={'컴퓨트 목록이 존재하지 않습니다.'}
                            />
                        </StyledPanel>
                        <StyledPanel value="2" sx={{ padding: 0 }}>
                            <NoPageTable
                                columns={storageColumns}
                                data={storagesInfo}
                                isLoading={false}
                                noDataMessage={'블록 스토리지 목록이 존재하지 않습니다.'}
                            />
                        </StyledPanel>
                        <StyledPanel value="3" sx={{ padding: 0 }}>
                            <NoPageTable
                                columns={networkColumns}
                                data={networksInfo}
                                isLoading={false}
                                noDataMessage={'네트워크 목록이 존재하지 않습니다.'}
                            />
                        </StyledPanel>
                    </TabContext>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <ActionButton buttonType="cancel" onClick={handleClose} />
                    <ActionButton buttonType="edit" type="submit" onClick={onSubmit} />
                </DialogActions>
            </Dialog>

            {editModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={editModal}
                    title={'클러스터 서비스 정보 수정'}
                    onClose={() => {
                        setEditModal(false);
                    }}
                    onConfirm={() =>
                        editClusterService({
                            computes: computesInfo,
                            networks: networksInfo,
                            storages: storagesInfo,
                        })
                    }
                    isLoading={modifyLoading}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    <DialogText title={cluster.name} body={'클러스터 서비스 정보를 수정하시겠습니까?'} />
                </DefaultDialog>
            )}
        </>
    );
};

export default EditClusterStatus;
const StyledPanel = styled(TabPanel)`
    width: 100%;
`;

const CustomTitle = styled(DialogTitle)`
    display: flex;
`;

interface ExceptionSwitchProps {
    info: ClusterStatus['computes'] | ClusterStatus['networks'] | ClusterStatus['storages'];
    setInfo: any;
    data: ClusterServices;
}
const ExceptionSwitch = ({ info, setInfo, data }: ExceptionSwitchProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, binary: string, host: string, id: string) => {
        // computesInfo 를 바꾼다.
        const changedInfo = info.map(v => {
            if (v.binary === binary && v.host === host && v.id === id) {
                return { ...v, exception: e.target.checked };
            } else {
                return { ...v, exception: v?.exception === true ? true : false };
            }
        });
        setInfo(changedInfo);
    };
    return (
        <Switch
            checked={data?.exception === true ? true : false}
            onChange={e => handleChange(e, data.binary, data.host, data.id)}
        />
    );
};
