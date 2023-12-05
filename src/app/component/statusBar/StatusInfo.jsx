import { Box, useTheme } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { css } from 'styled-components';

/**
 * 준비중, 기동중, 성공, 경고, 실패
 */
const StatusInfo = ({ type, circle, text }) => {
    const theme = useTheme();
    const mode = theme.palette.mode;

    const circleColor = circle => {
        if (circle === 'success') {
            return `${mode}-success-bg`;
        }
        if (circle === 'primary') {
            return `${mode}-primary-bg`;
        }
        if (circle === 'warn') {
            return `${mode}-warning-bg`;
        }
    };

    const jobStatusColor = type => {
        if (type === 'preparing') {
            return `${mode}-job-${type}`;
        }
        if (type === 'completed') {
            return `${mode}-job-${type}`;
        }
        if (type === 'fail') {
            return `${mode}-job-${type}`;
        }
    };
    return (
        <StyledBox>
            <StyledPanel className={jobStatusColor(type)} type={type}>
                {circle && <StyledCircle className={circleColor(circle)} type={circle} />}
            </StyledPanel>
            {text}
        </StyledBox>
    );
};

export default StatusInfo;

const StyledBox = styled(Box)`
    display: flex;
`;

const StyledPanel = styled.div`
    font-size: ${({ theme }) => theme.fontSize.md};
    height: 20px;
    line-height: 1;
    width: 20px;
    padding: 1px;
    margin-right: 0.2rem;
`;

const StyledCircle = styled.div`
    border-radius: 50%;
    font-size: ${({ theme }) => theme.fontSize.md};
    height: 10px;
    line-height: 1;
    width: 10px;
    padding: 1px;
    ${props => (props.type === 'success' ? css`` : props.type === 'warn' ? css`` : css``)}
`;
