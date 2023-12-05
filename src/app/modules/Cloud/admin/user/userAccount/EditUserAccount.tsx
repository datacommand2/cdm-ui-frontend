import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { CardActions, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSignal, useSignalEffect } from '@preact/signals-react';

import { EditUser, User } from '@/@types/Cloud/user';
import ActionButton from '@component/common/Button/ActionButton';
import DefaultSpinner from '@component/common/Skeleton/DefaultSpinner';
import createValidation from '@libs/utils/validate';
import { userGroupKeys, userKeys } from '@libs/utils/queryKeys';

import { IFormEditUser, UserGroupsType, UserSolutionsType } from '../common/types';
import { AccountInformationFormGroup, ModifyUserInfoModal, UserInformationFormGroups } from '../common/components';
import { useEditUserMutation, useUserDetailQuery, useUserGroupQuery, useUserRolesQuery } from '../common/hooks';

/**
 * 사용자 정보를 수정하는 컴포넌트
 */
const EditUserAccount = () => {
    const { t } = useTranslation();
    const NameValidate = createValidation(t).NameValidate;
    const DepartmentValidate = createValidation(t).DepartmentValidate;
    const PositionValidate = createValidation(t).PositionValidate;
    const EmailValidate = createValidation(t).EmailValidate;
    const ContactValidate = createValidation(t).ContactValidate;

    // 선택한 사용자의 그룹
    const selectedGroup = useSignal<UserGroupsType>([]);
    const editUser = useSignal<EditUser | undefined>(undefined);
    const userGroups = useSignal<UserGroupsType>([]);
    const userSolutions = useSignal<UserSolutionsType>([]);
    const userDetail = useSignal<User | undefined>(undefined);
    const solutionLoading = useSignal(false);
    // 버튼을 눌렀을 때 해당하는 모달에 대한 상태
    const isModifyUserInfoModalOpen = useSignal(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userID = Number(location.state.RowID);
    const queryClient = useQueryClient();

    // 사용자 상세 정보를 불러오는 함수
    ({ data: userDetail.value } = useUserDetailQuery({ userID }));

    const { handleSubmit, getValues, control, resetField } = useForm<IFormEditUser>({
        defaultValues: {
            user: {
                ...userDetail.value,
                roles: userDetail.value?.roles
                    ? userDetail.value.roles.map(role => {
                          return { value: role.id, label: role.role };
                      })
                    : [],
                groups: userDetail.value?.groups
                    ? userDetail.value.groups.map(group => {
                          return { value: group.id, label: group.name };
                      })
                    : [],
            },
        },
        mode: 'onChange',
    });

    // 사용자 그룹 목록을 불러오는 함수
    ({ data: userGroups.value } = useUserGroupQuery());

    // 사용자 역할 목록을 불러오는 함수
    ({ data: userSolutions.value, isLoading: solutionLoading.value } = useUserRolesQuery());

    // 사용자 정보를 수정하는 함수
    const { isLoading: modifyLoading, mutate: modifyUser } = useEditUserMutation({
        userID,
        editUser: editUser.value as EditUser,
        successCallback: () => {
            queryClient.invalidateQueries(userKeys.lists());
            queryClient.invalidateQueries(userKeys.details());
            queryClient.invalidateQueries(userGroupKeys.userListsInGroup());
            queryClient.invalidateQueries(userGroupKeys.userListsOutGroup());
            isModifyUserInfoModalOpen.value = false;
            navigate('/cloud/admin/users/userAccount');
        },
        failureCallback: () => {
            isModifyUserInfoModalOpen.value = false;
        },
    });

    // 기본 디폴트 사용자 그룹을 추가
    useSignalEffect(() => {
        if (userDetail.value?.groups) {
            const initGroups = userDetail.value.groups.map(group => {
                return { value: group.id, label: group.name };
            });
            selectedGroup.value = initGroups;
        }
    });

    const onSubmit: SubmitHandler<IFormEditUser> = data => {
        const groups = selectedGroup.value
            ? selectedGroup.value.map(group => {
                  return { id: group.value };
              })
            : [];
        const roles = data.user.roles
            ? data.user.roles.map(role => {
                  return { id: role.value };
              })
            : [];

        editUser.value = {
            ...getValues('user'),
            roles,
            groups,
            tenant: { id: getValues('user.tenant.id') },
        };
        isModifyUserInfoModalOpen.value = true;
    };

    // 리스트에 추가했을 때 추가된 리스트 변수에 저장
    const onChangeSelectedGroup = (data: any) => {
        selectedGroup.value = data;
    };

    return (
        <>
            {solutionLoading.value ? (
                <DefaultSpinner />
            ) : (
                <>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardContent>
                            <Wrapper>
                                <AccountInformationFormGroup<IFormEditUser>
                                    mode="edit"
                                    userDetail={userDetail.value}
                                    resetField={resetField}
                                    control={control}
                                    getValues={getValues}
                                    userSolutions={userSolutions.value}
                                    userGroups={userGroups.value}
                                    onChangeSelectedGroup={onChangeSelectedGroup}
                                />
                                <UserInformationFormGroups<IFormEditUser>
                                    mode="edit"
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
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <ActionButton
                                buttonType="cancel"
                                type="cancle"
                                onClick={() => navigate('/cloud/admin/users/userAccount')}
                            />
                            <ActionButton buttonType="edit" type="submit" />
                        </CardActions>
                        <ModifyUserInfoModal
                            open={isModifyUserInfoModalOpen.value}
                            onClose={() => (isModifyUserInfoModalOpen.value = false)}
                            onConfirm={() => {
                                console.log(getValues());
                                modifyUser();
                            }}
                            isLoading={modifyLoading}
                            title={t('CLOUD.USER.ACCOUNT.MODIFY_INFORMATION')}
                            name={getValues('user.name')}
                            body={t('CLOUD.USER.ACCOUNT.WANNA_MODIFY_INFORMATION')}
                        />
                    </form>
                </>
            )}
        </>
    );
};

export default EditUserAccount;

const Wrapper = styled(Grid2).attrs({ container: true, columnSpacing: 4 })``;
