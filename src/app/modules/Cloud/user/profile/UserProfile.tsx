import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useRecoilValue } from 'recoil';
import { Card } from '@mui/material';

import { User } from '@/@types/Cloud/user';
import { _getUserDetail } from '@api/cloud/identity';
import { userKeys } from '@libs/utils/queryKeys';
import { LoginUser } from '@recoil/atom/LoginUser';

import ChangePassword from './ChangePassword';
import ProfileNav from './ProfileNav';
import ProfileInfo from './ProfileInfo';

export function UserProfile() {
    // 로그인 시 저장되어있는 유저정보 개인정보 수정 후에도 이 정보는 업데이트 되지 않기 때문에 id 사용으로만 사용
    const loginUser = useRecoilValue(LoginUser);

    // 사용자 계정, 비밀번호 변경 컴포넌트 선택
    const [renderComponent, setRenderComponent] = useState('profile_info');

    const changeComponent = (value: string) => {
        setRenderComponent(value);
    };

    // 로그인한 유저 상세 정보를 불러온다.
    const { data: userInfo } = useQuery(userKeys.detail(loginUser.id), () => _getUserDetail(loginUser.id), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                return data.user as User;
            }
        },
        suspense: true,
    });

    return (
        <Wrapper>
            <SideBarWrapper>
                <ProfileNav renderComponent={renderComponent} userInfo={userInfo} changeComponent={changeComponent} />
            </SideBarWrapper>
            <SettingWrapper>
                <Card variant="outlined">
                    {renderComponent === 'profile_info' && <ProfileInfo userInfo={userInfo} />}
                    {renderComponent === 'change_password' && <ChangePassword userInfo={userInfo} />}
                </Card>
            </SettingWrapper>
        </Wrapper>
    );
}

const Wrapper = styled(Grid2).attrs({ container: true, columnSpacing: 1 })`
    height: 100%;
    flex: 1;
`;

const SideBarWrapper = styled(Grid2).attrs({ xs: 12, md: 3 })`
    & .MuiCard-root {
        height: 100%;
    }
`;
const SettingWrapper = styled(Grid2).attrs({ xs: 12, md: 9 })`
    ${({ theme }) => theme.breakpoints.up.md} {
        & .MuiCard-root {
            height: 100%;
        }
    }
`;
