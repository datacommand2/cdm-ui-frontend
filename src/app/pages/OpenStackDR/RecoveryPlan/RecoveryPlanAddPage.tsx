import React from 'react';

import ContentLayout from '@/app/component/common/layout/ContentLayout';
import AddRecoveryPlan from '../../../modules/OpenStackDR/recoveryPlan/add/AddRecoveryPlan';

/**
 * 오픈스택 복구계획 추가하는 페이지
 */
const RecoveryPlanAddPage = () => {
    return <ContentLayout type="etc" content={<AddRecoveryPlan />} />;
};

export default RecoveryPlanAddPage;
