import React, { useCallback } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { IconButton } from '@mui/material';

import * as S from './Header.style';
import UserDropDown from './UserDropDown';
import SettingDrawer from './SettingDrawer';
import BreadCrumbs from '../BreadCrumbs/BreadCrumbs';
import useDrawer from '@/hooks/useDrawer';

/**
 * 헤더 컴포넌트
 */
const Header = () => {
    const { openDrawer } = useDrawer();

    const handleClick = useCallback(() => {
        openDrawer(<SettingDrawer />, 350);
    }, [openDrawer]);

    return (
        <S.CustomHeader>
            <S.CustomToolBar>
                <div style={{ display: 'flex' }}>
                    <S.CustomMenuButton onClick={handleClick}>
                        <MenuIcon />
                    </S.CustomMenuButton>
                    <BreadCrumbs />
                </div>
                <S.StyledDropdownWrapper>
                    <UserDropDown />
                    <IconButton onClick={handleClick}>
                        <SettingsOutlinedIcon />
                    </IconButton>
                </S.StyledDropdownWrapper>
            </S.CustomToolBar>
        </S.CustomHeader>
    );
};

export default Header;
