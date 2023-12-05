import { _getClusterList } from '@/api/center/cluster';
import { _getClusterRecoveryGroup, _getProtectionGroup } from '@/api/dr/protectionGroup';
import { _getProtectionGroupHistory } from '@/api/dr/recoveryResult';
import { clusterKeys, protectionGroupHistoryKeys, protectionGroupKeys } from '@/libs/utils/queryKeys';
import { useQueries, useQuery } from '@tanstack/react-query';

/**
 * 오픈스택 클러스터 목록 조회
 */
export const useGetOpenStackClusters = () => {
    const { data } = useQuery(clusterKeys.all, () => _getClusterList(), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                return data?.clusters;
            } else if (status === 204) {
                return [];
            }
        },
        suspense: true,
    });

    return { data };
};

/**
 * 보호그룹 목록 조회
 */
export const useGetOpenStackProtectionGroups = () => {
    const { data, isFetching } = useQuery(protectionGroupKeys.lists(), () => _getProtectionGroup(), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                return data.groups;
            } else if (status === 204) {
                return [];
            }
        },
        suspense: true,
    });

    return { data, isFetching };
};

/**
 * 클러스터 트리의 보호그룹 목록 조회
 */
export const useGetProtectionGroupTrees = (clusters: any) => {
    const protectionGroups = useQueries({
        queries: clusters.map((cluster: any) => {
            return {
                queryKey: protectionGroupKeys.list({ clusterID: cluster.id }),
                queryFn: () => _getClusterRecoveryGroup(cluster.id),
                select: ([data, , status]: any) => {
                    if (status === 200 || status === 201) {
                        return [cluster.id, data.groups];
                    } else if (status === 204) {
                        return [cluster.id, []];
                    }
                },
                enabled: !!clusters,
                suspense: true,
            };
        }),
    });

    return { protectionGroups };
};

/**
 * 보호그룹 History 목록 조회
 */
export const useGetProtectionGroupHistories = () => {
    const { data } = useQuery(protectionGroupHistoryKeys.all, () => _getProtectionGroupHistory(), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                const clusters = data.history.clusters.map((cluster: any) => {
                    return {
                        id: cluster.id,
                        name: cluster.name,
                    };
                });
                const groups = data.history.clusters.map((cluster: any) => {
                    return {
                        data: [cluster.id, cluster?.groups ?? []],
                    };
                });

                return {
                    clusters,
                    groups,
                };
            } else if (status === 204) {
                return {
                    clusters: [],
                    groups: [],
                };
            }
        },
        suspense: true,
    });

    return { data };
};
