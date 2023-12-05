import React from 'react';
import styled from 'styled-components';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';

const _getErrorMessage = (data: any) => {
    if (data && data[1] && data[2] === 401) {
        const detail = data[1].message.error_message.replace('detail: ', '');
        if (detail === 'password mismatch') {
            return {
                type: 'mismatch',
                message: '아이디 혹은 비밀번호가 일치하지 않습니다.',
                contents: '',
            };
        } else if (detail && detail.includes('account restrict')) {
            return {
                type: 'restricted',
                message: '로그인 실패 제한초과로 계정이 잠겼습니다.',
                contents: dayjs.unix(detail.substring(detail.lastIndexOf(' ') + 1)).format('YYYY-MM-DD:HH:mm:ss'),
            };
        }
    }
    return { type: '', message: '', contents: '' };
};

/**
 * 로그인 에러 컴포넌트
 */
const LoginError = ({ data }: any) => {
    const loginError = _getErrorMessage(data);

    return (
        <>
            {loginError.type !== '' && (
                <LoginErrorWrapper>
                    <LoginErrorMessage color="error" variant="body1">
                        {loginError.message}
                    </LoginErrorMessage>
                    {loginError.type === 'restricted' && (
                        <LoginErrorContents color="error" variant="body2">
                            {loginError.contents} 이후에 계정잠금이 해제됩니다.
                        </LoginErrorContents>
                    )}
                </LoginErrorWrapper>
            )}
        </>
    );
};

const LoginErrorWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 20px 20px 20px;
`;
const LoginErrorMessage = styled(Typography)``;
const LoginErrorContents = styled(Typography)``;

export default LoginError;