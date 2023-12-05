import { TableContainer, Table, TableHead, TableRow, TableBody } from '@mui/material';
import styled from 'styled-components';

const ResourceTable = ({ children }) => {
    return (
        <TableContainer>
            <StyledTable>{children}</StyledTable>
        </TableContainer>
    );
};

const Head = ({ children }) => {
    return (
        <TableHead>
            <TableRow>{children}</TableRow>
        </TableHead>
    );
};
const Body = ({ children }) => {
    return <TableBody>{children}</TableBody>;
};

export const PlanResourceTable = Object.assign(ResourceTable, {
    Head,
    Body,
});

const StyledTable = styled(Table)`
    & th,
    td {
        text-align: center;
    }
`;
