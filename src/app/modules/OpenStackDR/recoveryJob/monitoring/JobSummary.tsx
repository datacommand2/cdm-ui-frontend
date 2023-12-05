import React from 'react';
import dayjs from 'dayjs';
import { Typography } from '@mui/material';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { DetailDrawer } from '../../../../component/common/DetailDrawer/DetailDrawer';
import { findLastWord, formatToHHmmss } from '../../../../../libs/utils/commonFunction';
import { TEXT } from '../../../../../constant/text';
import TableChip from '../../../../component/common/Chip/TableChip';
import DefaultSkeleton from '@/app/component/common/Skeleton/DefaultSkeleton';

interface JobSummaryProps {
    jobDetail: any;
    jobStatus: any;
    instances: any[];
    volumes: any[];
}
/**
 * 복구작업 요약 정보 컴포넌트
 */
const JobSummary = ({ jobDetail, jobStatus, instances = [], volumes = [] }: JobSummaryProps) => {
    const { t } = useTranslation();
    /**
     * 경과 시간을 계산하는 함수
     **/
    const getTotalTime = () => {
        if (jobStatus.finished_at) {
            const time = jobStatus.finished_at - jobStatus.started_at;
            return formatToHHmmss(time, 'second');
        } else {
            const time = dayjs().unix() - jobStatus.started_at;
            return formatToHHmmss(time, 'second');
        }
    };

    const exceptedInstances = instances.filter(instance => findLastWord(instance.state_code) === 'excepted');
    const successInstances = instances.filter(instance => findLastWord(instance.state_code) === 'success');
    const failedInstances = instances.filter(instance => findLastWord(instance.state_code) === 'failed');
    const exceptedVolumes = volumes.filter(volume => findLastWord(volume.state_code) === 'excepted');
    const successVolumes = volumes.filter(volume => findLastWord(volume.state_code) === 'success');
    const failedVolumes = volumes.filter(volume => findLastWord(volume.state_code) === 'failed');

    if (jobDetail) {
        return (
            <DetailDrawer>
                <DetailDrawer.Title variant={'h6'} text={t('DR.SUMMARY')} />
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'시작 일시'} />
                    <DetailDrawer.ContentBody>
                        {jobStatus.started_at ? dayjs.unix(jobStatus.started_at).format('YYYY.MM.DD HH:mm:ss') : ''}
                    </DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'종료 일시'} />
                    <DetailDrawer.ContentBody>
                        {jobStatus.finished_at ? dayjs.unix(jobStatus.finished_at).format('YYYY.MM.DD HH:mm:ss') : ''}
                    </DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'목표 복구 시간'} />
                    <DetailDrawer.ContentBody>
                        {formatToHHmmss(jobDetail?.group?.recovery_time_objective, 'minute')}
                    </DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'경과 시간'} />
                    <DetailDrawer.ContentBody>{getTotalTime()}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'데이터 시점'} />
                    <DetailDrawer.ContentBody>
                        {TEXT[jobDetail?.recovery_point_type_code ?? '-']}
                    </DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'진행 상태'} />
                    <DetailDrawer.ContentBody>
                        <TableChip label={jobStatus?.state_code} color={jobStatus?.state_code} />
                    </DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'진행 결과'} />
                    <DetailDrawer.ContentBody>
                        <TableChip label={jobStatus?.result_code} color={jobStatus?.result_code} />
                    </DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>

                <DetailDrawer.ContentHeader text={t('DR.INSTANCE')} />
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={t('DR.NUNBER_TARGET')} />
                    <DetailDrawer.ContentBody>{instances.length}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={t('DR.NUNBER_SUCCESS')} />
                    <DetailDrawer.ContentBody>{successInstances.length}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={t('DR.NUNBER_FAIL')} />
                    <DetailDrawer.ContentBody>{failedInstances.length}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={t('DR.NUNBER_EXCLUDED')} />
                    <DetailDrawer.ContentBody>{exceptedInstances.length}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>

                <DetailDrawer.ContentHeader text={t('DR.VOLUME')} />
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={t('DR.NUNBER_TARGET')} />
                    <DetailDrawer.ContentBody>{volumes.length}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={t('DR.NUNBER_SUCCESS')} />
                    <DetailDrawer.ContentBody>{successVolumes.length}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={t('DR.NUNBER_FAIL')} />
                    <DetailDrawer.ContentBody>{failedVolumes.length}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={t('DR.NUNBER_EXCLUDED')} />
                    <DetailDrawer.ContentBody>{exceptedVolumes.length}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>

                <DetailDrawer.ContentHeader text={t('DR.RESON_FAILURE')} />
                {jobStatus.failed_reasons
                    ? jobStatus.failed_reasons.map(
                          (
                              reason: {
                                  contents: string;
                                  code: string;
                              },
                              i: number,
                          ) => {
                              return (
                                  <FailedText color="error" key={i}>
                                      {reason.code}
                                  </FailedText>
                              );
                          },
                      )
                    : null}
            </DetailDrawer>
        );
    } else {
        return <DefaultSkeleton />;
    }
};

export default JobSummary;

const FailedText = styled(Typography)`
    &::before {
        content: '▪';
    }
`;
