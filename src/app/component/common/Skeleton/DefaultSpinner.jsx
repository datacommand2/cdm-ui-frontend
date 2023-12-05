import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

const DefaultSpinner = () => {
    return (
        <Wrapper>
            <CircularProgress />
        </Wrapper>
    );
};

export default DefaultSpinner;

const Wrapper = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 600px;
`;
