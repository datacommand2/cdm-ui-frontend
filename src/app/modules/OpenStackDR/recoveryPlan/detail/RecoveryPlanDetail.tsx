import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { recoveryPlanKeys } from '../../../../../libs/utils/queryKeys';
import { _getRecoveryPlan } from '../../../../../api/dr/recoveryPlan';
import { Detail } from '../../../../component/common/Detail/Detail';
import TableChip from '../../../../component/common/Chip/TableChip';
import { findLastWord, formatUnixTimestamp } from '../../../../../libs/utils/commonFunction';
import ClusterStatusChip from '../../../Center/list/ClusterStatusChip';
import ReasonDialog from '../../../../component/common/Dialog/ReasonDialog';

/**
 * 복구계획 상세 정보를 보여주는 컴포넌트
 */
const RecoveryPlanDetail = () => {
    const [reasonDialog, setReasonDialog] = useState(false);
    const [reasons, setReasons] = useState({
        type: '',
        reasons: [],
    });
    const location = useLocation();

    const PlanID = location.state.PlanID;
    const GroupID = location.state.GroupID;

    // 복구계획을 조회하는 함수
    const { data: recoveryPlanDetail } = useQuery(
        recoveryPlanKeys.detail(GroupID, PlanID),
        () => _getRecoveryPlan(GroupID, PlanID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.plan;
                }
            },
            suspense: true,
        },
    );

    console.log(recoveryPlanDetail);
    return (
        <Detail>
            <Detail.Title text={'복구계획 상세'} />
            <Detail.Body>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'이름'} />
                        <Detail.ContentBody>{recoveryPlanDetail.name}</Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'상태'} />
                        <Detail.ContentBodyDiv>
                            <TableChip label={recoveryPlanDetail.state_code} color={recoveryPlanDetail.state_code} />
                        </Detail.ContentBodyDiv>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'비고'} />
                        <Detail.ContentBody>{recoveryPlanDetail?.remarks ?? '-'}</Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>{}</Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'스냅샷 유지 개수'} />
                        <Detail.ContentBody>{recoveryPlanDetail.snapshot_retention_count}</Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>{}</Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'미러링 상태'} />
                        <Detail.ContentBodyDiv>
                            <TableChip
                                label={findLastWord(recoveryPlanDetail.mirror_state_code)}
                                color={findLastWord(recoveryPlanDetail.mirror_state_code)}
                                action={() => {
                                    setReasons({
                                        type: 'mirroring',
                                        reasons: recoveryPlanDetail.abnormal_state_reasons['mirroring'],
                                    });
                                    setReasonDialog(true);
                                }}
                            />
                        </Detail.ContentBodyDiv>
                    </Detail.ContentCell>
                    <Detail.ContentCell>{}</Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'생성일'} />
                        <Detail.ContentBody>{formatUnixTimestamp(recoveryPlanDetail.created_at)}</Detail.ContentBody>
                        <Detail.ContentTitle text={'수정일'} />
                        <Detail.ContentBody>{formatUnixTimestamp(recoveryPlanDetail.updated_at)}</Detail.ContentBody>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentHeader text={'원본 클러스터 정보'} />
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'이름'} />
                        <Detail.ContentBody>{recoveryPlanDetail.protection_cluster?.name ?? '-'}</Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'상태'} />
                        <Detail.ContentBodyDiv>
                            <ClusterStatusChip
                                clusterID={recoveryPlanDetail.protection_cluster.id}
                                isLoading={false}
                                isClickable={false}
                            />
                        </Detail.ContentBodyDiv>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentHeader text={'복구 클러스터 정보'} />
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'이름'} />
                        <Detail.ContentBody>{recoveryPlanDetail.recovery_cluster?.name ?? '-'}</Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'상태'} />
                        <Detail.ContentBodyDiv>
                            <ClusterStatusChip
                                clusterID={recoveryPlanDetail.recovery_cluster.id}
                                isLoading={false}
                                isClickable={false}
                            />
                        </Detail.ContentBodyDiv>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
                {reasonDialog && (
                    <ReasonDialog
                        open={reasonDialog}
                        setOpen={setReasonDialog}
                        reasons={reasons}
                        data={recoveryPlanDetail}
                    />
                )}
            </Detail.Body>
        </Detail>
    );
};

export default RecoveryPlanDetail;
