import React, { Suspense } from 'react';

import RecoveryPlanDetail from '../../../modules/OpenStackDR/recoveryPlan/detail/RecoveryPlanDetail';
import TitleContentSkeleton from '../../../component/common/Skeleton/TitleContentSkeleton';
import RecoveryPlanRecoveryInfo from '../../../modules/OpenStackDR/recoveryPlan/detail/RecoveryPlanRecoveryInfo';
import ContentLayout from '@/app/component/common/layout/ContentLayout';

/**
 * 복구계획의 상세정보를 보여주는 페이지
 */
const RecoveryPlanDetailPage = () => {
    return (
        <ContentLayout
            type="detail"
            content={
                <>
                    <Suspense fallback={<TitleContentSkeleton />}>
                        <RecoveryPlanDetail />
                    </Suspense>
                    <Suspense fallback={<TitleContentSkeleton />}>
                        <RecoveryPlanRecoveryInfo />
                    </Suspense>
                </>
            }
        />
    );
};

export default RecoveryPlanDetailPage;
