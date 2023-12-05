import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import styled from 'styled-components';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { useSignal } from '@preact/signals-react';

import Header from './Header/Header';
import SideBar from './SideBar/SideBar';
import { authInfo, LoginUser } from '../../../../recoil/atom/LoginUser';
import ReconnectDialog from '../Dialog/ReconnectDialog';
import SessionTimeDialog from '../Dialog/SessionTimeDialog';
import Content from './Content';

/**
 * 레이아웃 컴포넌트
 */
const Layout = () => {
    const setAuthInfo = useSetRecoilState(authInfo);
    const resetLoginUser = useResetRecoilState(LoginUser);
    // session modal open signal
    const sessionModalOpen = useSignal(false);
    // connect modal open signal
    const connectModalOpen = useSignal(false);
    // session time signal
    const sessionTime = useSignal(0);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // 세션 남은시간 체크
    useEffect(() => {
        const timeout = setInterval(() => {
            const session = localStorage.getItem('session')?.split?.('.');

            if (!session || session[0] === 'undefined') {
                connectModalOpen.value = true;
            } else {
                const payload = decodeURIComponent(window.atob(session[0]));
                const sessionExpire = JSON.parse(payload)['expiry_date'];
                // sessionExpire - createDate => 1800초 => 30분

                const expiryTime = sessionExpire - Math.ceil(Date.now() / 1000);
                // 남은 시간이 60초 남았을 때
                if (expiryTime < 61) {
                    sessionTime.value = expiryTime;
                    sessionModalOpen.value = true;
                }
                if (expiryTime < 1) {
                    setAuthInfo(false);
                    resetLoginUser();
                    alert('세션이 만료되었습니다.');
                    queryClient.clear();
                    localStorage.clear();
                }
            }
        }, 1000) as any;
        return () => {
            clearInterval(timeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, queryClient]);

    return (
        <>
            <SideBar />
            <CustomBox>
                <Header />
                <Content />
            </CustomBox>
            {sessionModalOpen.value && <SessionTimeDialog open={sessionModalOpen} sessionTime={sessionTime} />}
            {connectModalOpen.value && <ReconnectDialog open={connectModalOpen} />}
        </>
    );
};

export default Layout;

const CustomBox = styled(Box)`
    display: flex;
    flex-direction: column;
    height: 100%;

    ${({ theme }) => theme.breakpoints.up.lg} {
        padding-left: var(--sidebar-width);
    }
`;
