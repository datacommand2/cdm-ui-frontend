import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import EditRecoveryJob from '../../../modules/OpenStackDR/recoveryJob/edit/EditRecoveryJob';
import DefaultSpinner from '@/app/component/common/Skeleton/DefaultSpinner';
import ContentLayout from '@/app/component/common/layout/ContentLayout';

/**
 * OpenStack 복구작업을 수정하는 페이지
 */
const RecoveryJobEditPage = () => {
    const { t } = useTranslation();
    return (
        <ContentLayout
            type="etc"
            header={t('DR.RECOVERY_JOB_MODIFY')}
            content={
                <Suspense fallback={<DefaultSpinner />}>
                    <EditRecoveryJob />
                </Suspense>
            }
        />
    );
};

export default RecoveryJobEditPage;
