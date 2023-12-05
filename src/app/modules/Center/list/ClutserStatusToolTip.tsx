import { Paper, Typography, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import styled from 'styled-components';

import { ClusterStatus } from '../../../../@types/Cluster';
import { TEXT } from '../../../../constant/text';
import { isAvailableServices } from '../../../../libs/utils/commonFunction';

interface ClutserStatusToolTipProps {
    clusterStatus: ClusterStatus;
}
/**
 * 클러스터 상태 툴팁
 */
const ClutserStatusToolTip = ({ clusterStatus }: ClutserStatusToolTipProps) => {
    const theme = useTheme();
    const mode = theme.palette.mode;

    const getTextColor = (text: string) => {
        if (text === TEXT['unavailable']) {
            return `${mode}-error`;
        } else if (text === TEXT['available']) {
            return `${mode}-success`;
        } else {
            return `${mode}-default`;
        }
    };
    return (
        <ToolTipWrapper>
            <Wrapper>
                <Title>
                    <Typography>컴퓨트</Typography>
                </Title>
                <Content>
                    <Typography
                        className={getTextColor(
                            isAvailableServices(clusterStatus.computes, clusterStatus?.compute_error),
                        )}
                    >
                        {isAvailableServices(clusterStatus?.computes, clusterStatus?.compute_error)}
                    </Typography>
                </Content>
                <Title>
                    <Typography>블록 스토리지</Typography>
                </Title>
                <Content>
                    <Typography
                        className={getTextColor(
                            isAvailableServices(clusterStatus?.storages, clusterStatus?.storage_error),
                        )}
                    >
                        {isAvailableServices(clusterStatus?.storages, clusterStatus?.storage_error)}
                    </Typography>
                </Content>
                <Title>
                    <Typography>네트워크</Typography>
                </Title>
                <Content>
                    <Typography
                        className={getTextColor(
                            isAvailableServices(clusterStatus?.networks, clusterStatus?.network_error),
                        )}
                    >
                        {isAvailableServices(clusterStatus?.networks, clusterStatus?.network_error)}
                    </Typography>
                </Content>
            </Wrapper>
        </ToolTipWrapper>
    );
};

export default ClutserStatusToolTip;

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
