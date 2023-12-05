import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getI18n } from 'react-i18next';

import { QueryCallback } from '@/@types';
import { AddUser, EditUser, UserList } from '@/@types/Cloud/user';
import {
    _addUser,
    _getSolutionList,
    _getUserDetail,
    _getUserGroupList,
    _getUserList,
    _modifyUserInfo,
} from '@api/cloud/identity';
import { solutionKeys, userGroupKeys, userKeys } from '@libs/utils/queryKeys';

import { QueryData } from './types';

export const useUsersQuery = ({
    queryData,
    successCallback,
    failureCallback,
}: {
    queryData: QueryData;
    successCallback?: QueryCallback;
    failureCallback?: QueryCallback;
}) => {
    // 사용자 목록을 불러오는 함수
    return useQuery(
        userKeys.list({
            limit: queryData.limit,
            offset: queryData.offset,
            searchFilterValue: queryData.inputData,
            isLogin: queryData.isLogin,
        }),
        () => _getUserList(queryData.limit, queryData.offset, queryData.inputData, queryData.isLogin),
        {
            select: ([data, , status]) => {
                successCallback && successCallback(data);
                if (status === 200 || status === 201) {
                    return {
                        users: data.users as UserList[],
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        users: [],
                        pagination: {},
                        status,
                    };
                } else {
                    failureCallback && failureCallback();
                    throw new Error();
                }
            },
            // staleTime: 30000,
            keepPreviousData: true,
        },
    );
};

// 사용자 그룹 목록을 불러오는 함수
export const useUserGroupQuery = ({
    successCallback,
    failureCallback,
}: {
    successCallback?: QueryCallback;
    failureCallback?: QueryCallback;
} = {}) => {
    return useQuery(userGroupKeys.lists(), () => _getUserGroupList(), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback(data);
                const groups = data.groups.map(group => {
                    return { value: +group.id, label: group.name };
                });
                return groups;
            } else if (status === 204) {
                toast.warn(getI18n().t('CLOUD.USER.ACCOUNT.NO_GROUP'));
                failureCallback && failureCallback();
                return [];
            }
        },
        suspense: true,
    });
};

// 사용자 역할 목록을 불러오는 함수
export const useUserRolesQuery = ({
    successCallback,
    failureCallback,
}: {
    successCallback?: QueryCallback;
    failureCallback?: QueryCallback;
} = {}) => {
    return useQuery(solutionKeys.all, () => _getSolutionList(), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback(data);
                const filteredRoles = data.roles.filter(role => role.role !== 'admin');
                return filteredRoles.map(role => {
                    return { value: role.id, label: role.role };
                });
            } else if (status === 204) {
                toast.warn(getI18n().t('CLOUD.USER.ACCOUNT.NO_ROLE'));
                failureCallback && failureCallback();
                return [];
            }
        },
        suspense: true,
        // staleTime: StaleTime, // 5 mins ,
    });
};

// 사용자를 추가하는 함수
export const useAddUserMutation = ({
    user,
    successCallback,
    failureCallback,
}: {
    user: AddUser;
    successCallback?: QueryCallback;
    failureCallback?: QueryCallback;
}) => {
    return useMutation(() => _addUser(user), {
        onSuccess: ([data, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback(data);
                return data;
            }
            failureCallback && failureCallback();
        },
    });
};

// 사용자 상세 정보를 불러오는 함수
export const useUserDetailQuery = ({
    userID,
    successCallback,
    failureCallback,
}: {
    userID: number;
    successCallback?: QueryCallback;
    failureCallback?: QueryCallback;
}) => {
    return useQuery(userKeys.detail(userID), () => _getUserDetail(userID), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback(data);
                return data.user;
            }
            failureCallback && failureCallback();
        },
        enabled: !!userID,
        suspense: true,
    });
};

export const useEditUserMutation = ({
    userID,
    editUser,
    successCallback,
    failureCallback,
}: {
    userID: number;
    editUser: EditUser;
    successCallback?: QueryCallback;
    failureCallback?: QueryCallback;
}) => {
    return useMutation(() => _modifyUserInfo(userID, editUser), {
        onSuccess: ([, , status]) => {
            if (status === 200 || status === 201) {
                toast.success(getI18n().t('CLOUD.USER.ACCOUNT.SUCCESS_MODIFY_ACCOUNT_INFORMATION'));
                successCallback && successCallback();

                return;
            }
            failureCallback && failureCallback();
        },
    });
};
