import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { ProtectionGroupEdit } from '../../../modules/OpenStackDR/recoveryPolicy/protectionGroup/edit/ProtectionGroupEdit';
import DefaultSpinner from '../../../component/common/Skeleton/DefaultSpinner';
import ContentLayout from '@/app/component/common/layout/ContentLayout';

/**
 * 보호그룹을 수정하는 페이지
 */
const ProtectionGroupEditPage = () => {
    const { t } = useTranslation();
    return (
        <ContentLayout
            type="etc"
            header={t('DR.RP.EDIT_PROTECTION')}
            content={
                <Suspense fallback={<DefaultSpinner />}>
                    <ProtectionGroupEdit />
                </Suspense>
            }
        />
    );
};

export default ProtectionGroupEditPage;
