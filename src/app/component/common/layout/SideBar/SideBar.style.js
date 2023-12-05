import styled from 'styled-components';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

const CustomDrawerBox = styled(Box).attrs({ component: 'nav', 'aria-label': 'mailbox folders' })`
    width: var(--sidebar-width);
    ${({ theme }) => theme.breakpoints.down.md} {
        flex-shrink: 0;
    }
    z-index: 600;
`;

/**
 * 작은 화면일 때 Drawer
 */
const SmallDisplaySidebar = styled(Drawer).attrs({
    variant: 'temporary',
    ModalProps: {
        keepMounted: true, // Better open performance on mobile.
    },
})`
    ${({ theme }) => theme.breakpoints.up.xs} {
        display: block;
    }

    ${({ theme }) => theme.breakpoints.up.lg} {
        display: none;
    }
`;

/**
 * 큰 화면일 때 Drawer
 */
const LargeDisplaySidebar = styled(Drawer).attrs({
    variant: 'permanent',
})`
    ${({ theme }) => theme.breakpoints.up.xs} {
        display: none;
    }

    ${({ theme }) => theme.breakpoints.up.lg} {
        display: block;
    }
`;

export { CustomDrawerBox, SmallDisplaySidebar, LargeDisplaySidebar };
