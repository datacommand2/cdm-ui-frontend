import ContentLayout from '@/app/component/common/layout/ContentLayout';
import React, { Suspense } from 'react';

import DefaultSpinner from '../../../component/common/Skeleton/DefaultSpinner';
import RecoveryResultDetail from '../../../modules/OpenStackDR/recoveryResult/detail/RecoveryResultDetail';

/**
 * OpenStack 복구결과 상세 화면을 보여주는 페이지
 */
const RecoveryResultDetailPage = () => {
    return (
        <ContentLayout
            type="etc"
            content={
                <Suspense fallback={<DefaultSpinner />}>
                    <RecoveryResultDetail />
                </Suspense>
            }
        />
    );
};

export default RecoveryResultDetailPage;
