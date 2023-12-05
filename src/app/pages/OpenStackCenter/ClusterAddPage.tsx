import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { ClusterAdd } from '../../modules/Center/add/ClusterAdd';
import DefaultSpinner from '../../component/common/Skeleton/DefaultSpinner';
import ContentLayout from '@/app/component/common/layout/ContentLayout';

/**
 * 클러스터를 추가하는 페이지
 */
const ClusterAddPage = () => {
    const { t } = useTranslation();
    return (
        <ContentLayout
            type="etc"
            header={t('DR.CLUSTER_ADD')}
            content={
                <Suspense fallback={<DefaultSpinner />}>
                    <ClusterAdd />
                </Suspense>
            }
            fullHeight={false}
        />
    );
};

export default ClusterAddPage;
