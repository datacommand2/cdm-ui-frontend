import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import styled from 'styled-components';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useSignal } from '@preact/signals-react';
import { useQueryClient } from '@tanstack/react-query';
import { useResetRecoilState, useSetRecoilState } from 'recoil';

import { useLogout } from '@modules/Cloud/auth/common/hooks';
import { authInfo, LoginUser } from '@recoil/atom/LoginUser';

/**
 * 유저 드롭다운 컴포넌트
 * 1. 이벤트 목록
 * 2. 내 정보
 * 3. 로그아웃
 */
const UserDropDown = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const anchorEl = useSignal(null);
    const open = Boolean(anchorEl.value);
    const setAuthInfo = useSetRecoilState(authInfo);
    const resetLoginUser = useResetRecoilState(LoginUser);

    const { mutate: logout } = useLogout({
        successCallback: () => {
            queryClient.clear();
            toast.success('로그아웃 되었습니다.');
            localStorage.removeItem('session');
            setAuthInfo(false);
            resetLoginUser();
        },
    });

    const handleClick = event => {
        anchorEl.value = event.currentTarget;
    };
    const handleClose = () => {
        anchorEl.value = null;
    };

    return (
        <UserMemu>
            <IconButton
                sx={{ scale: '1.3' }}
                size="medium"
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <AccountCircleOutlinedIcon sx={{ marginRight: '0.25rem' }} />
            </IconButton>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl.value}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem
                    onClick={e => {
                        navigate('/cloud/user/event-list');
                        handleClose(e);
                    }}
                >
                    <CustomMenuItem>
                        <EventNoteOutlinedIcon sx={{ marginRight: '0.5rem' }} />
                        {t('CLOUD.EVENT_LIST')}
                    </CustomMenuItem>
                </MenuItem>
                <MenuItem
                    onClick={e => {
                        navigate('/cloud/account');
                        handleClose(e);
                    }}
                >
                    <CustomMenuItem>
                        <PersonOutlineOutlinedIcon sx={{ marginRight: '0.5rem' }} />
                        {t('CLOUD.USER_MENU.USER_PROFILE')}
                    </CustomMenuItem>
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={e => {
                        logout();
                        handleClose(e);
                    }}
                >
                    <CustomMenuItem>
                        <LogoutOutlinedIcon sx={{ marginRight: '0.5rem' }} />
                        {t('CLOUD.USER_MENU.LOG_OUT')}
                    </CustomMenuItem>
                </MenuItem>
            </Menu>
        </UserMemu>
    );
};

export default UserDropDown;

const UserMemu = styled.div`
    display: flex;
    align-items: center;
`;

const CustomMenuItem = styled(Box)`
    display: flex;
    align-items: center;
`;
