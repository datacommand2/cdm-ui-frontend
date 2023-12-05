import { Box, CardActions, CardContent, Divider, FormGroup, Typography, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { PATHNAME } from '../../../../../constant/pathname';
import { openStackRecoveryPlanEditAtom } from '../../../../../recoil/atom/OpenShiftRecoveryPlanAtom';
import ActionButton from '../../../../component/common/Button/ActionButton';
import DisabledFormTextField from '../../../../component/common/TextField/DisabledFormTextField';
import { AvZone, Network, Tenant, Volume } from '../common/components';
import { useGetRecoveryPlan } from '../common/hooks';

interface ResourceMappingProps {
    setStep: any;
}

interface IForm {
    recovery_cluster: {
        id: number;
    };
    detail: {
        tenants: any[];
        availability_zones: any[];
        external_networks: any[];
        storages: any[];
        instances: any[];
    };
}

/**
 * 오픈스택 복구계획 리소스 매핑하는 컴포넌트
 */
const EditResourceMapping = ({ setStep }: ResourceMappingProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const planID = location.state?.planID;
    const groupID = location.state?.groupID;

    const recoveryPlanEdit = useRecoilValue(openStackRecoveryPlanEditAtom);
    const setRecoveryPlanEdit = useSetRecoilState(openStackRecoveryPlanEditAtom);

    // 복구계획을 조회하는 함수
    const { data: recoveryPlan } = useGetRecoveryPlan(groupID, planID);

    const { control, handleSubmit, resetField, getValues } = useForm<IForm>({
        defaultValues: {
            detail: {
                tenants: recoveryPlanEdit.detail.tenants,
                availability_zones: recoveryPlanEdit.detail.availability_zones,
                storages: recoveryPlanEdit.detail.storages,
                external_networks: recoveryPlanEdit.detail.external_networks,
            },
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<IForm> = data => {
        storeRecoveryResource(data);
        setStep(4);
    };

    /**
     * 이전, 다음스텝으로 갈 때 상태저장
     */
    const storeRecoveryResource = (values: IForm) => {
        setRecoveryPlanEdit({
            ...recoveryPlanEdit,
            detail: {
                ...recoveryPlanEdit.detail,
                tenants: values.detail.tenants,
                availability_zones: values.detail.availability_zones,
                storages: values.detail.storages,
                external_networks: values.detail.external_networks,
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
                <Wrapper>
                    <Title>{t('DR.CLUSTER')}</Title>
                    <ResourceWrapper sx={{ border: `1px solid ${theme.palette.divider}` }}>
                        <ClusterWrapper>
                            <Info>
                                <FormGroup>
                                    <DisabledFormTextField
                                        label={t('DR.RECOVERY_TARGET_CLUSTER')}
                                        name="type"
                                        value={recoveryPlan.recovery_cluster.name}
                                        state={recoveryPlan.recovery_cluster.state_code}
                                    />
                                </FormGroup>
                            </Info>
                            <Info>
                                <FormGroup>
                                    <DisabledFormTextField
                                        label={t('DR.TYPE')}
                                        name="type"
                                        value={recoveryPlan.recovery_cluster.type_code.split('.')[2]}
                                    />
                                </FormGroup>
                            </Info>
                            <Info>
                                <FormGroup>
                                    <DisabledFormTextField
                                        label={t('DR.OWNER_GROUP')}
                                        name="type"
                                        value={recoveryPlan.recovery_cluster.owner_group.name}
                                    />
                                </FormGroup>
                            </Info>
                        </ClusterWrapper>
                    </ResourceWrapper>
                    <Tenant control={control} resetField={resetField} />
                    <AvZone control={control} type="edit" />
                    <Volume control={control} type="edit" />
                    <Network control={control} type="edit" />
                </Wrapper>
            </CardContent>
            <Divider />
            <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ActionButton
                    buttonType="cancel"
                    onClick={() => {
                        navigate(PATHNAME.OPENSTACK_PLAN);
                    }}
                />
                <ActionButton
                    buttonType="prev"
                    onClick={() => {
                        storeRecoveryResource(getValues());
                        setStep(2);
                    }}
                />
                <ActionButton buttonType="next" type="submit" />
            </CardActions>
        </form>
    );
};

export default EditResourceMapping;

const Wrapper = styled(Box)`
    padding-left: 2rem;
    padding-right: 2rem;
`;

const Title = styled(Typography).attrs({ variant: 'h6' })`
    font-weight: 700;
    margin-bottom: 1rem;
`;

const ResourceWrapper = styled(Box)`
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 2rem;
`;

const ClusterWrapper = styled(Grid2).attrs({ container: true, columnSpacing: 8 })`
    display: flex;
`;
const Info = styled(Grid2).attrs({ xs: 12, md: 4 })``;
