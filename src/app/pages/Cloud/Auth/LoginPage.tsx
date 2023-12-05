import React from 'react';
import { Box, PaletteMode, Paper, Typography, useTheme } from '@mui/material';
import styled, { css } from 'styled-components';

import Login from '@modules/Cloud/auth/Login';

interface modeProps {
    readonly mode: PaletteMode;
}

/**
 * 로그인 화면
 */
const LoginPage = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const openHompage = () => {
        window.open('http://www.datacommand.co.kr/', '_blink');
    };
    return (
        <Wrapper mode={mode}>
            <LoginWrapper mode={mode}>
                <Login />
                <HomePageLink onClick={openHompage}>datacommand.co.kr</HomePageLink>
            </LoginWrapper>
        </Wrapper>
    );
};

export default LoginPage;

const Wrapper = styled(Box)<modeProps>`
    ${props =>
        props.mode === 'light'
            ? css`
                  background-color: var(--light-background);
              `
            : css`
                  background-color: var(--dark-background);
              `}
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
`;

const HomePageLink = styled(Typography)`
    position: fixed;
    bottom: 10px;
    right: 10px;
    cursor: pointer;
`;

const LoginWrapper = styled(Paper)<modeProps>`
    ${props =>
        props.mode === 'light'
            ? css`
                  background-color: var(--light-main);
              `
            : css`
                  background-color: var(--dark-main);
              `}
    display: flex;
    justify-content: center;
    align-items: center;
    height: fit-content;
    padding: 40px;
`;
