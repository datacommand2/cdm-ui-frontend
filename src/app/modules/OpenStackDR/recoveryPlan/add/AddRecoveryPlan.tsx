import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useResetRecoilState } from 'recoil';

import PlanInformation from './PlanInformation';
import OperationPlan from './OperationPlan';
import {
    clusterAvZoneKeys,
    clusterHypervisorKeys,
    clusterNetworkKeys,
    clusterVolumeTypeKeys,
    protectionGroupKeys,
} from '../../../../../libs/utils/queryKeys';
import CustomCardHeader from '../../../../component/common/CardHeader/CustomCardHeader';
import DefaultStepper from '../../../../component/common/Stepper/DefaultStepper';
import { OPENSTACK_STEP_TITLE } from '../../../../../constant/stepTitle';
import {
    edgesAtom,
    initFlagAtom,
    nodesAtom,
    openStackRecoveryPlanAddAtom,
    planInstancesAtom,
    selectedProtectionGroupAtom,
    templateEdgesAtom,
    templateNodesAtom,
} from '../../../../../recoil/atom/OpenShiftRecoveryPlanAtom';
import ResourceMapping from './ResourceMapping';
import InstanceMapping from './InstanceMapping';

/**
 * 오픈스택 복구계획을 추가하는 컴포넌트
 * 1. 복구계획 정보
 * 2. 인스턴스 기동계획
 * 3. 리소스 매핑
 * 4. 인스턴스 매핑
 */
const AddRecoveryPlan = () => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);

    const queryClient = useQueryClient();

    const resetSelectedProtectionGroup = useResetRecoilState(selectedProtectionGroupAtom);
    const resetRecocveryPlanAdd = useResetRecoilState(openStackRecoveryPlanAddAtom);
    const resetNodes = useResetRecoilState(nodesAtom);
    const resetEdges = useResetRecoilState(edgesAtom);
    const resetTemplateNodes = useResetRecoilState(templateNodesAtom);
    const resetTemplateEdges = useResetRecoilState(templateEdgesAtom);
    const resetPlanInstances = useResetRecoilState(planInstancesAtom);
    const resetInitFlag = useResetRecoilState(initFlagAtom);

    // TODO: recoil reset 정리
    useEffect(() => {
        return () => {
            queryClient.removeQueries(protectionGroupKeys.all);
            queryClient.removeQueries(clusterAvZoneKeys.all);
            queryClient.removeQueries(clusterHypervisorKeys.all);
            queryClient.removeQueries(clusterNetworkKeys.all);
            queryClient.removeQueries(clusterVolumeTypeKeys.all);

            resetTemplateNodes();
            resetTemplateEdges();
            resetSelectedProtectionGroup();
            resetRecocveryPlanAdd();
            resetNodes();
            resetEdges();
            resetPlanInstances();
            resetInitFlag();
        };
    }, [
        queryClient,
        resetEdges,
        resetInitFlag,
        resetNodes,
        resetPlanInstances,
        resetRecocveryPlanAdd,
        resetSelectedProtectionGroup,
        resetTemplateEdges,
        resetTemplateNodes,
    ]);

    return (
        <>
            <CustomCardHeader
                title={`${t('DR.RP.PLAN_ADD')} - ${OPENSTACK_STEP_TITLE[step]}`}
                headerAction={<DefaultStepper step={step - 1} stepLength={4} />}
            />
            {step === 1 && <PlanInformation setStep={setStep} />}
            {step === 2 && <OperationPlan setStep={setStep} />}
            {step === 3 && <ResourceMapping setStep={setStep} />}
            {step === 4 && <InstanceMapping setStep={setStep} />}
        </>
    );
};

export default AddRecoveryPlan;
