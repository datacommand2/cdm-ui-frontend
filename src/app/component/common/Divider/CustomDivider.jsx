import { Divider } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

/**
 * CustomDivider
 */
const CustomDivider = () => {
    return <SDivider />;
};

export default CustomDivider;

const SDivider = styled(Divider)`
    margin-top: 1rem;
    margin-bottom: 2rem;
`;
