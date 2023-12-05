import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import { clusterVolumeTypeKeys } from '../../../../../libs/utils/queryKeys';
import { _getClusterVolumeTypeDetail } from '../../../../../api/center/cluster';
import ModifyVolumeTypeMetaData from './ModifyVolumeTypeMetaData';
import { LoginUser } from '../../../../../recoil/atom/LoginUser';
import { DetailDrawer } from '../../../../component/common/DetailDrawer/DetailDrawer';
import { OpenStackCluster } from '../../../../../@types/Cluster';

interface VolumeTypeDetailProps {
    volumeTypeID: number;
    clusterID: number;
    cluster: OpenStackCluster;
}

/**
 * 클러스터 아이디와 볼륨타입 아이디를 받아와서 볼륨타입 상세정보를 출력하는 컴포넌트
 */
const VolumeTypeDetail = ({ volumeTypeID, clusterID, cluster }: VolumeTypeDetailProps) => {
    const { t } = useTranslation();
    const loginUser = useRecoilValue(LoginUser);
    const role = loginUser?.roles ? loginUser.roles[0]?.role : 'user';

    // 클러스터 볼륨타입을 조회하는 함수
    const { data: volumeTypeDetail } = useQuery(
        clusterVolumeTypeKeys.detail(clusterID, volumeTypeID),
        () => _getClusterVolumeTypeDetail(clusterID, volumeTypeID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.storage;
                }
            },
            suspense: true,
        },
    );

    return (
        <DetailDrawer>
            <DetailDrawer.Title text={volumeTypeDetail?.name} />
            <DetailDrawer.ContentHeader text={t('DR.VOLUME_TYPE_INFO')} />
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={'UUID'} />
                <DetailDrawer.ContentBody>{volumeTypeDetail?.uuid}</DetailDrawer.ContentBody>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={t('TABLE.DESCRIPTION')} />
                <DetailDrawer.ContentBody>{volumeTypeDetail?.description}</DetailDrawer.ContentBody>
            </DetailDrawer.ContentWrapper>
            {volumeTypeDetail?.type_code.split('.')[3] === 'ceph' && (role === 'admin' || role === 'manager') && (
                <>
                    <DetailDrawer.ContentHeader text={t('DR.CLUSTER_VOLUME_TYPE_METADATA')} />
                    <ModifyVolumeTypeMetaData cluster={cluster} volumeTypeDetail={volumeTypeDetail} />
                </>
            )}
        </DetailDrawer>
    );
};

export default VolumeTypeDetail;
