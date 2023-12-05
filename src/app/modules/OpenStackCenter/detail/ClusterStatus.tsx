import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { IconButton, Tab, Tooltip, Typography, useTheme, PaletteMode } from '@mui/material';
import TabContext from '@mui/lab/TabContext/TabContext';
import TabList from '@mui/lab/TabList/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { createColumnHelper } from '@tanstack/react-table';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import EditClusterStatus from './EditClusterStatus';
import ClusterConfigModal from './ClusterConfigModal';
import useGetClusterConfig from '../../../../hooks/useGetClusterConfig';
import { clusterKeys, clusterStatusKeys } from '../../../../libs/utils/queryKeys';
import { _getClusterDetail, _getClusterStatus } from '../../../../api/center/cluster';
import TableHeader from '../../../component/common/Table/TableHeader';
import WarningTooltip from '../../../component/common/ToolTip/WarningTooltip';
import { TEXT } from '../../../../constant/text';
import NoPageTable from '../../../component/common/Table/NoPageTable';
import { sortObjectArray, isAvailableServices } from '../../../../libs/utils/commonFunction';
import { Detail } from '../../../component/common/Detail/Detail';
import TitleContentSkeleton from '../../../component/common/Skeleton/TitleContentSkeleton';
import { LoginUser } from '../../../../recoil/atom/LoginUser';
import { ClusterStatus as ClusterStatusInterface } from '../../../../@types/Cluster';

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

/**
 * 클러스터 서비스 정보 목록을 보여주는 컴포넌트
 */
