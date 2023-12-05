import React from 'react';
import styled from 'styled-components';
import i18next from 'i18next';
import { Box, FormGroup, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';

import FormTextField from '@component/common/TextField/FormTextField';
import { authInfo, LoginUser } from '@recoil/atom/LoginUser';

import { useLogin } from './common/hooks';
import { LoginForm } from './common/types';
import { initialValues } from './common/utils';
import LoginError from './LoginError';

/**
 * 로그인 컴포넌트
 */
const Login = () => {
    const { t } = useTranslation();
    const setAuthInfo = useSetRecoilState(authInfo);
    const setLoginUser = useSetRecoilState(LoginUser);

    const {
        data,
        mutate: userLogin,
        isLoading: loginLoading,
    } = useLogin({
        successCallback: (data: any) => {
            const sessionKey = data.user.session.key;
            localStorage.setItem('session', sessionKey);
            setLoginUser(data.user);
            setAuthInfo({ isLoggedIn: true });
        },
    });

    const { control, handleSubmit, resetField } = useForm<LoginForm>({
        defaultValues: initialValues,
        mode: 'all',
    });

    const onSubmit: SubmitHandler<LoginForm> = data => {
        userLogin(data);
    };

    return (
        <LoginWrapper>
            <LogoWrapper>
                <LogoImg alt="Logo" src={'/images/logos/logo-removebg.png'} />
                <Typography variant="h4">CDM CLOUD</Typography>
            </LogoWrapper>

            <>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CustomInput>
                        <FormTextField<LoginForm>
                            label={i18next.t('AUTH.ACCOUNT')}
                            required={true}
                            name="account"
                            resetField={resetField}
                            placeholder="account"
                            control={control}
                            rules={{
                                required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                minLength: { value: 5, message: t('FORM.VALIDATION.ACCOUNT_ID') },
                                maxLength: { value: 18, message: t('FORM.VALIDATION.ACCOUNT_ID') },
                            }}
                            size="medium"
                        />
                    </CustomInput>
                    <CustomInput>
                        <FormTextField<LoginForm>
                            label={t('AUTH.PASSWORD')}
                            required={true}
                            name="password"
                            placeholder="password"
                            type="password"
                            resetField={resetField}
                            control={control}
                            rules={{
                                required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                minLength: { value: 6, message: t('FORM.VALIDATION.ACCOUNT_ID') },
                                maxLength: { value: 16, message: t('FORM.VALIDATION.ACCOUNT_ID') },
                            }}
                            size="medium"
                        />
                    </CustomInput>
                    {data && <LoginError data={data} />}
                    <StyledLoginButtonWrapper>
                        <LoginButton type="submit" disabled={loginLoading} loading={loginLoading}>
                            <Typography>{t('AUTH.SIGN_IN')}</Typography>
                        </LoginButton>
                    </StyledLoginButtonWrapper>
                </form>
            </>
        </LoginWrapper>
    );
};

const StyledLoginButtonWrapper = styled(FormGroup)`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
`;

const CustomInput = styled(FormGroup)`
    & .MuiOutlinedInput-input {
        font-weight: 700;
    }
`;

const LogoWrapper = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 3.5rem;
`;
const LoginButton = styled(LoadingButton).attrs({ variant: 'contained' })`
    margin: 0.5rem 0.25rem;
    padding: 0.775rem 1.5rem;
    width: 100%;
`;

const LoginWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 400px;
`;

const LogoImg = styled.img`
    max-height: 70px;
`;

export default Login;
