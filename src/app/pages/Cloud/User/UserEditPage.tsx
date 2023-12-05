import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import EditUserAccount from '@modules/Cloud/admin/user/userAccount/EditUserAccount';
import DefaultSpinner from '@component/common/Skeleton/DefaultSpinner';
import ContentLayout from '@/app/component/common/layout/ContentLayout';

/**
 * 사용자 정보를 수정하는 페이지
 */
const UserEditPage = () => {
    const { t } = useTranslation();
    return (
        <ContentLayout
            type="etc"
            header={t('CLOUD.USER.ACCOUNT.EDIT_ACCOUNT')}
            content={
                <Suspense fallback={<DefaultSpinner />}>
                    <EditUserAccount />
                </Suspense>
            }
            fullHeight={false}
        />
    );
};

export default UserEditPage;
