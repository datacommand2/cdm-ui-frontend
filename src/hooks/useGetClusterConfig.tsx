import { useQuery } from '@tanstack/react-query';

import { clusterConfigKeys } from '@libs/utils/queryKeys';
import { _getClusterConfig } from '@api/center/cluster';

/**
 * 클러스터 Config를 조회하는 custom hooks
 */
const useGetClusterConfig = (clusterID: number) => {
    const { data: clusterConfig, isLoading: configLoading } = useQuery(
        clusterConfigKeys.detail(clusterID),
        () => _getClusterConfig(clusterID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.config;
                } else if (status === 204) {
                    return null;
                }
            },
            staleTime: 60000,
        },
    );

    return { configLoading, clusterConfig };
};

export default useGetClusterConfig;
