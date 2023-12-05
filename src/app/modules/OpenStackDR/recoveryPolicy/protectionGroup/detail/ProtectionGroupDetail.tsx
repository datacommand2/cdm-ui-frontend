import React from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { clusterKeys, protectionGroupKeys } from '../../../../../../libs/utils/queryKeys';
import { _getProtectionGroupDetail } from '../../../../../../api/dr/protectionGroup';
import { Detail } from '../../../../../component/common/Detail/Detail';
import TableChip from '../../../../../component/common/Chip/TableChip';
import { findLastWord, formatUnixTimestamp, getTypeFromDate } from '../../../../../../libs/utils/commonFunction';
import ClusterStatusChip from '../../../../Center/list/ClusterStatusChip';
import { _getClusterDetail } from '../../../../../../api/center/cluster';

/**
 * 보호그룹 상세정보를 보여주는 컴포넌트
 */
const ProtectionGroupDetail = () => {
    const location = useLocation();
    const GroupID = location.state.GroupID;

    const { data: protectionGroupDetail } = useQuery(
        protectionGroupKeys.detail(GroupID),
        () => _getProtectionGroupDetail(GroupID),
        {
            select: ([data, ,]) => {
                return data.group;
            },
            suspense: true,
        },
    );

    const { data: clusterDetail } = useQuery(
        clusterKeys.detail(protectionGroupDetail?.protection_cluster?.id),
        () => _getClusterDetail(protectionGroupDetail?.protection_cluster?.id),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.cluster;
                }
            },
            enabled: !!protectionGroupDetail,
        },
    );

    return (
        <Detail>
            <Detail.Title text={'보호그룹 상세'} />
            <Detail.Body>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'이름'} />
                        <Detail.ContentBody>{protectionGroupDetail.name}</Detail.ContentBody>
                        <Detail.ContentTitle text={'상태'} />
                        <Detail.ContentBodyDiv>
                            <TableChip
                                label={protectionGroupDetail.state_code}
                                color={protectionGroupDetail.state_code}
                            />
                        </Detail.ContentBodyDiv>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'설명'} />
                        <Detail.ContentBody>{protectionGroupDetail?.remarks ?? '-'}</Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>{}</Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'목표복구시간 (RTO)'} />
                        <Detail.ContentBody>
                            {protectionGroupDetail.recovery_time_objective} (
                            {getTypeFromDate(protectionGroupDetail.recovery_time_objective_type)})
                        </Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'목표복구시점 (RPO)'} />
                        <Detail.ContentBody>
                            {protectionGroupDetail.recovery_point_objective} (
                            {getTypeFromDate(protectionGroupDetail.recovery_point_objective_type)})
                        </Detail.ContentBody>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'스냅샷 생성주기'} />
                        <Detail.ContentBody>
                            {protectionGroupDetail.snapshot_interval} (
                            {getTypeFromDate(protectionGroupDetail.snapshot_interval_type)})
                        </Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>{}</Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'생성일'} />
                        <Detail.ContentBody>{formatUnixTimestamp(protectionGroupDetail.created_at)}</Detail.ContentBody>
                        <Detail.ContentTitle text={'수정일'} />
                        <Detail.ContentBody>{formatUnixTimestamp(protectionGroupDetail.updated_at)}</Detail.ContentBody>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'수정가능 여부'} />
                        <Detail.ContentBody>{protectionGroupDetail?.updatable ? '가능' : '불가능'}</Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>{}</Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'사용자 그룹'} />
                        <Detail.ContentBody>{protectionGroupDetail.owner_group?.name ?? '-'}</Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'사용자 그룹 설명'} />
                        <Detail.ContentBody>{protectionGroupDetail.owner_group?.remarks ?? '-'}</Detail.ContentBody>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentHeader text={'클러스터 정보'} />
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'이름'} />
                        <Detail.ContentBody>{protectionGroupDetail.protection_cluster?.name ?? '-'}</Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'상태'} />
                        <Detail.ContentBodyDiv>
                            {clusterDetail && (
                                <ClusterStatusChip clusterID={clusterDetail.id} isLoading={false} isClickable={false} />
                            )}
                        </Detail.ContentBodyDiv>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'타입'} />
                        <Detail.ContentBody>
                            {findLastWord(protectionGroupDetail.protection_cluster?.type_code).toLocaleUpperCase()}
                        </Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'소유자 그룹'} />
                        <Detail.ContentBody>
                            {protectionGroupDetail.protection_cluster?.owner_group.name}
                        </Detail.ContentBody>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
            </Detail.Body>
        </Detail>
    );
};

export default ProtectionGroupDetail;
