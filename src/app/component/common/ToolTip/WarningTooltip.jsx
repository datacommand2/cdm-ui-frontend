import { IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';

const WarningTooltip = ({ title }) => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    return (
        <Tooltip title={<Typography>{title}</Typography>}>
            <StyledIconButton className={`${mode}-warning`}>
                <WarningOutlinedIcon className={`${mode}-warning`} />
            </StyledIconButton>
        </Tooltip>
    );
};

export default WarningTooltip;

const StyledIconButton = styled(IconButton)`
    padding: 0;
`;
