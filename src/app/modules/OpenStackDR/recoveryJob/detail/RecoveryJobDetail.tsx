import React from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { recoveryJobKeys } from '../../../../../libs/utils/queryKeys';
import { _getRecoveryJobDetail } from '../../../../../api/dr/recoveryJob';
import { Detail } from '../../../../component/common/Detail/Detail';
import { findLastWord, formatUnixTimestamp } from '../../../../../libs/utils/commonFunction';
import TableChip from '../../../../component/common/Chip/TableChip';
import { RecoveryPointTypeOptions } from '../../../../../constant/selectOptions';
import ExecutionTypeFormatter from '../../../../component/common/Table/formatter/ExecutionTypeFormatter';
import RecoveryJobSchedule from './RecoveryJobSchedule';

/**
 * 복구작업 상세 정보를 보여주는 컴포넌트
 * schedule 이 존재하지 않으면 실행 타입 => 즉시
 */
const RecoveryJobDetail = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const GroupID = location.state.GroupID;
    const JobID = location.state.JobID;

    // 복구작업 상세 정보를 불러온다.
    const { data: recoveryJobDetail } = useQuery(
        recoveryJobKeys.detail(GroupID, JobID),
        () => _getRecoveryJobDetail(GroupID, JobID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.job;
                } else throw new Error();
            },
            suspense: true,
        },
    );

    return (
        <Detail>
            <Detail.Title text={'복구작업 상세'} />
            <Detail.Body>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'유형'} />
                        <Detail.ContentBody>
                            {t(`DR.${findLastWord(recoveryJobDetail.type_code).toUpperCase()}`)}
                        </Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'상태'} />
                        <Detail.ContentBodyDiv>
                            <TableChip label={recoveryJobDetail.state_code} color={recoveryJobDetail.state_code} />
                        </Detail.ContentBodyDiv>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'데이터 시점 유형'} />
                        <Detail.ContentBody>
                            {
                                RecoveryPointTypeOptions.filter(
                                    options => options.value === recoveryJobDetail.recovery_point_type_code,
                                )[0].label
                            }
                        </Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'스냅샷'} />
                        <Detail.ContentBody>
                            {recoveryJobDetail?.recovery_point_snapshot
                                ? formatUnixTimestamp(recoveryJobDetail?.recovery_point_snapshot.created_at)
                                : '-'}
                        </Detail.ContentBody>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'실행 타입'} />
                        <Detail.ContentBodyDiv>
                            <ExecutionTypeFormatter data={recoveryJobDetail?.schedule?.type} />
                        </Detail.ContentBodyDiv>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'다음 실행 예정 시간'} />
                        <Detail.ContentBody>
                            {recoveryJobDetail?.next_runtime
                                ? formatUnixTimestamp(recoveryJobDetail.next_runtime)
                                : '-'}
                        </Detail.ContentBody>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>

                {recoveryJobDetail?.schedule && (
                    <>
                        <Detail.ContentHeader text={'스케쥴 정보'} />
                        <Detail.ContentWrapper>
                            <Detail.ContentCell>
                                <Detail.ContentTitle text={'시작 시간'} />
                                <Detail.ContentBody>
                                    {formatUnixTimestamp(recoveryJobDetail?.schedule.start_at)}
                                </Detail.ContentBody>
                            </Detail.ContentCell>
                            <Detail.ContentCell>
                                <Detail.ContentTitle text={'종료 시간'} />
                                <Detail.ContentBody>
                                    {formatUnixTimestamp(recoveryJobDetail?.schedule.end_at)}
                                </Detail.ContentBody>
                            </Detail.ContentCell>
                        </Detail.ContentWrapper>
                        <RecoveryJobSchedule schedule={recoveryJobDetail?.schedule} />
                        <Detail.ContentWrapper>
                            <Detail.ContentCell>
                                <Detail.ContentTitle text={'타임존'} />
                                <Detail.ContentBody>{recoveryJobDetail.schedule.timezone}</Detail.ContentBody>
                            </Detail.ContentCell>
                            <Detail.ContentCell>
                                <Detail.ContentTitle text={''} />
                                <Detail.ContentBody>{}</Detail.ContentBody>
                            </Detail.ContentCell>
                        </Detail.ContentWrapper>
                    </>
                )}
            </Detail.Body>
        </Detail>
    );
};

export default RecoveryJobDetail;
