import { useMutation, useQuery } from '@tanstack/react-query';

import { ServiceConfig } from '@/@types/Cloud/config';
import { _getServiceConfig, _updateServiceConfig } from '@api/cloud/identity';
import { serviceConfigKeys } from '@libs/utils/queryKeys';
import { QueryCallback } from '@/@types';

// 서버스 설정 데이터를 가져오는 쿼리
export const useServiceConfigQuery = ({
    successCallback,
    failureCallback,
}: {
    successCallback?: QueryCallback;
    failureCallback?: QueryCallback;
} = {}) => {
    // service config data query
    return useQuery(serviceConfigKeys.lists(), () => _getServiceConfig(), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback(data);
                return data.service_configs;
            }
            failureCallback && failureCallback();
        },
        staleTime: 50000,
        // suspense: true일 경우 useServiceConfigQuery를 사용하는 컴포넌트의
        // 상위 컴포넌트에서 <Suspense>로 감싸줘야 한다.
        suspense: true,
    });
};

/**
 * 서비스 설정 추가 또는 수정
 */
export const useServiceConfigMutation = ({
    data,
    successCallback,
    failureCallback,
}: {
    data: ServiceConfig[];
    successCallback?: QueryCallback;
    failureCallback?: QueryCallback;
}) => {
    return useMutation(() => _updateServiceConfig(data), {
        onSuccess: ([data, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback(data);
                return;
            }
            failureCallback && failureCallback();
        },
    });
};
