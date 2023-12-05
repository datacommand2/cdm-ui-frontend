import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import AddRecoveryJob from '../../../modules/OpenStackDR/recoveryJob/add/AddRecoveryJob';
import DefaultSpinner from '@/app/component/common/Skeleton/DefaultSpinner';
import ContentLayout from '@/app/component/common/layout/ContentLayout';

/**
 * OpenStack 복구작업을 추가하는 페이지
 */
const RecoveryJobAddPage = () => {
    const { t } = useTranslation();
    return (
        <ContentLayout
            type="etc"
            header={t('DR.RECOVERY_JOB_ADD')}
            content={
                <Suspense fallback={<DefaultSpinner />}>
                    <AddRecoveryJob />
                </Suspense>
            }
        />
    );
};

export default RecoveryJobAddPage;
