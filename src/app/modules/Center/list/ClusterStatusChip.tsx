import { Chip, Tooltip, tooltipClasses } from '@mui/material';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import ClutserStatusToolTip from './ClutserStatusToolTip';
import { chipColor, chipText } from '../../../../constant/chipdata';
import { clusterStatusKeys } from '../../../../libs/utils/queryKeys';
import { _getClusterStatus } from '../../../../api/center/cluster';
import { PATHNAME } from '../../../../constant/pathname';
import useGetClusterConfig from '../../../../hooks/useGetClusterConfig';

interface ClusterStatusChipProps {
    clusterID: number;
    isLoading?: boolean;
    isClickable?: boolean;
}

/**
 * 클러스터 상태정보 Chip
 */
const ClusterStatusChip = ({ clusterID, isLoading = false, isClickable = true }: ClusterStatusChipProps) => {
    const navigate = useNavigate();

    const { clusterConfig } = useGetClusterConfig(clusterID);

    /**
     * 클러스터 상태를 조회하는 함수
     */
    const { data: clusterStatus, isLoading: statusLoading } = useQuery(
        clusterStatusKeys.detail(clusterID),
        () => _getClusterStatus(clusterID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data;
                }
            },
            refetchInterval: isNaN(clusterConfig?.timestamp_interval ? clusterConfig?.timestamp_interval : 5 * 60000)
                ? 60000
                : clusterConfig?.timestamp_interval
                ? clusterConfig?.timestamp_interval
                : 1 * 60000,
            enabled: !isLoading,
        },
    );

    // console.log(clusterID);
    // console.log(clusterStatus);
    return (
        <CustomTooltip title={clusterStatus ? <ClutserStatusToolTip clusterStatus={clusterStatus} /> : null}>
            <CustomChip
                onClick={() => {
                    if (isClickable) {
                        navigate(`${PATHNAME.OPENSTACK_CLUSTER_DETAIL}/${clusterID}`, { state: { clusterID } });
                    }
                }}
                color={chipColor[statusLoading ? 'loading' : clusterStatus ? clusterStatus.status : 'none']}
                label={chipText[statusLoading ? 'loading' : clusterStatus ? clusterStatus.status : 'none']}
            />
        </CustomTooltip>
    );
};

export default React.memo(ClusterStatusChip);

const CustomChip = styled(Chip).attrs({ size: 'small' })``;
const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    () => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'transparent',
        },
    }),
);
