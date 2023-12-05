import React, { useState } from 'react';
import { sha256 } from 'js-sha256';
import { Box, CardContent, FormGroup } from '@mui/material';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import { EditPassword, User } from '@/@types/Cloud/user';
import { _modifyUserPassword } from '@api/cloud/identity';
import CustomCardHeader from '@component/common/CardHeader/CustomCardHeader';
import DefaultButton from '@component/common/Button/DefaultButton';
import DefaultDialog from '@component/common/Dialog/DefaultDialog';
import DialogText from '@component/common/Dialog/DialogText';
import FormTextField from '@component/common/TextField/FormTextField';
import { passwordRule } from '@libs/utils/regex';
import { LoginUser } from '@recoil/atom/LoginUser';

interface ChangePasswordProps {
    userInfo: User | undefined;
}

/**
 * 사용자 패스워드를 변경하는 컴포넌트
 */
const ChangePassword = ({ userInfo }: ChangePasswordProps) => {
    const { t } = useTranslation();
    const [editData, setEditData] = useState<EditPassword>({
        current_password: '',
        new_password: '',
    });
    const [passwordModal, setPasswordModal] = useState(false);
    const loginUser = useRecoilValue(LoginUser);

    // 사용자의 비밀번호를 변경하는 함수
    const { isLoading: changeLoading, mutate: modifyPassword } = useMutation(
        () => _modifyUserPassword(userInfo?.id, editData),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    toast.success(t('CLOUD.USER_MENU.USER_INFO.CHANGE_PASSWORD_SUCCESS'));
                    setPasswordModal(false);
                }
            },
        },
    );

    const PasswordValidate = {
        required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
        maxLength: { value: 16, message: t('FORM.VALIDATION.SETTING_PWD_MAX') },
        minLength: { value: 6, message: t('FORM.VALIDATION.SETTING_PWD_MIN') },
    };
    const { control, handleSubmit, resetField, watch } = useForm<EditPassword>({
        defaultValues: {
            current_password: '',
            new_password: '',
            new_password_confirm: '',
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<EditPassword> = data => {
        const password = {
            current_password: sha256(
                data.current_password.charAt(0) === '@'
                    ? data.current_password.substring(1, data.current_password.length)
                    : data.current_password + sha256(loginUser.account),
            ),
            new_password: sha256(data.new_password + sha256(loginUser.account)),
        };

        setEditData(password);
        setPasswordModal(true);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CustomCardHeader
                title={t('CLOUD.USER_MENU.USER_INFO.CHANGE_PASSWORD')}
                headerAction={<DefaultButton text={t('BUTTON.MODIFY')} type="submit" />}
            />
            <CardContent>
                <FormWrapper>
                    <FormGroup>
                        <FormTextField<EditPassword>
                            label={t('CLOUD.USER_MENU.CURRENT_PASSWORD')}
                            required={true}
                            name="current_password"
                            type="password"
                            resetField={resetField}
                            control={control}
                            rules={PasswordValidate}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormTextField<EditPassword>
                            label={t('CLOUD.USER_MENU.NEW_PASSWORD')}
                            required={true}
                            name="new_password"
                            type="password"
                            resetField={resetField}
                            control={control}
                            rules={{
                                pattern: {
                                    value: passwordRule,
                                    message: t('CLOUD.USER_MENU.PASSWORD_RULE'),
                                },
                                validate: {
                                    passwordMatch: value =>
                                        watch('current_password') !== value ||
                                        t('CLOUD.USER_MENU.DIFF_CURR_PWD_NEW_PWD'),
                                },
                                ...PasswordValidate,
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormTextField<EditPassword>
                            label={t('CLOUD.USER_MENU.CONFIRM_NEW_PASSWORD')}
                            required={true}
                            name="new_password_confirm"
                            type="password"
                            resetField={resetField}
                            control={control}
                            rules={{
                                validate: {
                                    passwordMatch: value =>
                                        watch('new_password') === value || t('CLOUD.USER_MENU.MATCH_PWD'),
                                },
                                ...PasswordValidate,
                            }}
                        />
                    </FormGroup>
                </FormWrapper>
            </CardContent>
            {passwordModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={passwordModal}
                    title={t('CLOUD.USER_MENU.USER_INFO.CHANGE_PASSWORD')}
                    onClose={() => {
                        setPasswordModal(false);
                    }}
                    onConfirm={modifyPassword}
                    isLoading={changeLoading}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    <DialogText
                        title={t('GLOBAL.CHANGE')}
                        body={t('CLOUD.USER_MENU.USER_INFO.CHANGE_PASSWORD_STORY')}
                    />
                </DefaultDialog>
            )}
        </form>
    );
};

export default ChangePassword;

const FormWrapper = styled(Box)`
    padding-left: 1rem;
    padding-right: 1rem;
`;
