import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import { Chip, LinearProgress, Tooltip, tooltipClasses, styled as MuiStyled } from '@mui/material';
import styled from 'styled-components';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { _syncStatusCluster } from '../../../../api/center/cluster';
import ClusterSyncStatusTooltip from './ClusterSyncStatusTooltip';
import { chipColor, chipText } from '../../../../constant/chipdata';
import DefaultDialog from '../../../component/common/Dialog/DefaultDialog';
import ActionButton from '../../../component/common/Button/ActionButton';
import { OpenStackCluster } from '../../../../@types/Cluster';
import { clusterSyncStatus as clusterSyncStatusAtom } from '../../../../recoil/atom/Cluster';
import SyncFailedReasonTable from './SyncFailedReasonTable';

interface ClusterSyncStatusProps {
    cluster: OpenStackCluster;
    isLoading: boolean;
}

/**
 * 클러스터 동기화 상태를 나타내주는 컴포넌트
 */
const ClusterSyncStatus = ({ cluster, isLoading }: ClusterSyncStatusProps) => {
    const [lazyLoaded, setLazyLoaded] = useState(false);
    const [failedReasonModal, setFailedReasonModal] = useState(false);

    const clusterSyncStatus = useRecoilValue(clusterSyncStatusAtom);
    const setClusterSyncStatus = useSetRecoilState(clusterSyncStatusAtom);

    let selectedSyncStatus = clusterSyncStatus.filter(v => Number(v.id) === Number(cluster.id));
    let str = selectedSyncStatus?.[0]?.status ?? 'no data';

    const { data: clusterStatus, isLoading: statusLoading } = useQuery(
        ['sync-status', cluster?.id],
        () => _syncStatusCluster(cluster?.id),
        {
            onSuccess: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    if (data) {
                        /**
                         * 같은 값이 있다면 => 업데이트 되는중
                         */
                        const is = clusterSyncStatus.filter(data => Number(data.id) === Number(cluster.id));
                        if (is.length > 0) {
                            // id값이 존재?
                            let newArr = [...clusterSyncStatus];
                            let updateStatus = newArr.map(v => {
                                if (v.id === data?.id) {
                                    return {
                                        ...v,
                                        id: data?.id,
                                        status: data?.status,
                                        progress: data?.progress,
                                        completion: data?.completion,
                                        manual: Number(data.progress) === 100 ? false : true,
                                        init: v?.init ? 'syncing' : 'none',
                                        reasons: data?.reasons ?? [],
                                    };
                                }
                                return v;
                            });
                            setClusterSyncStatus(updateStatus);
                        } else {
                            // id값이 존재하지 않음
                            setClusterSyncStatus([
                                ...clusterSyncStatus,
                                {
                                    id: data?.id,
                                    status: data?.status,
                                    progress: data?.progress,
                                    completion: data?.completion,
                                    manual: Number(data?.progress) === 100 ? false : true,
                                    init: 'sync',
                                    reasons: data?.reasons ?? [],
                                },
                            ]);
                        }
                        return data;
                    }
                }
            },
            enabled:
                !!cluster?.id && str !== 'cluster.sync.state.done' && str !== 'cluster.sync.state.failed' && !isLoading,
            refetchInterval: 5000,
            keepPreviousData: true,
        },
    );

    /**
     * 프로그레스 바가 100퍼센트 완료 되었을 때 0.5초 후 DONE(Chip)으로 변경하기 위한 함수
     */
    const render = useCallback(() => {
        setTimeout(() => {
            setLazyLoaded(true);
        }, 500);
    }, []);

    if (selectedSyncStatus.length > 0) {
        if (selectedSyncStatus[0].status === 'cluster.sync.state.failed') {
            return (
                <>
                    <CustomTooltip
                        title={
                            <ClusterSyncStatusTooltip
                                completion={selectedSyncStatus[0]?.completion ?? []}
                                status={selectedSyncStatus[0]?.status}
                            />
                        }
                    >
                        <CustomChip
                            clickable
                            onClick={() => setFailedReasonModal(true)}
                            label={chipText[selectedSyncStatus[0].status]}
                            color={chipColor[selectedSyncStatus[0].status]}
                        />
                    </CustomTooltip>
                    {failedReasonModal && (
                        <DefaultDialog
                            maxWidth="md"
                            open={failedReasonModal}
                            title={'클러스터 동기화 실패 이유'}
                            customActions={
                                <ActionButton
                                    buttonType="close"
                                    onClick={() => {
                                        setFailedReasonModal(false);
                                    }}
                                />
                            }
                            actionType="close"
                            onClose={() => {}}
                            onConfirm={() => {}}
                        >
                            {selectedSyncStatus[0]?.reasons ? (
                                <SyncFailedReasonTable reasons={selectedSyncStatus[0].reasons} />
                            ) : null}
                        </DefaultDialog>
                    )}
                </>
            );
        } else if (
            selectedSyncStatus[0].status === 'cluster.sync.state.unknown' ||
            selectedSyncStatus[0].status === 'cluster.sync.state.loading'
        ) {
            return (
                <CustomChip
                    label={chipText[selectedSyncStatus[0].status]}
                    color={chipColor[selectedSyncStatus[0].status]}
                />
            );
        }
        // progress bar를 100까지 채운 후 DONE 을 보여주기 위함
        if (
            selectedSyncStatus[0].status === 'cluster.sync.state.running' ||
            selectedSyncStatus[0].status === 'cluster.sync.state.init'
        ) {
            return (
                <CustomTooltip
                    title={
                        <ClusterSyncStatusTooltip
                            completion={selectedSyncStatus?.[0]?.completion ?? []}
                            status={selectedSyncStatus[0]?.status}
                        />
                    }
                >
                    <StyledLinearProgress
                        variant="determinate"
                        value={selectedSyncStatus?.[0]?.progress ? Number(selectedSyncStatus?.[0]?.progress) : 0}
                    />
                </CustomTooltip>
            );
        } else if (
            selectedSyncStatus[0].status === 'cluster.sync.state.done' &&
            selectedSyncStatus[0].manual === true
        ) {
            return (
                <CustomTooltip
                    title={
                        <ClusterSyncStatusTooltip
                            completion={selectedSyncStatus[0]?.completion ?? []}
                            status={selectedSyncStatus[0]?.status}
                        />
                    }
                >
                    {/* <StyledLinearProgress variant="determinate" value={Number(selectedSyncStatus[0]?.progress) ?? 0} /> */}
                    <CustomChip
                        label={chipText[selectedSyncStatus[0].status]}
                        color={chipColor[selectedSyncStatus[0].status]}
                    />
                </CustomTooltip>
            );
        } else if (selectedSyncStatus[0].status === 'cluster.sync.state.done' && !selectedSyncStatus[0].manual) {
            if (selectedSyncStatus[0].init === 'syncing') {
                render();
                return (
                    <>
                        <CustomTooltip
                            title={
                                <ClusterSyncStatusTooltip
                                    completion={selectedSyncStatus[0]?.completion ?? []}
                                    status={selectedSyncStatus[0]?.status}
                                />
                            }
                        >
                            {lazyLoaded ? (
                                <CustomChip
                                    label={chipText[selectedSyncStatus[0].status]}
                                    color={chipColor[selectedSyncStatus[0].status]}
                                />
                            ) : (
                                <StyledLinearProgress
                                    variant="determinate"
                                    value={Number(selectedSyncStatus[0]?.progress) ?? 0}
                                />
                            )}
                        </CustomTooltip>
                    </>
                );
            } else {
                return (
                    <CustomTooltip
                        title={
                            <ClusterSyncStatusTooltip
                                completion={selectedSyncStatus[0]?.completion ?? []}
                                status={selectedSyncStatus[0]?.status}
                            />
                        }
                    >
                        <CustomChip
                            label={chipText[selectedSyncStatus[0].status]}
                            color={chipColor[selectedSyncStatus[0].status]}
                        />
                    </CustomTooltip>
                );
            }
        } else return null;
    } else if (statusLoading) return <CustomChip label={chipText['loading']} color={chipColor['loading']} />;
    else {
        return (
            <CustomChip
                label={chipText[clusterStatus?.[0]?.status ? clusterStatus?.[0].status : 'cluster.sync.state.error']}
                color={chipColor[clusterStatus?.[0]?.status ? clusterStatus?.[0].status : 'cluster.sync.state.error']}
            />
        );
    }
};

export default ClusterSyncStatus;

const StyledLinearProgress = MuiStyled(LinearProgress)(({ theme }) => ({
    height: '7px',
    borderRadius: '5px',
    '& .MuiLinearProgress-barColorPrimary': {
        backgroundColor: theme.palette.primary[theme.palette.mode],
    },
    '& .MuiLinearProgress-barColorError': {
        backgroundColor: theme.palette.error[theme.palette.mode],
    },
}));

const CustomChip = styled(Chip).attrs({ size: 'small' })``;
const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    () => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'transparent',
            minWidth: 400,
        },
    }),
);
