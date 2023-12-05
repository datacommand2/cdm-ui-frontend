import React from 'react';
import { useTranslation } from 'react-i18next';

import UserAccountList from '@modules/Cloud/admin/user/userAccount/UserAccountList';
import ContentLayout from '@/app/component/common/layout/ContentLayout';

/**
 * 사용자 목록을 불러오는 페이지
 */
const UserPage = () => {
    const { t } = useTranslation();
    return <ContentLayout type="list" header={t('CLOUD.USER.ACCOUNT.USER_LIST')} content={<UserAccountList />} />;
};

export default UserPage;
