import { Box, Paper, Typography } from '@mui/material';
import styled from 'styled-components';

const BreadCrumbsWrapper = styled(Box)`
    display: flex;
`;

const PageTitle = styled(Typography).attrs({ variant: 'h6' })``;

const Layout = styled(Paper).attrs({ variant: 'outlined' })`
    border-radius: 0;
    display: flex;
    align-items: center;
    padding: 1rem 0 1rem 1rem;
    border: none;
`;

export { BreadCrumbsWrapper, PageTitle, Layout };
