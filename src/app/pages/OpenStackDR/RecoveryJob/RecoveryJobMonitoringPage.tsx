import React, { Suspense } from 'react';

import RecoveryJobMonitoring from '../../../modules/OpenStackDR/recoveryJob/monitoring/RecoveryJobMonitoring';
import DefaultSpinner from '@/app/component/common/Skeleton/DefaultSpinner';
import ContentLayout from '@/app/component/common/layout/ContentLayout';

/**
 * OpenStack 복구작업 모니터링 페이지
 */
const RecoveryJobMonitoringPage = () => {
    return (
        <ContentLayout
            type="etc"
            content={
                <Suspense fallback={<DefaultSpinner />}>
                    <RecoveryJobMonitoring />
                </Suspense>
            }
        />
    );
};

export default RecoveryJobMonitoringPage;
