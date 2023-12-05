import styled from 'styled-components';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { Box } from '@mui/material';

/**
 * 헤더 컴포넌트 스타일
 */
const CustomHeader = styled(AppBar)`
    padding: 0 !important;
    /* position: fixed; */
    z-index: 500;
    position: sticky;
    width: 100%;
    box-shadow: none;

    ${({ theme }) => theme.breakpoints.up.lg} {
        width: 100%;
        offset-distance: var(--sidebar-width);
    }
`;

const CustomToolBar = styled(Toolbar)`
    justify-content: space-between;

    ${({ theme }) => theme.breakpoints.up.lg} {
        justify-content: space-between;
    }
`;

const StyledDropdownWrapper = styled(Box)`
    display: flex;
`;

const CustomMenuButton = styled(IconButton).attrs({
    'aria-label': 'open drawer',
    edge: 'start',
})`
    margin-right: 2rem;
    scale: 1.3;

    ${({ theme }) => theme.breakpoints.up.lg} {
        display: none;
    }
`;

export { CustomHeader, CustomMenuButton, CustomToolBar, StyledDropdownWrapper };
