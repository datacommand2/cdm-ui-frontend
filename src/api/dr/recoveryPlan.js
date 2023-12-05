// 재해복구계획 관련 API
import { DELETE, GET, PATCH, POST } from '../../libs/utils/axios';

// 재해복구계획 목록을 불러오는 함수(선택한 보호그룹)
export const _getClusterRecoveryPlan = async (groupID, limit, offset, name) => {
    if (limit) {
        // 필터 보호그룹 리스트
        return await GET(`/recovery/groups/${groupID}/plans?limit=${limit}&offset=${offset}&name="${name.trim()}"`);
    } else {
        // 전체 보호그룹 리스트
        return await GET(`/recovery/groups/${groupID}/plans`);
    }
};

// 재해복구계획 삭제하는 함수
export const _deleteRecoveryPlan = async (groupID, planID) => {
    return DELETE(`/recovery/groups/${groupID}/plans/${planID}`);
};

// 재해복구계획 추가하는 함수
export const _addRecoveryPlan = async (groupID, planInfo) => {
    return POST(`/recovery/groups/${groupID}/plans`, planInfo);
};

// 재해복구계획 조회하는 함수
export const _getRecoveryPlan = async (groupID, planID) => {
    return await GET(`/recovery/groups/${groupID}/plans/${planID}`);
};

// 재해복구계획 수정하는 함수
export const _modifyRecoveryPlan = async (groupID, planID, recoveryPlan) => {
    return await PATCH(`/recovery/groups/${groupID}/plans/${planID}`, recoveryPlan);
};
