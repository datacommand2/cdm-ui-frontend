import { Box, CardActions, CardContent, Divider, FormGroup } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { PATHNAME } from '../../../../../constant/pathname';
import { checkNamingRule } from '../../../../../libs/utils/regex';
import {
    openStackRecoveryPlanEditAtom,
    planInstancesAtom,
    recoveryClusterAtom,
} from '../../../../../recoil/atom/OpenShiftRecoveryPlanAtom';
import ActionButton from '../../../../component/common/Button/ActionButton';
import DisabledFormTextField from '../../../../component/common/TextField/DisabledFormTextField';
import FormTextField from '../../../../component/common/TextField/FormTextField';
import { useGetProtectionGroup, useGetRecoveryPlan } from '../common/hooks';

interface PlanInformationProps {
    setStep: (value: number) => void;
}

interface IForm {
    name: string;
    remarks?: string;
    snapshot_retention_count: number;
}

/**
 * 오픈스택 복구계획 정보를 수정하는 컴포넌트
 */
const EditPlanInformation = ({ setStep }: PlanInformationProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const planID = location.state?.planID;
    const groupID = location.state?.groupID;

    const recoveryPlanEdit = useRecoilValue(openStackRecoveryPlanEditAtom);
    const setRecoveryCluster = useSetRecoilState(recoveryClusterAtom);
    const setRecoveryPlanEdit = useSetRecoilState(openStackRecoveryPlanEditAtom);
    const setPlanInstances = useSetRecoilState(planInstancesAtom);

    // 복구계획을 조회하는 함수
    const { data: recoveryPlan } = useGetRecoveryPlan(groupID, planID);

    // 보호그룹을 조회하는 함수
    const { data: protectionGroupData } = useGetProtectionGroup(groupID);

    const { control, handleSubmit, resetField } = useForm<IForm>({
        defaultValues: {
            name: recoveryPlan.name,
            remarks: recoveryPlan?.remarks ?? '',
            snapshot_retention_count: recoveryPlan.snapshot_retention_count,
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<IForm> = data => {
        if (protectionGroupData.protection_cluster?.state_code === 'cluster.state.inactive') {
            toast.error('클러스터의 상태가 inactive 입니다.');
            return;
        }

        setRecoveryPlanEdit({
            ...recoveryPlanEdit,
            id: recoveryPlan.id,
            name: data.name,
            remarks: data?.remarks ?? '',
            snapshot_retention_count: data.snapshot_retention_count,
        });

        setStep(2);
    };

    // 받아온 복구계획의 데이터로 recoveryPlanEdit 데이터를 초기화한다.
    useEffect(() => {
        if (recoveryPlanEdit?.id === 0) {
            setRecoveryCluster({ value: recoveryPlan.recovery_cluster.id, label: recoveryPlan.recovery_cluster.name });
            setRecoveryPlanEdit({
                ...recoveryPlanEdit,
                protection_cluster: {
                    id: recoveryPlan.protection_cluster.id,
                },
                recovery_cluster: {
                    id: recoveryPlan.recovery_cluster.id,
                },
                id: recoveryPlan.id,
                name: recoveryPlan.name,
                remarks: recoveryPlan?.remarks ?? '',
                snapshot_retention_count: recoveryPlan.snapshot_retention_count,
                detail: recoveryPlan.detail,
            });
            const instances = recoveryPlan.detail.instances.reduce(
                (acc: any, instance: any) => {
                    const key = instance?.auto_start_flag ? 'operatedInstances' : 'nonOperatedInstances';
                    acc[key].push(instance.protection_cluster_instance);
                    return acc;
                },
                { operatedInstances: [], nonOperatedInstances: [] },
            );
            setPlanInstances(instances);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recoveryPlan]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
                <Wrapper>
                    <NameWrapper>
                        <Name>
                            <FormGroup>
                                <FormTextField<IForm>
                                    label={t('DR.RECOVERY_PLAN_NAME')}
                                    required={true}
                                    name="name"
                                    control={control}
                                    resetField={resetField}
                                    rules={{
                                        required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                        maxLength: { value: 50, message: t('DR.RP.ENTER_PLAN_NAME') },
                                        pattern: {
                                            value: checkNamingRule,
                                            message: t('FORM.VALIDATION.SPECIAL.CHARACTER'),
                                        },
                                    }}
                                />
                            </FormGroup>
                        </Name>
                    </NameWrapper>
                    <FormGroup>
                        <FormTextField<IForm>
                            label={t('DR.REMARK')}
                            name="remarks"
                            multiline
                            rows={3}
                            control={control}
                            resetField={resetField}
                            rules={{
                                maxLength: { value: 300, message: t('DR.RP.ENTER_300') },
                            }}
                        />
                    </FormGroup>
                    <GroupWrapper>
                        <Group>
                            <FormGroup>
                                <DisabledFormTextField
                                    label={t('DR.PROTECTION_GROUP')}
                                    name="protection_group"
                                    value={protectionGroupData?.name}
                                />
                            </FormGroup>
                        </Group>
                    </GroupWrapper>
                    <GroupWrapper>
                        <Group>
                            <FormGroup>
                                <DisabledFormTextField
                                    name="ori_cluster"
                                    label={t('DR.ORI_CLUSTER')}
                                    value={recoveryPlan?.protection_cluster?.name}
                                    state={recoveryPlan?.protection_cluster?.state_code}
                                />
                            </FormGroup>
                        </Group>
                        <Group>
                            <FormGroup>
                                <DisabledFormTextField
                                    label={t('DR.TYPE')}
                                    name="type"
                                    value={recoveryPlan && recoveryPlan?.protection_cluster?.type_code.split('.')[2]}
                                />
                            </FormGroup>
                        </Group>
                        <Group>
                            <FormGroup>
                                <DisabledFormTextField
                                    label={t('DR.OWNER_GROUP')}
                                    name="ownerGroup"
                                    value={recoveryPlan && recoveryPlan?.protection_cluster?.owner_group.name}
                                />
                            </FormGroup>
                        </Group>
                    </GroupWrapper>
                </Wrapper>
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <ActionButton
                    buttonType="cancel"
                    type="cancle"
                    onClick={() => {
                        navigate(PATHNAME.OPENSTACK_PLAN);
                    }}
                />
                <ActionButton buttonType="next" type="submit" />
            </CardActions>
        </form>
    );
};

export default EditPlanInformation;

const Wrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    padding-left: 1rem;
    padding-right: 1rem;
`;

const NameWrapper = styled(Grid2).attrs({ container: true, columnSpacing: 4 })`
    display: flex;
`;

const Name = styled(Grid2).attrs({ xs: 12, md: 6 })``;

const GroupWrapper = styled(Grid2).attrs({ container: true, columnSpacing: 4 })`
    padding-bottom: 1rem;
    display: flex;
`;

const Group = styled(Grid2).attrs({ xs: 12, md: 4 })``;