const ClusterStatus = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const [value, setValue] = useState('1');
    const [editModal, setEditModal] = useState(false);
    const [settingModal, setSettingModal] = useState(false);
    const location = useLocation();
    const ClusterID = Number(location.state.clusterID);

    const loginUser = useRecoilValue(LoginUser);
    const role = loginUser?.roles ? loginUser.roles[0]?.role : 'user';

    const { configLoading, clusterConfig } = useGetClusterConfig(ClusterID);
    const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
        setValue(newValue);
    };

    const isDeleted = (deleted: boolean | undefined) => {
        if (deleted) {
            return { textDecoration: 'line-through' };
        } else {
            return {};
        }
    };

    // 클러스터 정보를 불러오는 함수
    const { data: clusterDetail } = useQuery(clusterKeys.detail(ClusterID), () => _getClusterDetail(ClusterID), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                return data.cluster;
            }
        },
        suspense: true,
    });

    /**
     * 클러스터 상태를 조회하는 함수
     */
    const { data: clusterStatus, isLoading: statusLoading } = useQuery(
        clusterStatusKeys.detail(ClusterID),
        () => _getClusterStatus(ClusterID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data;
                } else if (status === 204) {
                    return null;
                }
            },
            refetchInterval: isNaN(clusterConfig?.timestamp_interval ?? 5 * 60000)
                ? 60000
                : clusterConfig?.timestamp_interval ?? 1 * 60000,
            enabled: !configLoading,
            suspense: true,
        },
    );

    const computeColumns = useMemo(
        () => [
            columnHelper.accessor('binary', {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ row, getValue }) => {
                    return (
                        <LabelWrapper>
                            <Typography sx={isDeleted(row.original?.deleted)}>{getValue()}</Typography>
                            {row.original?.deleted && (
                                <WarningTooltip
                                    title={
                                        '사용자가 해당 서비스를 삭제했거나 조회에 실패했습니다. 오픈스택을 확인해야 합니다.'
                                    }
                                />
                            )}
                        </LabelWrapper>
                    );
                },
            }),
            columnHelper.accessor('host', {
                header: () => <TableHeader text={'호스트'} />,
                cell: ({ row, getValue }) => (
                    <Typography sx={isDeleted(row.original?.deleted)}>{getValue()}</Typography>
                ),
            }),
            columnHelper.accessor('zone', {
                header: () => <TableHeader text={'가용구역'} />,
                cell: ({ row, getValue }) => (
                    <Typography sx={isDeleted(row.original?.deleted)}>{getValue()}</Typography>
                ),
            }),
            columnHelper.accessor('status', {
                header: () => <TableHeader text={'상태'} />,
                cell: ({ row, getValue }) => (
                    <Typography
                        sx={isDeleted(row.original?.deleted)}
                        className={getValue() === 'available' ? `${mode}-success` : `${mode}-error`}
                    >
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
                    <Typography sx={isDeleted(row.original?.deleted)}>
                        {row.original?.exception === true ? 'O' : 'X'}
                    </Typography>
                ),
            }),
        ],
        [mode],
    );

    const storageColumns = useMemo(
        () => [
            columnHelper.accessor('binary', {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ row, getValue }) => {
                    return (
                        <LabelWrapper>
                            <Typography sx={isDeleted(row.original?.deleted)}>{getValue()}</Typography>
                            {row.original?.deleted && (
                                <WarningTooltip
                                    title={
                                        '사용자가 해당 서비스를 삭제했거나 조회에 실패했습니다. 오픈스택을 확인해야 합니다.'
                                    }
                                />
                            )}
                        </LabelWrapper>
                    );
                },
            }),
            columnHelper.accessor('host', {
                header: () => <TableHeader text={'호스트'} />,
                cell: ({ row, getValue }) => (
                    <Typography sx={isDeleted(row.original?.deleted)}>{getValue()}</Typography>
                ),
            }),
            columnHelper.accessor('zone', {
                header: () => <TableHeader text={'가용구역'} />,
                cell: ({ row, getValue }) => (
                    <Typography sx={isDeleted(row.original?.deleted)}>{getValue()}</Typography>
                ),
            }),
            columnHelper.accessor('status', {
                header: () => <TableHeader text={'상태'} />,
                cell: ({ row, getValue }) => (
                    <Typography
                        sx={isDeleted(row.original?.deleted)}
                        className={getValue() === 'available' ? `${mode}-success` : `${mode}-error`}
                    >
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
                    <Typography sx={isDeleted(row.original?.deleted)}>
                        {row.original?.exception === true ? 'O' : 'X'}
                    </Typography>
                ),
            }),
        ],
        [mode],
    );

    const networkColumns = useMemo(
        () => [
            columnHelper.accessor('binary', {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ row, getValue }) => {
                    return (
                        <LabelWrapper>
                            <Typography sx={isDeleted(row.original?.deleted)}>{getValue()}</Typography>
                            {row.original?.deleted && (
                                <WarningTooltip
                                    title={
                                        '사용자가 해당 서비스를 삭제했거나 조회에 실패했습니다. 오픈스택을 확인해야 합니다.'
                                    }
                                />
                            )}
                        </LabelWrapper>
                    );
                },
            }),
            columnHelper.accessor('host', {
                header: () => <TableHeader text={'호스트'} />,
                cell: ({ row, getValue }) => (
                    <Typography sx={isDeleted(row.original?.deleted)}>{getValue()}</Typography>
                ),
            }),
            columnHelper.accessor('type', {
                header: () => <TableHeader text={'타입'} />,
                cell: ({ row, getValue }) => (
                    <Typography sx={isDeleted(row.original?.deleted)}>{getValue()}</Typography>
                ),
            }),
            columnHelper.accessor('status', {
                header: () => <TableHeader text={'상태'} />,
                cell: ({ row, getValue }) => (
                    <Typography
                        sx={isDeleted(row.original?.deleted)}
                        className={getValue() === 'available' ? `${mode}-success` : `${mode}-error`}
                    >
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
                    <Typography sx={isDeleted(row.original?.deleted)}>
                        {row.original?.exception === true ? 'O' : 'X'}
                    </Typography>
                ),
            }),
        ],
        [mode],
    );

    if (statusLoading) {
        return <TitleContentSkeleton />;
    } else {
        return (
            <Detail>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Detail.Title text={'클러스터 서비스 정보'} style={{ paddingBottom: '0px' }}></Detail.Title>
                    {(role === 'admin' || role === 'manager') && (
                        <>
                            <span>
                                <Tooltip title={<Typography>클러스터 서비스 정보 수정</Typography>}>
                                    <IconButton sx={{ padding: 0.5 }} onClick={() => setEditModal(true)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </span>
                            <span>
                                <Tooltip title={<Typography>클러스터 서비스 갱신 주기 설정</Typography>}>
                                    <IconButton sx={{ padding: 0.5 }} onClick={() => setSettingModal(true)}>
                                        <SettingsIcon />
                                    </IconButton>
                                </Tooltip>
                            </span>
                        </>
                    )}
                </div>
                <Detail.Body>
                    <TabContext value={value}>
                        <TabList
                            onChange={handleChange}
                            aria-label="lab API tabs example"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab
                                label={
                                    <LabelWrapper>
                                        <StyledTabTitle
                                            label={'컴퓨트'}
                                            data={clusterStatus?.computes}
                                            error={clusterStatus?.compute_error}
                                            mode={mode}
                                        />
                                        {clusterStatus?.compute_error &&
                                            clusterStatus.status !== 'cluster.state.active' && (
                                                <WarningTooltip title={TEXT[clusterStatus?.compute_error]} />
                                            )}
                                    </LabelWrapper>
                                }
                                value="1"
                            />
                            <Tab
                                label={
                                    <LabelWrapper>
                                        <StyledTabTitle
                                            label={'블록 스토리지'}
                                            data={clusterStatus?.storages}
                                            error={clusterStatus?.storage_error}
                                            mode={mode}
                                        />
                                        {clusterStatus?.storage_error &&
                                            clusterStatus.status !== 'cluster.state.active' && (
                                                <WarningTooltip title={TEXT[clusterStatus?.storage_error]} />
                                            )}
                                    </LabelWrapper>
                                }
                                value="2"
                            />
                            <Tab
                                label={
                                    <LabelWrapper>
                                        <StyledTabTitle
                                            label={'네트워크'}
                                            data={clusterStatus?.networks}
                                            error={clusterStatus?.network_error}
                                            mode={mode}
                                        />
                                        {clusterStatus?.network_error &&
                                            clusterStatus.status !== 'cluster.state.active' && (
                                                <WarningTooltip title={TEXT[clusterStatus?.network_error]} />
                                            )}
                                    </LabelWrapper>
                                }
                                value="3"
                            />
                        </TabList>
                        <StyledPanel value="1" sx={{ padding: 0 }}>
                            <NoPageTable
                                columns={computeColumns}
                                data={sortObjectArray(clusterStatus?.computes ?? [], 'binary')}
                                isLoading={false}
                                noDataMessage={'컴퓨트 목록이 존재하지 않습니다.'}
                            />
                        </StyledPanel>
                        <StyledPanel value="2" sx={{ padding: 0 }}>
                            <NoPageTable
                                columns={storageColumns}
                                data={clusterStatus?.storages ?? []}
                                isLoading={false}
                                noDataMessage={'블록 스토리지 목록이 존재하지 않습니다.'}
                            />
                        </StyledPanel>
                        <StyledPanel value="3" sx={{ padding: 0 }}>
                            <NoPageTable
                                columns={networkColumns}
                                data={clusterStatus?.networks ?? []}
                                isLoading={false}
                                noDataMessage={'네트워크 목록이 존재하지 않습니다.'}
                            />
                        </StyledPanel>
                    </TabContext>

                    {editModal && clusterDetail && (
                        <EditClusterStatus
                            open={editModal}
                            handleClose={() => setEditModal(false)}
                            computes={clusterStatus?.computes ?? []}
                            networks={clusterStatus?.networks ?? []}
                            storages={clusterStatus?.storages ?? []}
                            cluster={clusterDetail}
                        />
                    )}
                    {settingModal && clusterDetail && (
                        <ClusterConfigModal
                            open={settingModal}
                            handleClose={() => setSettingModal(false)}
                            data={clusterDetail}
                        />
                    )}
                </Detail.Body>
            </Detail>
        );
    }
};

export default ClusterStatus;

const StyledPanel = styled(TabPanel)`
    width: 100%;
`;

interface StyledTabTitleProps {
    label: string;
    data:
        | ClusterStatusInterface['computes']
        | ClusterStatusInterface['networks']
        | ClusterStatusInterface['storages']
        | undefined;
    error: string | undefined;
    mode: PaletteMode;
}
const StyledTabTitle = ({ label, data, error, mode }: StyledTabTitleProps) => {
    return <Typography className={getTextColor(isAvailableServices(data, error), mode)}>{label}</Typography>;
};

const getTextColor = (text: string, mode: PaletteMode) => {
    if (text === TEXT['available']) {
        return `${mode}-success`;
    } else if (text === TEXT['unavailable']) {
        return `${mode}-warning`;
    } else return 'muted-text';
};

const LabelWrapper = styled.div`
    display: flex;
`;
