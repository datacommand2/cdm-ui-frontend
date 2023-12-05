import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import AddUserAccount from '@modules/Cloud/admin/user/userAccount/AddUserAccount';
import DefaultSpinner from '@component/common/Skeleton/DefaultSpinner';
import ContentLayout from '@/app/component/common/layout/ContentLayout';

/**
 * 사용자를 추가하는 페이지
 */
const UserAddPage = () => {
    const { t } = useTranslation();
    return (
        <ContentLayout
            type="etc"
            header={t('CLOUD.USER.ACCOUNT.ADD_ACCOUNT')}
            content={
                <Suspense fallback={<DefaultSpinner />}>
                    <AddUserAccount />
                </Suspense>
            }
            fullHeight={false}
        />
    );
};

export default UserAddPage;
