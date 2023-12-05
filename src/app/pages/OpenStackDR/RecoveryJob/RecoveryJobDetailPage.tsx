import React, { Suspense } from 'react';

import ContentLayout from '@/app/component/common/layout/ContentLayout';
import TitleContentSkeleton from '../../../component/common/Skeleton/TitleContentSkeleton';
import RecoveryJobDetail from '../../../modules/OpenStackDR/recoveryJob/detail/RecoveryJobDetail';

/**
 * 복구작업 상세정보를 보여주는 페이지
 */
const RecoveryJobDetailPage = () => {
    return (
        <ContentLayout
            type="detail"
            content={
                <Suspense fallback={<TitleContentSkeleton />}>
                    <RecoveryJobDetail />
                </Suspense>
            }
        />
    );
};

export default RecoveryJobDetailPage;
