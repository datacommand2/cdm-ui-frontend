import { useMutation, useQuery } from '@tanstack/react-query';

import { _getClusterRecoveryPlan } from '@/api/dr/recoveryPlan';
import { recoveryPlanKeys } from '@/libs/utils/queryKeys';
import {
    _cancelRecoveryJob,
    _confirmRecoveryJob,
    _extendPauseTime,
    _extendRollbackTime,
    _ignoreRollbackRecoveryJob,
    _pauseRecoveryJob,
    _resumeRecoveryJob,
    _retryRollbackRecoveryJob,
    _rollbackMigrationJob,
    _rollbackSimulationJob,
} from '@/api/dr/recoveryJob';
import { QueryCallback } from '@/@types';

/**
 * 복구계획 목록 조회
 */
export const useGetOpenStackRecoveryPlans = (groupID: number) => {
    const { data, isLoading } = useQuery(
        recoveryPlanKeys.list({ protectionGroupID: groupID }),
        () => _getClusterRecoveryPlan(groupID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.plans;
                } else if (status === 204) {
                    return [];
                }
            },
            keepPreviousData: true,
            suspense: true,
            enabled: !!groupID,
        },
    );

    return { data, isLoading };
};

/**
 * 재해복구작업을 일시정지하는 함수
 */
export const usePauseRecoveryJob = (groupID: number, jobID: number, successCallback?: QueryCallback) => {
    const { mutate, isLoading } = useMutation(() => _pauseRecoveryJob(groupID, jobID), {
        onSuccess: ([, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback();
            }
        },
    });

    return { isLoading, mutate };
};

/**
 * 재해복구작업을 재개하는 함수
 */
export const useResumeRecoveryJob = (groupID: number, jobID: number, successCallback?: QueryCallback) => {
    const { mutate, isLoading } = useMutation(() => _resumeRecoveryJob(groupID, jobID), {
        onSuccess: ([, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback();
            }
        },
    });
    return { isLoading, mutate };
};

/**
 * 재해복구작업을 롤백하는 함수 (모의훈련)
 */
export const useRollbackSimulationRecoveryJob = (groupID: number, jobID: number, successCallback?: QueryCallback) => {
    const { mutate, isLoading } = useMutation(() => _rollbackSimulationJob(groupID, jobID), {
        onSuccess: ([, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback();
            }
        },
    });
    return { isLoading, mutate };
};

/**
 * 재해복구작업을 롤백하는 함수 (재해복구)
 */
export const useRollbackMigrationRecoveryJob = (groupID: number, jobID: number, successCallback?: QueryCallback) => {
    const { mutate, isLoading } = useMutation(() => _rollbackMigrationJob(groupID, jobID), {
        onSuccess: ([, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback();
            }
        },
    });
    return { isLoading, mutate };
};

/**
 * 재해복구작업을 취소하는 함수
 */
export const useCancelRecoveryJob = (groupID: number, jobID: number, successCallback?: QueryCallback) => {
    const { mutate, isLoading } = useMutation(() => _cancelRecoveryJob(groupID, jobID), {
        onSuccess: ([, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback();
            }
        },
    });
    return { isLoading, mutate };
};

/**
 * 재해복구작업을 확정하는 함수
 */
export const useConfirmRecoveryJob = (groupID: number, jobID: number, successCallback?: QueryCallback) => {
    const { mutate, isLoading } = useMutation(() => _confirmRecoveryJob(groupID, jobID), {
        onSuccess: ([, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback();
            }
        },
    });
    return { isLoading, mutate };
};

/**
 * 재해복구작업 롤백 재시도하는 함수
 */
export const useRetryRollbackRecoveryJob = (groupID: number, jobID: number, successCallback?: QueryCallback) => {
    const { mutate, isLoading } = useMutation(() => _retryRollbackRecoveryJob(groupID, jobID), {
        onSuccess: ([, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback();
            }
        },
    });
    return { isLoading, mutate };
};

/**
 * 재해복구작업 롤백 무시하는 함수
 */
export const useIgnoreRollbackRecoveryJob = (groupID: number, jobID: number, successCallback?: QueryCallback) => {
    const { mutate, isLoading } = useMutation(() => _ignoreRollbackRecoveryJob(groupID, jobID), {
        onSuccess: ([, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback();
            }
        },
    });
    return { isLoading, mutate };
};

// // 복구작업 재시도 하는 함수
// const { mutate: retryRecoveryJob, isLoading: retryLoading } = useMutation(
//     payload => _retryRecoveryJob(groupID, jobID, payload),
//     {
//         onSuccess: ([data, error, status]) => {
//             if (status === 200 || status === 201) {
//                 toast.success(t('DR.SUCCESS_RETRY'));
//                 setRetryModal(false);
//             }
//         },
//     },
// );

/**
 * 재해복구작업 일시중지 시간을 연장하는 함수
 */
export const useExtendPauseTime = (
    groupID: number,
    jobID: number,
    extendTime: number,
    successCallback?: QueryCallback,
) => {
    const { mutate, isLoading } = useMutation(() => _extendPauseTime(groupID, jobID, extendTime), {
        onSuccess: ([, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback();
            }
        },
    });
    return { isLoading, mutate };
};

/**
 * 재해복구작업 롤백 대기 시간을 연장하는 함수
 */
export const useExtendRollbackTime = (
    groupID: number,
    jobID: number,
    extendTime: number,
    successCallback?: QueryCallback,
) => {
    const { mutate, isLoading } = useMutation(() => _extendRollbackTime(groupID, jobID, extendTime), {
        onSuccess: ([, , status]) => {
            if (status === 200 || status === 201) {
                successCallback && successCallback();
            }
        },
    });
    return { isLoading, mutate };
};
