import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, CardContent, Chip, FormGroup, FormLabel, Stack, Typography } from '@mui/material';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';

import { EditUser, User } from '@/@types/Cloud/user';
import { _modifyUserInfo } from '@api/cloud/identity';
import { userGroupKeys, userKeys } from '@libs/utils/queryKeys';
import { phoneRule } from '@libs/utils/regex';
import CustomCardHeader from '@component/common/CardHeader/CustomCardHeader';
import DefaultButton from '@component/common/Button/DefaultButton';
import CustomDivider from '@component/common/Divider/CustomDivider';
import DefaultDialog from '@component/common/Dialog/DefaultDialog';
import DialogText from '@component/common/Dialog/DialogText';
import FormTextField from '@component/common/TextField/FormTextField';
import DisabledFormTextField from '@component/common/TextField/DisabledFormTextField';

interface ProfileInfoProps {
    userInfo: User | undefined;
}

/**
 * 계정 정보를 수정하는 컴포넌트
 */
const ProfileInfo = ({ userInfo }: ProfileInfoProps) => {
    const { t } = useTranslation();
    const [modifyModal, setModifyModal] = useState(false);
    const queryClient = useQueryClient();

    // 사용자의 정보를 변경하는 함수
    const { isLoading: modifyLoading, mutate: modifyUserInfo } = useMutation(
        () =>
            _modifyUserInfo(userInfo?.id, {
                account: userInfo?.account,
                ...getValues(),
            }),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    setModifyModal(false);
                    toast.success(t('CLOUD.USER_MENU.USER_INFO.MODIFY_ACCOUNT_SUCCESS'));
                    queryClient.invalidateQueries(userKeys.details());
                    queryClient.invalidateQueries(userGroupKeys.userListsInGroup());
                    queryClient.invalidateQueries(userGroupKeys.userListsOutGroup());
                }
            },
        },
    );

    const { control, handleSubmit, resetField, getValues } = useForm<EditUser>({
        defaultValues: {
            id: userInfo?.id,
            tenant: {
                id: userInfo?.tenant?.id,
            },
            roles: userInfo?.roles
                ? userInfo.roles.map(role => {
                      return { id: role.id };
                  })
                : [],
            groups: userInfo?.groups
                ? userInfo.groups.map(group => {
                      return { id: group.id };
                  })
                : [],
            timezone: 'Asia/Seoul',
            language_set: 'eng',
            name: userInfo?.name,
            department: userInfo?.department ?? '',
            position: userInfo?.position ?? '',
            email: userInfo?.email ?? '',
            contact: userInfo?.contact ?? '',
        },
        mode: 'onChange',
    });

    const onSubmit: SubmitHandler<EditUser> = () => {
        setModifyModal(true);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CustomCardHeader
                title={t('CLOUD.USER_MENU.USER_INFO.ACCOUNT_INFORMATION')}
                headerAction={<DefaultButton text={t('BUTTON.MODIFY')} type="submit" />}
            />
            <CardContent>
                <FormWrapper>
                    <FormGroup>
                        <DisabledFormTextField
                            name="account"
                            label={t('CLOUD.USER_MENU.USER_INFO.USER_ID')}
                            value={userInfo?.account}
                        />
                        <FormTextField<EditUser>
                            label={t('DR.NAME')}
                            required={true}
                            name="name"
                            resetField={resetField}
                            control={control}
                            rules={{
                                required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                maxLength: { value: 30, message: t('FORM.VALIDATION.NAME_MAX') },
                            }}
                        />
                        <FormTextField<EditUser>
                            label={t('CLOUD.USER_MENU.USER_INFO.DEPARTMENT')}
                            name="department"
                            resetField={resetField}
                            control={control}
                            rules={{
                                maxLength: { value: 30, message: t('FORM.VALIDATION.DEPARTMENT_MAX') },
                            }}
                        />
                        <FormTextField<EditUser>
                            label={t('CLOUD.USER_MENU.USER_INFO.POSITION')}
                            name="position"
                            resetField={resetField}
                            control={control}
                            rules={{
                                maxLength: { value: 30, message: t('FORM.VALIDATION.POSITION_MAX') },
                            }}
                        />
                        <FormTextField<EditUser>
                            label={t('CLOUD.USER_MENU.USER_INFO.EMAIL')}
                            name="email"
                            resetField={resetField}
                            control={control}
                            rules={{
                                maxLength: { value: 50, message: t('FORM.VALIDATION.EMAIL_MAX') },
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: t('FORM.VALIDATION.EMAIL_EMAIL'),
                                },
                            }}
                        />
                        <FormTextField<EditUser>
                            label={t('CLOUD.USER_MENU.USER_INFO.CONTACT')}
                            name="contact"
                            type="tel"
                            resetField={resetField}
                            control={control}
                            rules={{
                                minLength: { value: 7, message: t('FORM.VALIDATION.PHONE_NUMBER') },
                                maxLength: { value: 13, message: t('FORM.VALIDATION.PHONE_NUMBER') },
                                pattern: {
                                    value: phoneRule,
                                    message: t('FORM.VALIDATION.PHONE_NUMBER'),
                                },
                            }}
                            placeholder="000-0000-0000"
                        />
                    </FormGroup>
                    <CustomDivider />
                    <Label>{t('CLOUD.USER_MENU.USER_INFO.USER_ROLE')}</Label>
                    {userInfo?.roles &&
                        userInfo?.roles.map(role => (
                            <FormGroup key={role.id}>
                                <DisabledFormTextField name="role" value={role.role} />
                            </FormGroup>
                        ))}
                    <Label> {t('CLOUD.USER.GROUP.USER_GROUP')}</Label>
                    <Stack direction="row" spacing={1}>
                        {userInfo?.groups &&
                            userInfo?.groups.map(group => {
                                return (
                                    <Chip
                                        key={group.id}
                                        label={<Typography>{group.name}</Typography>}
                                        variant="outlined"
                                    />
                                );
                            })}
                    </Stack>
                </FormWrapper>
            </CardContent>
            {modifyModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={modifyModal}
                    title={t('CLOUD.USER_MENU.USER_INFO.MODIFY_ACCOUNT')}
                    onClose={() => {
                        setModifyModal(false);
                    }}
                    onConfirm={modifyUserInfo}
                    isLoading={modifyLoading}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    <DialogText title={userInfo?.name} body={t('CLOUD.USER_MENU.USER_INFO.MODIFY_ACCOUNT_STORY')} />
                </DefaultDialog>
            )}
        </form>
    );
};

export default ProfileInfo;

const Label = styled(FormLabel)`
    font-weight: 700;
    margin-bottom: 5px;
`;

const FormWrapper = styled(Box)`
    padding-left: 1rem;
    padding-right: 1rem;
`;
