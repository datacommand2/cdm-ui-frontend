import { Box, Skeleton } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useTranslation } from 'react-i18next';

import DefaultChip from '../../../../component/common/Chip/DefaultChip';

type JobState =
    | 'dr.recovery.job.state.waiting'
    | 'dr.recovery.job.state.pending'
    | 'dr.recovery.job.state.running'
    | 'dr.recovery.job.state.canceling'
    | 'dr.recovery.job.state.paused'
    | 'dr.recovery.job.state.clearing'
    | 'dr.recovery.job.state.completed'
    | 'dr.recovery.job.state.clear-failed'
    | 'dr.recovery.job.state.reporting'
    | 'dr.recovery.job.state.finished';

type JobResult =
    | 'dr.recovery.result.success'
    | 'dr.recovery.result.partial_success'
    | 'dr.recovery.result.failed'
    | 'dr.recovery.result.canceled';

const JobStatusCode = {
    'dr.recovery.job.state.waiting': 'waiting',
    'dr.recovery.job.state.pending': 'pending',
    'dr.recovery.job.state.running': 'running',
    'dr.recovery.job.state.canceling': 'canceling',
    'dr.recovery.job.state.paused': 'paused',
    'dr.recovery.job.state.clearing': 'clearing',
    'dr.recovery.job.state.completed': 'completed',
    'dr.recovery.job.state.clear-failed': 'clear-failed',
    'dr.recovery.job.state.reporting': 'reporting',
    'dr.recovery.job.state.finished': 'finished',
};

const JobResultCode = {
    'dr.recovery.result.success': 'success',
    'dr.recovery.result.partial_success': 'partial_success',
    'dr.recovery.result.failed': 'failed',
    'dr.recovery.result.canceled': 'canceled',
};

const JobType = {
    'dr.recovery.type.migration': 'migration',
    'dr.recovery.type.simulation': 'simulation',
};

