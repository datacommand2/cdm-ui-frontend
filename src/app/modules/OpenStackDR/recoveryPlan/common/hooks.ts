import { useQuery } from '@tanstack/react-query';
import { _getProtectionGroupDetail } from '../../../../../api/dr/protectionGroup';
import { _getRecoveryPlan } from '../../../../../api/dr/recoveryPlan';
import { protectionGroupKeys, recoveryPlanKeys } from '../../../../../libs/utils/queryKeys';

/**
 * 복구계획 상세 정보를 불러오는 함수
 */
export const useGetRecoveryPlan = (groupID: number, planID: number) => {
    const { data } = useQuery(recoveryPlanKeys.detail(groupID, planID), () => _getRecoveryPlan(groupID, planID), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                return data.plan;
            }
        },
        staleTime: Infinity,
        suspense: true,
    });
    return { data };
};

/**
 * 보호그룹 상세 정보를 불러오는 함수
 */
export const useGetProtectionGroup = (groupID: number) => {
    const { data } = useQuery(protectionGroupKeys.detail(groupID), () => _getProtectionGroupDetail(groupID), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                return data.group;
            }
        },
        staleTime: Infinity,
        suspense: true,
    });
    return { data };
};
