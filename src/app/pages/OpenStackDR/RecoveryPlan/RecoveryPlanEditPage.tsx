import React from 'react';

import ContentLayout from '@/app/component/common/layout/ContentLayout';
import EditRecoveryPlan from '../../../modules/OpenStackDR/recoveryPlan/edit/EditRecoveryPlan';

/**
 * OpenStack 복구계획 수정하는 페이지
 */
const RecoveryPlanEditPage = () => {
    return <ContentLayout type="etc" content={<EditRecoveryPlan />} />;
};

export default RecoveryPlanEditPage;
