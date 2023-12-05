import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import ContentLayout from '@/app/component/common/layout/ContentLayout';
import TreeListSkeleton from '@/app/component/common/Skeleton/TreeListSkeleton';
import RecoveryJobList from '@/app/modules/OpenStackDR/recoveryJob/list/RecoveryJobList';
import { OpenStackPlanAndJobSideBar } from '@/app/modules/OpenStackDR/common/components';

/**
 * OpenStack 복구작업 목록을 보여주는 페이지
 */
const RecoveryJobPage = () => {
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
            header={t('DR.RECOVERY_JOB_LIST')}
            content={<RecoveryJobList />}
        />
    );
};

export default RecoveryJobPage;
