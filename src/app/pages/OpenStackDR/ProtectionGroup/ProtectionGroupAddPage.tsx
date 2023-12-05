import React from 'react';
import { useTranslation } from 'react-i18next';

import { ProtectionGroupAdd } from '../../../modules/OpenStackDR/recoveryPolicy/protectionGroup/add/ProtectionGroupAdd';
import ContentLayout from '@/app/component/common/layout/ContentLayout';

/**
 * OpenStack 보호그룹 추가 페이지
 */
const ProtectionGroupAddPage = () => {
    const { t } = useTranslation();
    return <ContentLayout type="etc" header={t('DR.PROTECTION_GROUP_ADD')} content={<ProtectionGroupAdd />} />;
};

export default ProtectionGroupAddPage;
