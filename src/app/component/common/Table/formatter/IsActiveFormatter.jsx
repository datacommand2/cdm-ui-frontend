import React from 'react';
import Typography from '@mui/material/Typography';
import { Box, Paper, Tooltip, tooltipClasses, useTheme } from '@mui/material';
import styled from 'styled-components';

import { findLastWord } from '../../../../../libs/utils/commonFunction';

const IsActiveFormatter = ({ cluster }) => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const clusterState = cluster?.state_code ? cluster?.state_code : cluster?.status?.state_code;

    const name = cluster?.name;

    return (
        <CustomTooltip title={<ToolTipContent name={name} status={findLastWord(clusterState)} />}>
            <Typography
                sx={{ width: 'fit-content' }}
                className={
                    clusterState === 'cluster.state.active'
                        ? `${mode}-active-cluster`
                        : clusterState === 'cluster.state.inactive'
                        ? `${mode}-inactive-cluster`
                        : `${mode}-warning-cluster`
                }
            >
                {name}
            </Typography>
        </CustomTooltip>
    );
};

export default IsActiveFormatter;

const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'transparent',
        },
    }),
);

const ToolTipContent = ({ name, status }) => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    return (
        <ToolTipWrapper>
            <Wrapper>
                <ClusterStatusWrapper>
                    <Typography sx={{ fontWeight: 700 }}>{name}, </Typography>
                    &nbsp; &nbsp;
                    <Typography
                        className={
                            status === 'active'
                                ? `${mode}-success`
                                : status === 'inactive'
                                ? `${mode}-error`
                                : `${mode}-warning`
                        }
                    >
                        {status}
                    </Typography>
                </ClusterStatusWrapper>
                <Box>{status === 'inactive' && <Typography>클러스터 확인이 필요합니다.</Typography>}</Box>
            </Wrapper>
        </ToolTipWrapper>
    );
};

const ClusterStatusWrapper = styled(Box)`
    display: flex;
`;

const ToolTipWrapper = styled(Paper).attrs({ elevation: 3 })`
    padding: 1.5rem;
`;

const Wrapper = styled(Box)`
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
