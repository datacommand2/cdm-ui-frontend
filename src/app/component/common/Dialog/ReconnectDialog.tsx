import React from 'react';
import styled from 'styled-components';
import { Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, Typography } from '@mui/material';
import { Signal } from '@preact/signals-react';
import { useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useResetRecoilState, useSetRecoilState } from 'recoil';

import { LoginUser, authInfo } from '../../../../recoil/atom/LoginUser';
import { useLogin } from '../../../modules/Cloud/auth/common/hooks';
import ActionButton from '../Button/ActionButton';
import FormTextField from '../TextField/FormTextField';
import { toast } from 'react-toastify';

interface ReconnectDialogProps {
    open: Signal<boolean>;
}

const initialValues = {
    account: '',
    password: '',
};

interface LoginForm {
    account: string;
    password: string;
}

/**
 * 세션 끊어짐 Dialog
 */
const ReconnectDialog = ({ open }: ReconnectDialogProps) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const resetLoginUser = useResetRecoilState(LoginUser);
    const setAuthInfo = useSetRecoilState(authInfo);
    const setLoginUser = useSetRecoilState(LoginUser);

    const { isLoading: loginLoading, mutate: userLogin } = useLogin({
        successCallback: (data: any) => {
            const sessionKey = data.user.session.key;
            localStorage.setItem('session', sessionKey);
            setLoginUser(data.user);
            setAuthInfo({ isLoggedIn: true });
            toast.success(`${data.user.name} 계정으로 로그인 하였습니다.`);
            navigate('/cluster');
            queryClient.clear();
            // close reconnect modal
            open.value = false;
        },
        failureCallback: () => {
            // close reconnect modal
            open.value = false;
        }
    });

    const { control, handleSubmit, resetField } = useForm<LoginForm>({
        defaultValues: initialValues,
        mode: 'all',
    });

    const onSubmit: SubmitHandler<LoginForm> = data => {
        userLogin(data);
    };

    return (
        <Dialog open={true} maxWidth="xs" fullWidth>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>
                    <div>
                        <Typography variant="h6">{t('AUTH.SESSION_DISCONNECTED')}</Typography>
                    </div>
                </DialogTitle>
                <DialogContent dividers={true}>
                    <StyledTitle>{t('AUTH.SESSION_DISCONNECTED_DESC')}</StyledTitle>
                    <FormGroup>
                        <FormTextField<LoginForm>
                            label={t('AUTH.ACCOUNT')}
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
                        />
                    </FormGroup>
                    <FormGroup>
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
                        />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <ActionButton
                        buttonType={'exit'}
                        onClick={() => {
                            queryClient.clear();
                            localStorage.removeItem('session');
                            setAuthInfo(false);
                            resetLoginUser();
                        }}
                    />
                    <ActionButton
                        buttonType={'connect'}
                        type="submit"
                        disabled={loginLoading}
                        isLoading={loginLoading}
                    />
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ReconnectDialog;

const StyledTitle = styled(Typography)`
    padding-bottom: 1rem;
`;
