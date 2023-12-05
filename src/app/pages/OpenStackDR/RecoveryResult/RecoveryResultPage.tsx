import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import ContentLayout from '@/app/component/common/layout/ContentLayout';
import TreeListSkeleton from '@/app/component/common/Skeleton/TreeListSkeleton';
import { OpenStackHistorySideBar } from '@/app/modules/OpenStackDR/common/components';
import RecoveryResultList from '@/app/modules/OpenStackDR/recoveryResult/list/RecoveryResultList';

/**
 * OpenStack 복구결과 목록을 보여주는 페이지
 */
const RecoveryResultPage = () => {
    const { t } = useTranslation();

    return (
        <ContentLayout
            type="list"
            treeHeader={t('DR.PROTECTION_GROUP')}
            tree={
                <Suspense fallback={<TreeListSkeleton />}>
                    <OpenStackHistorySideBar />
                </Suspense>
            }
            header={t('DR.RECOVERY_RESULT_LIST')}
            content={<RecoveryResultList />}
        />
    );
};

export default RecoveryResultPage;
