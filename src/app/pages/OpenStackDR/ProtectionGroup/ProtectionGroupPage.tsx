import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import ContentLayout from '@/app/component/common/layout/ContentLayout';
import TreeListSkeleton from '@/app/component/common/Skeleton/TreeListSkeleton';
import ProtectionGroupList from '@/app/modules/OpenStackDR/recoveryPolicy/protectionGroup/list/ProtectionGroupList';
import { OpenStackProtectionGroupSideBar } from '@/app/modules/OpenStackDR/common/components';

/**
 * OpenStack 보호그룹 목록을 보여주는 페이지
 */
const ProtectionGroupPage = () => {
    const { t } = useTranslation();

    return (
        <ContentLayout
            type="list"
            treeHeader={t('DR.PROTECTION_GROUP')}
            tree={
                <Suspense fallback={<TreeListSkeleton />}>
                    <OpenStackProtectionGroupSideBar />
                </Suspense>
            }
            header={t('DR.PROTECTION_GROUP_LIST')}
            content={<ProtectionGroupList />}
        />
    );
};

export default ProtectionGroupPage;
