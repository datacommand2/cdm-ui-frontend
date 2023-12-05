// 보호그룹 관련 API
import { DELETE, GET, PATCH, POST } from '../../libs/utils/axios';

// 클러스터 비보호 인스턴스 목록 조회
export const _getUnprotectedInstance = async (clusterID, tenantID) => {
    if (tenantID === 'all') {
        return await GET(`/recovery/unprotected-instances?cluster_id=${clusterID}`);
    } else {
        return await GET(`/recovery/unprotected-instances?cluster_id=${clusterID}&cluster_tenant_id=${tenantID}`);
    }
};

// 전체 보호그룹 목록 조회
export const _getProtectionGroup = async (limit, offset, name, clusterID) => {
    if (limit) {
        // 필터링 된 보호그룹 목록 조회
        return await GET(
            `/recovery/groups?limit=${limit}&offset=${offset}&protection_cluster_id=${clusterID}&name="${name.trim()}"`,
        );
    } else {
        // 전체 보호그룹 목록 조회
        return await GET(`/recovery/groups`);
    }
};

// 보호그룹 목록 조회(선택한 클러스터)
export const _getClusterRecoveryGroup = async clusterID => {
    return await GET(`/recovery/groups?protection_cluster_id=${clusterID}`);
};

// 보호그룹 조회
export const _getProtectionGroupDetail = async groupID => {
    return await GET(`/recovery/groups/${groupID}`);
};

// 보호그룹을 삭제하는 함수
export const _deleteProtectionGroup = async groupID => {
    return await DELETE(`/recovery/groups/${groupID}`);
};

// 보호그룹을 등록하는 함수
export const _addProtectionGroup = async groupInfo => {
    return await POST(`/recovery/groups`, { group: groupInfo });
};

// 보호그룹을 수정하는 함수
export const _modifyProtectionGroup = async (groupID, groupInfo) => {
    return await PATCH(`/recovery/groups/${groupID}`, { group: groupInfo });
};

/**
 * 하이퍼바이저 리소스를 확인하는 함수
 */
export const _getHypervisorResource = async (groupID, planID, type, snapshotID) => {
    if (type === 'dr.recovery.recovery_point.type.snapshot') {
        return await GET(
            `/recovery/groups/${groupID}/plans/${planID}/hypervisor-resources?recovery_point_type_code=${type}&snapshot_id=${snapshotID}`,
        );
    } else {
        return await GET(
            `/recovery/groups/${groupID}/plans/${planID}/hypervisor-resources?recovery_point_type_code=${type}`,
        );
    }
};
