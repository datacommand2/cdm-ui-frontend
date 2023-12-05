import { useMutation } from '@tanstack/react-query';

import { _login, _logout, _checkSession } from '@api/cloud/identity';

import { LoginForm } from './types';
import { QueryCallback } from '@/@types';

/**
 * 로그인하는 함수
 */
export const useLogin = ({
    successCallback,
    failureCallback,
}: {
    successCallback?: QueryCallback;
    failureCallback?: QueryCallback;
} = {}) => {
    const { data, isLoading, mutate, isSuccess } = useMutation(
        (payload: LoginForm) => _login(payload.account, payload.password),
        {
            onSuccess: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    successCallback && successCallback(data);
                    return data;
                }
                failureCallback && failureCallback();
            },
        },
    );

    return { data, isLoading, mutate, isSuccess };
};

/**
 * 로그아웃 하는 함수
 */
export const useLogout = ({
    successCallback,
    failureCallback,
}: {
    successCallback?: QueryCallback;
    failureCallback?: QueryCallback;
} = {}) => {
    const { mutate } = useMutation(() => _logout(), {
        onSuccess: ([, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback();
                return;
            }
            failureCallback && failureCallback();
        },
    });

    return { mutate };
};

/**
 * 세션 유효성을 확인하는 함수
 */
export const useCheckSession = ({
    successCallback,
    failureCallback,
}: {
    successCallback?: QueryCallback;
    failureCallback?: QueryCallback;
} = {}) => {
    const { isLoading, mutate, isSuccess, status } = useMutation(() => _checkSession(), {
        onSuccess: ([data, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback(data);
                return;
            }
            failureCallback && failureCallback();
        },
    });

    console.log('useCheckSession', isLoading, isSuccess, status);
    return { isLoading, mutate, isSuccess };
};
