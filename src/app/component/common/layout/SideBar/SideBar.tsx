import React from 'react';

import * as S from './SideBar.style';
import SideBarMenu from './SideBarMenu';
import { useIsMenuOpen } from '../../../../../recoil/atom/Global'
import { useTheme } from '@mui/material';

/**
 * 사이드바 컴포넌트
 */
const SideBar = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const [open, setIsMenuOpen] = useIsMenuOpen();

    const handleDrawerClose = () => {
        setIsMenuOpen(!open);
    };

    return (
        <S.CustomDrawerBox>
            {/* 화면이 작을 때 */}
            <S.SmallDisplaySidebar className={`${mode}-small-sidebar`} open={open} onClose={handleDrawerClose}>
                <SideBarMenu />
            </S.SmallDisplaySidebar>
            <S.LargeDisplaySidebar className={`${mode}-large-sidebar`} open={open}>
                <SideBarMenu />
            </S.LargeDisplaySidebar>
        </S.CustomDrawerBox>
    );
};

export default SideBar;
