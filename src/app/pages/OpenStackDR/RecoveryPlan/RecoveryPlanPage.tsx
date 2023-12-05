import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import ContentLayout from '@/app/component/common/layout/ContentLayout';
import TreeListSkeleton from '@/app/component/common/Skeleton/TreeListSkeleton';
import RecoveryPlanList from '@/app/modules/OpenStackDR/recoveryPlan/list/RecoveryPlanList';
import { OpenStackPlanAndJobSideBar } from '@/app/modules/OpenStackDR/common/components';

/**
 * 복구계획 목록을 보여주는 페이지
 */
const RecoveryPlanPage = () => {
    const { t } = useTranslation();

    return (
        <ContentLayout
            type="list"
            treeHeader={t('DR.PROTECTION_GROUP')}
            tree={
                <Suspense fallback={<TreeListSkeleton />}>
                    <OpenStackPlanAndJobSideBar />
                </Suspense>
            }
            header={t('DR.RECOVERY_PLAN_LIST')}
            content={<RecoveryPlanList />}
        />
    );
};

export default RecoveryPlanPage;
