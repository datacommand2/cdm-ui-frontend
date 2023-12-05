import ContentLayout from '@/app/component/common/layout/ContentLayout';
import { Card } from '@mui/material';
import React, { Suspense } from 'react';

import DefaultSpinner from '../../../component/common/Skeleton/DefaultSpinner';
import { UserProfile } from '../../../modules/Cloud/user/profile/UserProfile';

/**
 * 프로필 정보를 보여주는 페이지
 */
const ProfilePage = () => {
    return (
        <ContentLayout
            type="detail"
            content={
                <Suspense
                    fallback={
                        <Card variant="outlined">
                            <DefaultSpinner />
                        </Card>
                    }
                >
                    <UserProfile />
                </Suspense>
            }
        />
    );
};

export default ProfilePage;
