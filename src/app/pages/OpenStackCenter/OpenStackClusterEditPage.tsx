import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import DefaultSpinner from '../../component/common/Skeleton/DefaultSpinner';
import ClusterEdit from '../../modules/OpenStackCenter/edit/ClusterEdit';
import ContentLayout from '@/app/component/common/layout/ContentLayout';

/**
 * 클러스터를 수정하는 페이지
 */
const OpenStackClusterEditPage = () => {
    const { t } = useTranslation();
    return (
        <ContentLayout
            type="etc"
            header={t('DR.CLUSTER_MODIFY')}
            content={
                <Suspense fallback={<DefaultSpinner />}>
                    <ClusterEdit />
                </Suspense>
            }
            fullHeight={false}
        />
    );
};

export default OpenStackClusterEditPage;
