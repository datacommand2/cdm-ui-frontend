import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import { clusterHypervisorKeys } from '../../../../../libs/utils/queryKeys';
import { _getClusterHypervisorDetail } from '../../../../../api/center/cluster';
import TableChip from '../../../../component/common/Chip/TableChip';
import ModifyNodeInfoForm from './ModifyNodeInfoForm';
import { formatBytes } from '../../../../../libs/utils/commonFunction';
import { LoginUser } from '../../../../../recoil/atom/LoginUser';
import { DetailDrawer } from '../../../../component/common/DetailDrawer/DetailDrawer';
import { OpenStackCluster } from '../../../../../@types/Cluster';

interface NodeDetailProps {
    clusterID: number;
    nodeID: number;
    cluster: OpenStackCluster;
}

/**
 * 하이퍼바이저 아이디를 받아와서 상세정보를 출력한다.
 */
const NodeDetail = ({ clusterID, nodeID, cluster }: NodeDetailProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const mode = theme.palette.mode;
    // 클러스터 노드의 상세정보를 불러오는 함수
    const loginUser = useRecoilValue(LoginUser);
    const role = loginUser?.roles ? loginUser.roles[0]?.role : 'user';

    const { data: hypervisorDetail } = useQuery(
        clusterHypervisorKeys.detail(clusterID, nodeID),
        () => _getClusterHypervisorDetail(clusterID, nodeID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.hypervisor;
                }
            },
            enabled: nodeID !== 0,
            suspense: true,
        },
    );

    const isPlenty = (total: number | undefined, used: number | undefined) => {
        if (!total) {
            return `${mode}-success`;
        }
        if (!used) {
            return `${mode}-success`;
        }
        if (total >= used) {
            return `${mode}-success`;
        } else {
            return `${mode}-error`;
        }
    };
    return (
        <DetailDrawer>
            <DetailDrawer.Title text={hypervisorDetail?.hostname} />
            <DetailDrawer.ContentHeader text={t('DR.NODE_INFO')} />
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={t('DR.HOST_NAME')} />
                <DetailDrawer.ContentBody>{hypervisorDetail?.hostname}</DetailDrawer.ContentBody>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={t('DR.IP_ADDRESS')} />
                <DetailDrawer.ContentBody>{hypervisorDetail?.ip_address}</DetailDrawer.ContentBody>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={t('DR.TYPE')} />
                <DetailDrawer.ContentBody>{hypervisorDetail?.type_code}</DetailDrawer.ContentBody>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentHeader text={t('DR.STATUS_INFO')} />
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={'Status'} />
                <DetailDrawer.ContentBodyDiv>
                    <TableChip label={hypervisorDetail?.status} color={hypervisorDetail?.status} />
                </DetailDrawer.ContentBodyDiv>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={'State'} />
                <DetailDrawer.ContentBodyDiv>
                    <TableChip label={hypervisorDetail?.state} color={hypervisorDetail?.state} />
                </DetailDrawer.ContentBodyDiv>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={'VCPUs'} />
                <DetailDrawer.ContentBody>
                    <span className={isPlenty(hypervisorDetail?.vcpu_total_cnt, hypervisorDetail?.vcpu_used_cnt)}>
                        {hypervisorDetail?.vcpu_used_cnt ?? 0} core (사용량)
                    </span>
                    / {hypervisorDetail?.vcpu_total_cnt ?? 0}
                    core (전체)
                </DetailDrawer.ContentBody>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={'RAM'} />
                <DetailDrawer.ContentBody>
                    <span className={isPlenty(hypervisorDetail?.mem_total_bytes, hypervisorDetail?.mem_used_bytes)}>
                        {formatBytes(hypervisorDetail?.mem_used_bytes ?? 0)} (사용량)
                    </span>{' '}
                    / {formatBytes(hypervisorDetail?.mem_total_bytes ?? 0)} (전체)
                </DetailDrawer.ContentBody>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={'DISK'} />
                <DetailDrawer.ContentBody>
                    <span className={isPlenty(hypervisorDetail?.disk_total_bytes, hypervisorDetail?.disk_used_bytes)}>
                        {formatBytes(hypervisorDetail?.disk_used_bytes ?? 0)} (사용량)
                    </span>{' '}
                    /{formatBytes(hypervisorDetail?.disk_total_bytes ?? 0)} (전체)
                </DetailDrawer.ContentBody>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentHeader text={t('DR.MODIFY_NODE_INFO')} />
            {(role === 'admin' || role === 'manager') && hypervisorDetail && (
                <ModifyNodeInfoForm hypervisorDetail={hypervisorDetail} clusterID={clusterID} cluster={cluster} />
            )}
        </DetailDrawer>
    );
};

export default React.memo(NodeDetail);
