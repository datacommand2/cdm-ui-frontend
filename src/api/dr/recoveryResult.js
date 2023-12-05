// recoveryResult 관련된 api
import { DELETE, GET } from '../../libs/utils/axios';

// 보호그룹 history를 조회하는 함수
export const _getProtectionGroupHistory = async () => {
    return await GET(`/recovery/history`);
};

// 재해복구결과 보고서 목록 조회하는 함수
export const _getRecoveryReport = async (groupID, groupName, limit, offset, type, result) => {
    return await GET(
        `/recovery/history/${groupID}/reports/${groupName}/list?limit=${limit}&offset=${offset}&type=${
            type === 'all' ? '' : type
        }&result="${result === 'all' ? '' : result}"`,
    );
};

// 재해복구결과 삭제하는 함수
export const _deleteRecoveryReport = async (groupID, reportID) => {
    return await DELETE(`/recovery/history/${groupID}/reports/${reportID}`);
};

// 재해복구결과 보고서 상세조회 하는 함수
export const _getRecoveryReportDetail = async (groupID, reportID) => {
    return await GET(`/recovery/history/${groupID}/reports/${reportID}/detail`);
};
