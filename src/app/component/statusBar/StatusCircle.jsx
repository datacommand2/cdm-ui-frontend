import { useTheme } from '@mui/material';
import React from 'react';
import styled, { css } from 'styled-components';

const StatusCircle = ({ circle }) => {
    const theme = useTheme();
    const mode = theme.palette.mode;

    const circleColor = circle => {
        if (circle === 'success' || circle === 'rolled-back' || circle === 'recovered') {
            return `${mode}-success-bg`;
        }
        if (
            circle === 'warn' ||
            circle === 'warning' ||
            circle === 'ignored' ||
            circle === 'canceled' ||
            circle === 'rolling-back' ||
            circle === 'rollback-ingnored'
        ) {
            return `${mode}-warning-bg`;
        }
        if (circle === 'failed' || circle === 'excepted') {
            return `${mode}-error-bg`;
        }
        if (circle === 'booting' || circle === 'being-recovered') {
            return `${mode}-primary-bg`;
        }
    };
    return <StyledCircle className={circleColor(circle)} type={circle} />;
};

export default StatusCircle;

const StyledCircle = styled.div`
    border-radius: 50%;
    font-size: ${({ theme }) => theme.fontSize.md};
    height: 10px;
    line-height: 1;
    width: 10px;
    padding: 1px;
    margin-top: 2px;
    ${props =>
        props.type === 'success' || props.type === 'rolled-back' || props.type === 'recovered'
            ? css``
            : props.type === 'warn' ||
              props.type === 'warning' ||
              props.type === 'ignored' ||
              props.type === 'canceled' ||
              props.type === 'rolling-back' ||
              props.type === 'rollback-ingnored'
            ? css``
            : props.type === 'failed' || props.type === 'excepted'
            ? css``
            : props.type === 'booting' || props.type === 'being-recovered'
            ? css``
            : css`
                  display: none;
              `}
`;
