import ContentLayout from '@/app/component/common/layout/ContentLayout';
import React, { Suspense } from 'react';

import TitleContentSkeleton from '../../component/common/Skeleton/TitleContentSkeleton';
import ClusterAuthInfo from '../../modules/OpenStackCenter/detail/ClusterAuthInfo';
import ClusterDetail from '../../modules/OpenStackCenter/detail/ClusterDetail';
import ClusterStatus from '../../modules/OpenStackCenter/detail/ClusterStatus';
import ClusterTab from '../../modules/OpenStackCenter/detail/ClusterTab';

/**
 * 클러스터 상세 정보를 보여주는 페이지
 */
const OpenStackClusterDetailPage = () => {
    return (
        <ContentLayout
            type="detail"
            content={
                <>
                    <Suspense fallback={<TitleContentSkeleton />}>
                        <ClusterDetail />
                    </Suspense>
                    <Suspense fallback={<TitleContentSkeleton />}>
                        <ClusterStatus />
                    </Suspense>
                    <Suspense fallback={<TitleContentSkeleton />}>
                        <ClusterTab />
                    </Suspense>
                    <Suspense fallback={<TitleContentSkeleton />}>
                        <ClusterAuthInfo />
                    </Suspense>
                </>
            }
        />
    );
};

export default OpenStackClusterDetailPage;
