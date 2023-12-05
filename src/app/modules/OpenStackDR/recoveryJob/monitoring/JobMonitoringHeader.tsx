import { Box, Skeleton, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import HeaderChip from '../../../../component/common/Chip/HeaderChip';
import DefaultChip from '../../../../component/common/Chip/DefaultChip';
import { findLastWord } from '../../../../../libs/utils/commonFunction';

const simulation = 'dr.recovery.type.simulation';
const migration = 'dr.recovery.type.migration';
const completed = 'dr.recovery.job.state.completed';
const clearFailed = 'dr.recovery.job.state.clear-failed';

interface JobMonitoringHeaderProps {
    jobStatus: any;
    jobType: 'dr.recovery.type.simulation' | 'dr.recovery.type.migration';
    role: 'admin' | 'manager' | 'operator' | 'user' | 'viewer';
    setExtendRollbackModal: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * 복구작업 진행상황 결과, 동작, 정리 예정시간, 재개, 정지 등
 */
const JobMonitoringHeader = ({ jobStatus, jobType, role, setExtendRollbackModal }: JobMonitoringHeaderProps) => {
    if (!jobStatus) {
        return (
            <Wrapper>
                <Skeleton variant="rounded" animation="wave" width={70} height={32} sx={{ marginRight: '0.5rem' }} />
                <Skeleton variant="rounded" animation="wave" width={70} height={32} sx={{ marginRight: '0.5rem' }} />
            </Wrapper>
        );
    } else {
        return (
            <Wrapper>
                {/* result_code는 작업이 완료되지 않았으면 존재하지 않음 */}
                {jobStatus?.result_code && <HeaderChip label={jobStatus.result_code} color={jobStatus.result_code} />}
                <HeaderChip label={jobStatus.state_code} color={jobStatus.state_code} />
                {/* 일시 중지 상태이면 일시중지 시간 연장 가능 */}
                {/* TODO: 현재는 일시 중지 기능 없앤 상태임 */}
                {/* {jobStatus.state_code === 'dr.recovery.job.state.paused' && (
                    <DefaultChip
                        label={
                            <>
                                {t('DR.TIME_TO_RESTART')} :{' '}
                                {dayjs.unix(jobStatus.resume_at).format('YYYY.MM.DD HH:mm:ss')}
                            </>
                        }
                        color={'secondary'}
                    />
                )} */}
                {/* 롤백 예정 시간이 존재하면 롤백 예정 시간 및 연장 가능 */}
                {jobStatus?.rollback_at && findLastWord(jobStatus?.state_code) !== 'finished' && (
                    <ExtendInfo
                        jobStatus={jobStatus}
                        jobType={jobType}
                        role={role}
                        setExtendRollbackModal={setExtendRollbackModal}
                    />
                )}
            </Wrapper>
        );
    }
};

export default JobMonitoringHeader;

const Wrapper = styled(Box)`
    flex-wrap: wrap;
    row-gap: 10px;
    display: flex;
`;

interface ExtendInfoProps {
    jobStatus: any;
    jobType: 'dr.recovery.type.simulation' | 'dr.recovery.type.migration';
    role: 'admin' | 'manager' | 'operator' | 'user' | 'viewer';
    setExtendRollbackModal: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * 롤백 예정시간
 */
const ExtendInfo = ({ jobType, jobStatus, role, setExtendRollbackModal }: ExtendInfoProps) => {
    const { t } = useTranslation();
    // 모의훈련 completed, 모의훈련 clear-failed
    // 재해복구 clear-failed
    // => 연장 버튼 있음

    // 재해복구 completed
    // => 연장 버튼 없음
    return (
        <>
            <DefaultChip
                label={
                    <>
                        {t('DR.TIME_TO_CLEAN_UP_DATA')} :{' '}
                        {dayjs.unix(jobStatus.rollback_at).format('YYYY.MM.DD HH:mm:ss')}
                    </>
                }
                color={'secondary'}
            />
            {role !== 'user' &&
                ((jobType === simulation && jobStatus.state_code === completed) ||
                    (jobType === simulation && jobStatus.state_code === clearFailed) ||
                    (jobType === migration && jobStatus.state_code === clearFailed)) && (
                    <DefaultChip
                        label={<Typography>{t('BUTTON.EXTEND')}</Typography>}
                        color="secondary"
                        onClick={() => setExtendRollbackModal(true)}
                    />
                )}
        </>
    );
};
