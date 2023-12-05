import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { Button, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

const DefaultButton = ({
    text,
    type = '',
    loadingButton = false,
    onClick = () => {},
    disabled = false,
    isLoading = false,
    size = 'md',
}) => {
    if (!loadingButton) {
        return (
            <StyledButton color="primary" type={type} onClick={onClick} disabled={disabled}>
                <Typography>{text}</Typography>
            </StyledButton>
        );
    } else {
        return (
            <StyledLoadingButton
                color="primary"
                size={size}
                disabled={disabled}
                loading={isLoading}
                type={type}
                onClick={onClick}
                loadingPosition="center"
            >
                <Typography>{text}</Typography>
            </StyledLoadingButton>
        );
    }
};

export default DefaultButton;

const StyledButton = styled(Button).attrs({ variant: 'contained' })`
    margin: 0 0.25rem;
`;
const StyledLoadingButton = styled(LoadingButton).attrs({ variant: 'contained' })`
    margin: 0 0.25rem;
`;
