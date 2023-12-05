import { IFormEditRecoveryJob, IFormRecoveryJob } from './type';

/**
 * 실행정보(즉시, 특정일시, 스케쥴) 에 따라서 request data 구조 변경
 */
export const createAddRequest = (data: IFormRecoveryJob) => {
    const baseRequest = {
        plan: {
            id: data.plan.id,
        },
        type_code: data.type_code,
        recovery_point_type_code: data.recovery_point_type_code,
    };

    let request;

    if (data.schedule_type === 'immediately') {
        request = {
            ...baseRequest,
        };
    }

    return request;
};

/**
 * request data 구조 변경
 */
export const createEditRequest = (data: IFormEditRecoveryJob) => {
    const baseRequest = {
        id: data.id,
        plan: {
            id: data.plan.id,
        },
        recovery_point_type_code: data.recovery_point_type_code,
        type_code: data.type_code,
    };

    return baseRequest;
};
