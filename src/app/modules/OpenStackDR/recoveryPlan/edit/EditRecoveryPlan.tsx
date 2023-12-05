import React, { Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useResetRecoilState } from 'recoil';

import {
    clusterAvZoneKeys,
    clusterHypervisorKeys,
    clusterNetworkKeys,
    clusterVolumeTypeKeys,
    protectionGroupKeys,
    recoveryPlanKeys,
} from '../../../../../libs/utils/queryKeys';
import CustomCardHeader from '../../../../component/common/CardHeader/CustomCardHeader';
import DefaultStepper from '../../../../component/common/Stepper/DefaultStepper';
import { OPENSTACK_STEP_TITLE } from '../../../../../constant/stepTitle';
import DefaultSpinner from '../../../../component/common/Skeleton/DefaultSpinner';
import {
    edgesAtom,
    nodesAtom,
    openStackRecoveryPlanEditAtom,
    planInstancesAtom,
    templateEdgesAtom,
    templateNodesAtom,
} from '../../../../../recoil/atom/OpenShiftRecoveryPlanAtom';
import EditPlanInformation from './EditPlanInformation';
import EditOperationPlan from './EditOperationPlan';
import EditResourceMapping from './EditResourceMapping';
import EditInstanceMapping from './EditInstanceMapping';

/**
 * 만들어진 복구계획을 수정하는 컴포넌트
 */
const EditRecoveryPlan = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [step, setStep] = useState(1);

    const queryClient = useQueryClient();
    const resetRecocveryPlanEdit = useResetRecoilState(openStackRecoveryPlanEditAtom);
    const resetNodes = useResetRecoilState(nodesAtom);
    const resetEdges = useResetRecoilState(edgesAtom);
    const resetTemplateNodes = useResetRecoilState(templateNodesAtom);
    const resetTemplateEdges = useResetRecoilState(templateEdgesAtom);
    const resetPlanInstances = useResetRecoilState(planInstancesAtom);

    useEffect(() => {
        return () => {
            queryClient.removeQueries(protectionGroupKeys.all);
            queryClient.removeQueries(recoveryPlanKeys.all);
            queryClient.removeQueries(clusterAvZoneKeys.all);
            queryClient.removeQueries(clusterHypervisorKeys.all);
            queryClient.removeQueries(clusterNetworkKeys.all);
            queryClient.removeQueries(clusterVolumeTypeKeys.all);
            resetTemplateNodes();
            resetTemplateEdges();
            resetNodes();
            resetEdges();
            resetPlanInstances();
            resetRecocveryPlanEdit();
        };
    }, [
        queryClient,
        resetEdges,
        resetNodes,
        resetPlanInstances,
        resetRecocveryPlanEdit,
        resetTemplateEdges,
        resetTemplateNodes,
    ]);

    useEffect(() => {
        if (location?.state?.updatable === false) {
            toast.warn('해당 복구계획으로 생성된 복구작업이 실행 중입니다.');
        }
    }, [location]);

    return (
        <>
            <CustomCardHeader
                title={`${t('DR.RP.PLAN_EDIT')} - ${OPENSTACK_STEP_TITLE[step]}`}
                headerAction={<DefaultStepper step={step - 1} stepLength={4} />}
            />
            {step === 1 && (
                <Suspense fallback={<DefaultSpinner />}>
                    <EditPlanInformation setStep={setStep} />
                </Suspense>
            )}
            {step === 2 && <EditOperationPlan setStep={setStep} />}
            {step === 3 && <EditResourceMapping setStep={setStep} />}
            {step === 4 && <EditInstanceMapping setStep={setStep} />}
        </>
    );
};

export default EditRecoveryPlan;
