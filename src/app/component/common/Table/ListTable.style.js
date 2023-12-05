import styled, { css } from 'styled-components';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Box from '@mui/material/Box';

const ListWrapper = styled(Box)`
    /* height: 100%; */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 2rem 0;
`;

const ListTableContainer = styled(TableContainer)`
    overflow-x: auto;
    height: 100%;
`;
const NoPageListTableContainer = styled(TableContainer)`
    overflow-x: auto;
    height: 100%;
    padding: 0 3rem;
    width: 100%;
    padding: 0;
`;

const ListTable = styled(Table).attrs({ size: 'small' })`
    min-width: var(--table-width);
`;

const ListTableHead = styled(TableHead)`
    white-space: nowrap;
    table-layout: fixed;
    font-weight: 500;
`;

const ListTableBody = styled(TableBody)``;

const ListTableRow = styled(TableRow)`
    cursor: pointer;
    &:hover {
        background-color: rgba(0, 0, 0, 0.06);
    }
`;
const ListTableSubRow = styled(TableRow)``;

const ListTableHeaderCell = styled(TableCell)`
    ${props =>
        (props?.id === 'actions' || props?.id === 'exception') &&
        css`
            width: 5%;
        `}
`;

const ListTableContentCell = styled(TableCell)`
    white-space: nowrap;
`;
const ListTableSubContentCell = styled(TableCell)``;

const LoadingSpinner = styled(Box)`
    display: flex;
    align-items: center;

    & > p {
        margin-right: 8px;
        margin-left: 8px;
    }
`;

export {
    ListTable,
    ListTableHead,
    ListTableBody,
    ListTableRow,
    ListTableHeaderCell,
    ListTableContentCell,
    ListTableSubRow,
    ListTableSubContentCell,
    ListTableContainer,
    ListWrapper,
    NoPageListTableContainer,
    LoadingSpinner,
};
