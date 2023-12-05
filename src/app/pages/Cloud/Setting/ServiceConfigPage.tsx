import React, { Suspense } from 'react';

import { SkeletonTable, ServiceConfig } from '@modules/Cloud/admin/serviceConfig/ServiceConfig';
import ContentLayout from '@/app/component/common/layout/ContentLayout';

/**
 * service config 페이지
 */
const ServiceConfigPage = () => {
    return (
        <ContentLayout
            type="etc"
            header="서비스 설정"
            content={
                <Suspense fallback={<SkeletonTable />}>
                    <ServiceConfig />
                </Suspense>
            }
        />
    );
};

export default ServiceConfigPage;
