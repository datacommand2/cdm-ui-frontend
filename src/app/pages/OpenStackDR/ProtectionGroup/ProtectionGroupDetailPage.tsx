import React, { Suspense } from 'react';

import ContentLayout from '@/app/component/common/layout/ContentLayout';
import TitleContentSkeleton from '../../../component/common/Skeleton/TitleContentSkeleton';
import ProtectionGroupDetail from '../../../modules/OpenStackDR/recoveryPolicy/protectionGroup/detail/ProtectionGroupDetail';
import ProtectionGroupInstances from '../../../modules/OpenStackDR/recoveryPolicy/protectionGroup/detail/ProtectionGroupInstances';

/**
 * 보호그룹 상세 정보를 보여주는 페이지
 */
const ProtectionGroupDetailPage = () => {
    return (
        <ContentLayout
            type="detail"
            content={
                <>
                    <Suspense fallback={<TitleContentSkeleton />}>
                        <ProtectionGroupDetail />
                    </Suspense>
                    <Suspense fallback={<TitleContentSkeleton />}>
                        <ProtectionGroupInstances />
                    </Suspense>
                </>
            }
        />
    );
};

export default ProtectionGroupDetailPage;
