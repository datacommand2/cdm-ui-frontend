// recoveryJob 관련 api

import { DELETE, GET, PATCH, POST } from '../../libs/utils/axios';

// 재해복구작업 목록을 조회하는 함수
export const _getRecoveryJob = async (groupID, limit, offset, name, type) => {
    if (limit) {
        return await GET(
            `/recovery/groups/${groupID}/jobs?limit=${limit}&offset=${offset}&type=${
                type === 'all' ? '' : type
            }&name="${name.trim()}"`,
        );
    } else {
        return await GET(`/recovery/groups/${groupID}/jobs`);
    }
};

// 재해복구작업 삭제하는 함수
export const _deleteRecoveryJob = async (groupID, jobID) => {
    return await DELETE(`/recovery/groups/${groupID}/jobs/${jobID}`);
};

// 재해복구작업 삭제하는 함수
export const _deleteForceRecoveryJob = async (groupID, jobID) => {
    return await POST(`/recovery/groups/${groupID}/jobs/${jobID}/force-delete`);
};

// 재해복구작업 생성하는 함수
export const _addRecoveryJob = async (groupID, jobInfo) => {
    return await POST(`/recovery/groups/${groupID}/jobs`, { job: jobInfo });
};

// 재해복구작업 상세정보를 조회하는 함수
export const _getRecoveryJobDetail = async (groupID, jobID) => {
    return await GET(`/recovery/groups/${groupID}/jobs/${jobID}`);
};

// 재해복구작업 수정하는 함수
export const _modifyRecoveryJob = async (groupID, jobID, jobInfo) => {
    return await PATCH(`/recovery/groups/${groupID}/jobs/${jobID}`, { job: jobInfo });
};

// 재해복구작업 일시정지하는 함수
export const _pauseRecoveryJob = async (groupID, jobID) => {
    return await POST(`/recovery/groups/${groupID}/jobs/${jobID}/pause`);
};

// 재해복구작업 재개하는 함수
export const _resumeRecoveryJob = async (groupID, jobID) => {
    return await POST(`/recovery/groups/${groupID}/jobs/${jobID}/resume`);
};

// 재해복구작업 롤백하는 함수 // 모의훈련
export const _rollbackSimulationJob = async (groupID, jobID) => {
    return await POST(`/recovery/groups/${groupID}/jobs/${jobID}/rollback/simulation`);
};

// 재해복구작업 롤백하는 함수 // 재해복구
export const _rollbackMigrationJob = async (groupID, jobID) => {
    return await POST(`/recovery/groups/${groupID}/jobs/${jobID}/rollback/migration`);
};

// 재해복구작업 취소하는 함수
export const _cancelRecoveryJob = async (groupID, jobID) => {
    return await POST(`/recovery/groups/${groupID}/jobs/${jobID}/cancel`);
};

// 재해복구작업 확정하는 함수
export const _confirmRecoveryJob = async (groupID, jobID) => {
    return await POST(`/recovery/groups/${groupID}/jobs/${jobID}/confirm`);
};

// 재해복구작업 일시중지 시간 연장하는 함수
export const _extendPauseTime = async (groupID, jobID, extendTime) => {
    return await POST(`/recovery/groups/${groupID}/jobs/${jobID}/pause/extend`, { extend_time: extendTime });
};

// 재해복구작업 롤백 대기시간 연장하는 함수
export const _extendRollbackTime = async (groupID, jobID, rollbackTime) => {
    return await POST(`/recovery/groups/${groupID}/jobs/${jobID}/rollback/extend`, { extend_time: rollbackTime });
};

// 재해복구작업 롤백 재시도하는 함수
export const _retryRollbackRecoveryJob = async (groupID, jobID) => {
    return await POST(`/recovery/groups/${groupID}/jobs/${jobID}/rollback/retry`);
};

// 재해복구작업 롤백 무시하는 함수
export const _ignoreRollbackRecoveryJob = async (groupID, jobID) => {
    return await POST(`/recovery/groups/${groupID}/jobs/${jobID}/rollback/ignore`);
};

// 재해복구작업 재시도하는 함수
export const _retryRecoveryJob = async (groupID, jobID, retryData) => {
    return await POST(`/recovery/groups/${groupID}/jobs/${jobID}/retry`, retryData);
};
