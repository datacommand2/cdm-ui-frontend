import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightMode';
import styled from 'styled-components';

import { DetailDrawer } from '../../DetailDrawer/DetailDrawer';
import { useToggleMode } from '../../../../../recoil/atom/Global'

/**
 * dark, light 모드 설정할 수 있는 부분
 */
const SettingDrawer = () => {
    const [mode, setToggleMode] = useToggleMode();

    const toggleColorMode = () => {
        setToggleMode(mode === 'light' ? 'dark' : 'light');
        localStorage.setItem('theme', mode === 'light' ? 'dark' : 'light');
    };

    return (
        <DetailDrawer>
            <DetailDrawer.Title text={'설정'} />
            <DetailDrawer.ContentTitle text={'모드'} />
            <StyledButtonGroup variant="outlined">
                <StyledButton
                    onClick={toggleColorMode}
                    color={mode === 'light' ? 'primary' : 'cancel'}
                    startIcon={<LightModeIcon />}
                >
                    Light
                </StyledButton>
                <StyledButton
                    onClick={toggleColorMode}
                    color={mode === 'dark' ? 'primary' : 'cancel'}
                    startIcon={<DarkModeOutlinedIcon />}
                >
                    Dark
                </StyledButton>
            </StyledButtonGroup>
        </DetailDrawer>
    );
};

export default SettingDrawer;

const StyledButtonGroup = styled(ButtonGroup)`
    width: 100%;
`;

const StyledButton = styled(Button)`
    width: 100%;
`;