interface JobActionsProps {
    jobStatus: any;
    role: 'admin' | 'manager' | 'operator' | 'user' | 'viewer';
    jobType: 'dr.recovery.type.simulation' | 'dr.recovery.type.migration';
    setResumeModal: React.Dispatch<React.SetStateAction<boolean>>;
    setCancelModal: React.Dispatch<React.SetStateAction<boolean>>;
    setSimulationRollbackModal: React.Dispatch<React.SetStateAction<boolean>>;
    setMigrationRollbackModal: React.Dispatch<React.SetStateAction<boolean>>;
    setRetryRollbackModal: React.Dispatch<React.SetStateAction<boolean>>;
    setIgnoreRollbackModal: React.Dispatch<React.SetStateAction<boolean>>;
    setConfirmJobModal: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * 복구작업 액션 버튼
 * **ActionButton**
 * state_code 에 따라서 분기함
1. **waiting, pending, running, canceling, paused 인 경우에는 재개, 일시 중지, 취소 버튼**
    1. 현재 어떤 상태인지에 따라서 재개, 중지, 취소버튼 비활성화
2. **clearing, reporting, finished 인 경우에는 아무것도 없음**
3. completed, clear-failed -> action
4. clearing, reporting, finished -> no action

재해복구
1. state_code - **completed** 일 때
  1. result_code - **failed** 
      1. 롤백(onClickCancelRollbackButton), 재시도
  2. result_code - **canceled**
      1. 롤백(onClickCancelRollbackButton)
  3. result_code - **success**, **partial_success**
      1. 확정, 롤백(onClickCancelRollbackButton), 재시도
  2. state_code - **clear-failed** 일 때
      1. 롤백 재시도, 롤백 무시

모의훈련
1. state_code - **completed** 일 때
  1. result_code - **failed**
      1. 롤백(onClickRollbackButton)
  2. result_code - **success, partial_success, canceled**
      1. 롤백(onClickRollbackButton)
2. state_code - **clear-failed** 일 때
  1. 롤백 재시도, 롤백 무시
 */
const JobActions = ({
    jobStatus,
    role,
    jobType,
    setResumeModal,
    setCancelModal,
    setSimulationRollbackModal,
    setMigrationRollbackModal,
    setRetryRollbackModal,
    setIgnoreRollbackModal,
    setConfirmJobModal,
}: JobActionsProps) => {
    const { t } = useTranslation();
    // action 관련 모달
    // 일시중지, 재개, 취소, 롤백 무시, 롤백 재시도, 확정 재시도, 재시도, 롤백(모의) => operator
    // 롤백(재해), 확정, 확정 취소 => manager
    const displayManager = role !== 'admin' && role !== 'manager' ? { display: 'none' } : undefined;
    const displayOperator =
        role !== 'admin' && role !== 'manager' && role !== 'operator' ? { display: 'none' } : undefined;

    if (!jobStatus) {
        return (
            <Wrapper>
                <Skeleton variant="rounded" animation="wave" width={70} height={32} sx={{ marginRight: '0.5rem' }} />
                <Skeleton variant="rounded" animation="wave" width={70} height={32} sx={{ marginRight: '0.5rem' }} />
            </Wrapper>
        );
    }

    // 재해복구
    // completed
    // clear-failed
    // 모의훈련
    // completed
    // clear-failed
    else {
        const stateCode = jobStatus?.state_code as JobState;
        const resultCode = jobStatus?.result_code as JobResult;
        if (
            JobStatusCode[stateCode] === 'waiting' || // X
            JobStatusCode[stateCode] === 'pending' || // X
            JobStatusCode[stateCode] === 'running' || // pause
            JobStatusCode[stateCode] === 'canceling' || // X
            JobStatusCode[stateCode] === 'paused' // resume, cancel
        ) {
            // 재개, 중지, 취소 버튼 (disabled)
            return (
                <>
                    {/* 재개 */}
                    <DefaultChip
                        color={'success'}
                        style={displayOperator}
                        label={<PlayArrowIcon />}
                        onClick={() => setResumeModal(true)}
                        disabled={JobStatusCode[stateCode] !== 'paused'}
                    />
                    {/* 일시정지 */}
                    {/* 취소 */}
                    <DefaultChip
                        style={displayOperator}
                        color={'success'}
                        label={<StopIcon />}
                        onClick={() => setCancelModal(true)}
                        disabled={JobStatusCode[stateCode] !== 'paused' && JobStatusCode[stateCode] !== 'running'}
                    />
                </>
            );
        } else if (
            JobStatusCode[stateCode] === 'clearing' ||
            JobStatusCode[stateCode] === 'reporting' ||
            JobStatusCode[stateCode] === 'finished'
        ) {
            // 정리중, 리포트 생성중, 작업 종료시는 아무 action 없음
            return null;
        } else if (JobType[jobType] === 'migration') {
            // 재해복구
            if (JobStatusCode[stateCode] === 'completed') {
                if (JobResultCode[resultCode] === 'failed') {
                    // 재해복구 롤백, 재시도
                    return (
                        <>
                            <DefaultChip
                                style={displayManager}
                                color={'success'}
                                onClick={() => setMigrationRollbackModal(true)}
                                label={t('DR.DATA_CLEANUP')}
                            />
                            {/* TODO: 재해복구 재시도 (롤백 재시도 아님) */}
                        </>
                    );
                } else if (JobResultCode[resultCode] === 'canceled') {
                    // 재해복구 롤백
                    return (
                        <DefaultChip
                            style={displayManager}
                            color={'success'}
                            onClick={() => setMigrationRollbackModal(true)}
                            label={t('DR.DATA_CLEANUP')}
                        />
                    );
                } else if (JobResultCode[resultCode] === 'success' || JobResultCode[resultCode] === 'partial_success') {
                    // 확정, 재해복구 롤백, 재시도
                    return (
                        <>
                            <DefaultChip
                                style={displayManager}
                                color={'success'}
                                onClick={() => setConfirmJobModal(true)}
                                label={t('DR.CONFIRM')}
                            />
                            <DefaultChip
                                style={displayManager}
                                color={'success'}
                                onClick={() => setMigrationRollbackModal(true)}
                                label={t('DR.DATA_CLEANUP')}
                            />
                        </>
                    );
                } else return null;
            } else if (JobStatusCode[stateCode] === 'clear-failed') {
                // 롤백 재시도, 롤백 무시
                return (
                    <>
                        <DefaultChip
                            style={displayOperator}
                            color={'success'}
                            onClick={() => setRetryRollbackModal(true)}
                            label={t('DR.RETRY_DATA_CLEANUP')}
                        />
                        <DefaultChip
                            style={displayOperator}
                            color={'success'}
                            onClick={() => setIgnoreRollbackModal(true)}
                            label={t('DR.IGNORE_DATA_CLEANUP')}
                        />
                    </>
                );
            } else return null;
        } else if (JobType[jobType] === 'simulation') {
            if (JobStatusCode[stateCode] === 'completed') {
                // 모의훈련 롤백
                return (
                    <DefaultChip
                        style={displayOperator}
                        color={'success'}
                        onClick={() => setSimulationRollbackModal(true)}
                        label={t('DR.DATA_CLEANUP')}
                    />
                );
            } else if (JobStatusCode[stateCode] === 'clear-failed') {
                // 롤백 재시도, 롤백 무시
                return (
                    <>
                        <DefaultChip
                            style={displayOperator}
                            color={'success'}
                            onClick={() => setRetryRollbackModal(true)}
                            label={t('DR.RETRY_DATA_CLEANUP')}
                        />
                        <DefaultChip
                            style={displayOperator}
                            color={'success'}
                            onClick={() => setIgnoreRollbackModal(true)}
                            label={t('DR.IGNORE_DATA_CLEANUP')}
                        />
                    </>
                );
            } else return null;
        } else return null;
    }
};

export default JobActions;

const Wrapper = styled(Box)`
    flex-wrap: wrap;
    row-gap: 10px;
    display: flex;
`;
