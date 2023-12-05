import styled from 'styled-components';
import Box from '@mui/material/Box';
import { Pagination } from '@mui/material';

const PaginationWrapper = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    padding-bottom: 4px;
`;

const PaginationButtonGroup = styled.div``;

const PaginationMovePageGroup = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;

    & > .MuiInputBase-root {
        margin-right: 8px;
        width: 6rem;
    }
`;

const PaginationPageSizeGroup = styled.div`
    & > div {
        margin-right: 8px;
    }
    display: flex;
    align-items: center;
`;

const LoadingSpinner = styled(Box)`
    display: flex;
    align-items: center;

    & > p {
        margin-right: 8px;
        margin-left: 8px;
    }
`;

const CustomPagination = styled(Pagination)`
    & button {
        padding: 0;
    }
`;

export {
    CustomPagination,
    PaginationWrapper,
    PaginationButtonGroup,
    PaginationMovePageGroup,
    PaginationPageSizeGroup,
    LoadingSpinner,
};
