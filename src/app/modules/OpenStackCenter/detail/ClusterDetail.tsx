import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Divider } from '@mui/material';

import { clusterKeys } from '../../../../libs/utils/queryKeys';
import { _getClusterDetail } from '../../../../api/center/cluster';
import { Detail } from '../../../component/common/Detail/Detail';
import { findLastWord, formatUnixTimestamp } from '../../../../libs/utils/commonFunction';
import ClusterStatusChip from '../../Center/list/ClusterStatusChip';

/**
 * 클러스터 상세 정보를 보여주는 컴포넌트
 */
const ClusterDetail = () => {
    const location = useLocation();

    const ClusterID = Number(location.state.clusterID);

    // 클러스터 정보를 불러오는 함수
    const { data: clusterDetail } = useQuery(clusterKeys.detail(ClusterID), () => _getClusterDetail(ClusterID), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                return data.cluster;
            }
        },
        suspense: true,
    });

    return (
        <Detail>
            <Detail.Title text={'클러스터 상세'} />
            <Detail.Body>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'이름'} />
                        <Detail.ContentBody>{clusterDetail?.name}</Detail.ContentBody>
                    </Detail.ContentCell>
                    <Divider />
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'타입'} />
                        <Detail.ContentBody>
                            {findLastWord(clusterDetail?.type_code).toLocaleUpperCase()}
                        </Detail.ContentBody>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'API URL'} />
                        <Detail.ContentBody>{clusterDetail?.api_server_url}</Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'상태'} />
                        <Detail.ContentBodyDiv>
                            <ClusterStatusChip clusterID={ClusterID} />
                        </Detail.ContentBodyDiv>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'설명'} />
                        <Detail.ContentBody>{clusterDetail?.remarks ?? '-'}</Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>{}</Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'생성일'} />
                        <Detail.ContentBody>{formatUnixTimestamp(clusterDetail?.created_at)}</Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'수정일'} />
                        <Detail.ContentBody>{formatUnixTimestamp(clusterDetail?.updated_at)}</Detail.ContentBody>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'사용자 그룹'} />
                        <Detail.ContentBody>{clusterDetail?.owner_group?.name ?? '-'}</Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text={'사용자 그룹 설명'} />
                        <Detail.ContentBody>{clusterDetail?.owner_group?.remarks ?? '-'}</Detail.ContentBody>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
            </Detail.Body>
        </Detail>
    );
};

export default ClusterDetail;
