import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardActions, CardContent, Divider } from '@mui/material';
import { toast } from 'react-toastify';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSignal, useSignalEffect } from '@preact/signals-react';

import ActionButton from '@component/common/Button/ActionButton';
import { userGroupKeys, userKeys } from '@libs/utils/queryKeys';
import createValidation from '@libs/utils/validate';

import { IFormAddUser, UserGroupsType, UserSolutionsType } from '../common/types';
import { useAddUserMutation, useUserGroupQuery, useUserRolesQuery } from '../common/hooks';
import {
    AccountInformationFormGroup,
    AddAccountDialog,
    NewPasswordDialog,
    UserInformationFormGroups,
} from '../common/components';

/**
 * 사용자를 추가하는 컴포넌트
 */
const AddUserAccount = () => {
    const { t } = useTranslation();
    const AccountValiate = createValidation(t).AccountValiate;
    const NameValidate = createValidation(t).NameValidate;
    const DepartmentValidate = createValidation(t).DepartmentValidate;
    const PositionValidate = createValidation(t).PositionValidate;
    const EmailValidate = createValidation(t).EmailValidate;
    const ContactValidate = createValidation(t).ContactValidate;

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isModalOpen = useSignal(false);
    // 생성 후 초기 비밀번호 창 모달
    const isNewPasswordModalOpen = useSignal(false);
    // 계정생성 후 초기 비밀번호
    const newPassword = useSignal('');
    // 선택한 사용자의 그룹
    const selectedGroup = useSignal<UserGroupsType>([]);
    // useUserGroupQuery 결과를 받아올 변수
    const userGroups = useSignal<UserGroupsType>([]);
    // useUserRoleQuery 결과를 받아올 변수
    const userSolutions = useSignal<UserSolutionsType>([]);

    const { handleSubmit, resetField, control, watch, setValue, getValues } = useForm<IFormAddUser>({
        defaultValues: {
            user: {
                account: '',
                tenant: {
                    id: 1,
                },
                // roles: [],
                // groups: [],
                timezone: 'Asia/Seoul',
                language_set: 'kor',
                name: '',
                department: '',
                position: '',
                email: '',
                contact: '',
            },
        },
        mode: 'all',
    });

    // 사용자 그룹 목록을 불러오는 함수
    ({ data: userGroups.value } = useUserGroupQuery());

    // 사용자 역할 목록을 불러오는 함수
    ({ data: userSolutions.value } = useUserRolesQuery());

    // 사용자를 추가하는 함수
    const { isLoading: addLoading, mutate: addUser } = useAddUserMutation({
        user: getValues().user,
        successCallback: (data: any) => {
            newPassword.value = '@' + data.password;
            isNewPasswordModalOpen.value = true;
            toast.success(t('CLOUD.USER.ACCOUNT.ADDED_ACCOUNT'));
            queryClient.invalidateQueries(userKeys.lists());
            queryClient.invalidateQueries(userGroupKeys.userListsInGroup());
            queryClient.invalidateQueries(userGroupKeys.userListsOutGroup());
            isModalOpen.value = false;
        },
        failureCallback: () => {
            isModalOpen.value = false;
        },
    });

    // 기본 디폴트 사용자 그룹을 추가
    useSignalEffect(() => {
        if (userGroups.value) {
            selectedGroup.value = [{ value: userGroups.value[0].value, label: userGroups.value[0].label }];
        }
    });

    useSignalEffect(() => {
        if (userSolutions.value) {
            setValue('user.roles', [{ id: userSolutions.value[0].value }]);
        }
    });

    // 리스트에 추가했을 때 추가된 리스트 변수에 저장
    const onChangeSelectedGroup = (data: any) => {
        selectedGroup.value = data;
    };

    const onSubmit: SubmitHandler<IFormAddUser> = () => {
        const groups = selectedGroup.value
            ? selectedGroup.value.map(group => {
                  return { id: group.value };
              })
            : [];

        setValue('user.groups', groups);
        isModalOpen.value = true;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
                <Wrapper>
                    <AccountInformationFormGroup<IFormAddUser>
                        mode="add"
                        resetField={resetField}
                        control={control}
                        userIdValidate={AccountValiate}
                        userSolutions={userSolutions.value}
                        userGroups={userGroups.value}
                        onChangeSelectedGroup={onChangeSelectedGroup}
                    />
                    <UserInformationFormGroups<IFormAddUser>
                        mode="add"
                        resetField={resetField}
                        control={control}
                        nameValidate={NameValidate}
                        departmentValidate={DepartmentValidate}
                        positionValidate={PositionValidate}
                        emailValidate={EmailValidate}
                        contactValidate={ContactValidate}
                    />
                </Wrapper>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <ActionButton
                    buttonType="cancel"
                    onClick={() => {
                        navigate('/cloud/admin/users/userAccount');
                    }}
                    type="cancel"
                />
                <ActionButton buttonType="add" type="submit" />
            </CardActions>
            <AddAccountDialog
                open={isModalOpen.value}
                textTitle={watch('user.account')}
                onClose={() => (isModalOpen.value = false)}
                onConfirm={addUser}
                isLoading={addLoading}
            />
            <NewPasswordDialog
                open={isNewPasswordModalOpen.value}
                textTitle={newPassword.value}
                onClose={() => (isNewPasswordModalOpen.value = false)}
                onConfirm={() => (isNewPasswordModalOpen.value = false)}
            />
        </form>
    );
};

export default AddUserAccount;

const Wrapper = styled(Grid2).attrs({ container: true, columnSpacing: 4 })``;
