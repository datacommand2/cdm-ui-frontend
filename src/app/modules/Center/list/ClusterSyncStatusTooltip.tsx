import { Paper, Typography, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import styled from 'styled-components';
import {
    ClusterServiceSyncProgress,
    ClusterServiceSyncTypeCode,
    ClusterSyncCompletion,
    ClusterSyncStatus,
} from '../../../../@types/Cluster';
import { ClusterServiceSyncMap, ClusterServiceSyncProgressMap } from '../../../../constant/OpenStack';
import { TEXT } from '../../../../constant/text';

const SyncStatus = [
    'cluster.tenant.list.sync',
    'cluster.availability_zone.list.sync',
    'cluster.hypervisor.list.sync',
    'cluster.security_group.list.sync',
    'cluster.network.list.sync',
    'cluster.router.list.sync',
    'cluster.storage.list.sync',
    'cluster.volume.list.sync',
    'cluster.volume-snapshot.list.sync',
    'cluster.keypair.list.sync',
    'cluster.instance.list.sync',
] as ClusterServiceSyncTypeCode[];

interface ClusterSyncStatusTooltipProps {
    completion: ClusterSyncCompletion[];
    status: ClusterSyncStatus['status'];
}
/**
 * 클러스터 동기화 상태 툴팁 컴포넌트
 */
const ClusterSyncStatusTooltip = ({ completion = [], status }: ClusterSyncStatusTooltipProps) => {
    const theme = useTheme();
    const mode = theme.palette.mode;

    const getTextColor = (text: ClusterServiceSyncProgress) => {
        if (text === 'cluster.sync.completed') {
            return `${mode}-primary`;
        } else if (text === 'cluster.sync.running') {
            return `${mode}-success`;
        } else if (text === 'cluster.sync.failed') {
            return `${mode}-error`;
        } else return `${mode}-default`;
    };

    // SyncStatus에 적힌 순서대로 정렬
    const sortedCompletion = SyncStatus.map(value => completion.find(item => item.resource === value));

    if (completion.length === 0 && status === 'cluster.sync.state.done') {
        return <DefaultToolTip label={'cluster.sync.completed'} />;
    }
    if (completion.length > 0) {
        return (
            <ToolTipWrapper>
                <Wrapper>
                    {sortedCompletion.map(service => {
                        if (service) {
                            return (
                                <React.Fragment key={ClusterServiceSyncMap[service.resource]}>
                                    <Title>
                                        <Typography>{ClusterServiceSyncMap[service.resource]}</Typography>
                                    </Title>
                                    <Content>
                                        <Typography
                                            className={getTextColor(service?.progress_status ?? 'cluster.sync.waiting')}
                                        >
                                            {
                                                ClusterServiceSyncProgressMap[
                                                    service?.progress_status ?? 'cluster.sync.waiting'
                                                ]
                                            }
                                        </Typography>
                                    </Content>
                                </React.Fragment>
                            );
                        } else {
                            return null;
                        }
                    })}
                </Wrapper>
            </ToolTipWrapper>
        );
    } else {
        return <DefaultToolTip label={'cluster.sync.waiting'} />;
    }
};

export default ClusterSyncStatusTooltip;

interface DefaultToolTipProps {
    label: ClusterServiceSyncProgress;
}
const DefaultToolTip = ({ label }: DefaultToolTipProps) => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const getTextColor = (text: ClusterServiceSyncProgress) => {
        if (text === 'cluster.sync.completed') {
            return `${mode}-primary`;
        } else if (text === 'cluster.sync.running') {
            return `${mode}-success`;
        } else if (text === 'cluster.sync.failed') {
            return `${mode}-error`;
        } else return `${mode}-default`;
    };
    return (
        <ToolTipWrapper>
            <Wrapper>
                {SyncStatus.map(service => {
                    return (
                        <React.Fragment key={service}>
                            <Title>
                                <Typography>{ClusterServiceSyncMap[service]}</Typography>
                            </Title>
                            <Content>
                                <Typography className={getTextColor(label)}>{TEXT[label]}</Typography>
                            </Content>
                        </React.Fragment>
                    );
                })}
            </Wrapper>
        </ToolTipWrapper>
    );
};

const ToolTipWrapper = styled(Paper).attrs({ elevation: 3 })`
    padding: 1rem;
`;
const Wrapper = styled(Grid2).attrs({ container: true, rowSpacing: 2 })`
    display: flex;
    justify-content: space-between;
`;

const Title = styled(Grid2).attrs({ xs: 6 })`
    & > p {
        font-weight: 700;
    }
`;

const Content = styled(Grid2).attrs({ xs: 6 })`
    text-align: right;
    & > p {
        font-weight: 700;
    }
`;
