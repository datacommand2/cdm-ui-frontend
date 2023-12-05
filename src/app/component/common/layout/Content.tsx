import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import styled from 'styled-components';

import { useTheme } from '@mui/material';
import GlobalDrawer from './Drawers';

/**
 * Header 컴포넌트와 나머지 컴포넌트들을 포함
 */
const Content = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    return (
        <StyleContent component="main" className={`${mode}-main-container`}>
            <GlobalDrawer />
            <Outlet />
        </StyleContent>
    );
};

export default Content;

const StyleContent = styled(Box)`
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    padding: 8px;
`;
