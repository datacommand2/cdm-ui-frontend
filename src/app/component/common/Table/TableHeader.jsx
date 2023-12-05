import { Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

/**
 * TableHeader
 */
const TableHeader = ({ text }) => {
    return <HeaderText>{text}</HeaderText>;
};

export default TableHeader;

const HeaderText = styled(Typography)`
    font-weight: 600;
`;
