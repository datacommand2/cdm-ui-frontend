import { Box, CardActions, CardContent, Divider, FormGroup, Typography, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { PATHNAME } from '../../../../../constant/pathname';

import {
    openStackRecoveryPlanAddAtom,
    recoveryClusterAtom,
    recoveryClustersAtom,
} from '../../../../../recoil/atom/OpenShiftRecoveryPlanAtom';
import ActionButton from '../../../../component/common/Button/ActionButton';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../component/common/Dialog/DialogText';
import DefaultSelect from '../../../../component/common/Select/DefaultSelect';
import DisabledFormTextField from '../../../../component/common/TextField/DisabledFormTextField';
import { AvZone, Network, Tenant, Volume } from '../common/components';

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

type ClusterOptions = {
    label: string;
    value: number;
    cluster_state?: string;
};

interface ResourceMappingProps {
    setStep: any;
}

/**
 * 오픈스택 복구계획 리소스 매핑하는 컴포넌트
 */
const ResourceMapping = ({ setStep }: ResourceMappingProps) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [resetModal, setResetModal] = useState(false);

    const recoveryPlanAdd = useRecoilValue(openStackRecoveryPlanAddAtom);
    const recoveryClusters = useRecoilValue(recoveryClustersAtom);
    const recoveryCluster = useRecoilValue(recoveryClusterAtom);
    const setRecoveryCluster = useSetRecoilState(recoveryClusterAtom);
    const setRecoveryPlanAdd = useSetRecoilState(openStackRecoveryPlanAddAtom);

    const [selectedRecoveryCluster, setSelectedRecoveryCluster] = useState(recoveryCluster);
    const recoveryClusterOption = recoveryClusters.map(v => {
        return { value: v.id, label: v.name, cluster_state: v.state_code };
    });

    const recoveryClusterDetail = recoveryClusters.filter(cluster => cluster.id === recoveryCluster.value)[0];

    const { control, handleSubmit, resetField, reset, getValues } = useForm<IForm>({
        defaultValues: {
            recovery_cluster: {
                id: recoveryPlanAdd.recovery_cluster.id,
            },
            detail: recoveryPlanAdd.detail,
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<IForm> = data => {
        if (
            recoveryClusters.filter(cluster => cluster.id === recoveryCluster.value)[0].state_code ===
            'cluster.state.inactive'
        ) {
            toast.error('클러스터의 상태가 inactive 입니다.');
        } else {
            storeRecoveryResource(data);
            setStep(4);
        }
    };

    /**
     * 이전, 다음스텝으로 갈 때 상태저장
     */
    const storeRecoveryResource = (values: IForm) => {
        setRecoveryPlanAdd({
            ...recoveryPlanAdd,
            recovery_cluster: {
                id: values.recovery_cluster.id,
            },
            detail: {
                ...recoveryPlanAdd.detail,
                tenants: values.detail.tenants,
                availability_zones: values.detail.availability_zones,
                storages: values.detail.storages,
                external_networks: values.detail.external_networks,
            },
        });
    };
    const onChangeRecoveryCluster = (e: ClusterOptions) => {
        const selectedCluster = recoveryClusters.filter(cluster => cluster.id === e.value)[0];
        setRecoveryCluster({
            value: selectedCluster.id,
            label: selectedCluster.name,
            state_code: selectedCluster.state_code,
        });
        reset({
            detail: {
                external_networks: recoveryPlanAdd.detail.tenants.map(tenant => {
                    return {
                        ...tenant,
                        recovery_cluster_tenant_mirror_name: '',
                    };
                }),
            },
        });
        setRecoveryPlanAdd({
            ...recoveryPlanAdd,
            recovery_cluster: {
                id: selectedCluster.id,
            },
            detail: {
                ...recoveryPlanAdd.detail,
                availability_zones: recoveryPlanAdd.detail.availability_zones.map(avzone => {
                    return {
                        ...avzone,
                        recovery_cluster_availability_zone: {
                            id: 0,
                        },
                    };
                }),
                storages: recoveryPlanAdd.detail.storages.map(storage => {
                    return {
                        ...storage,
                        recovery_cluster_storage: {
                            id: 0,
                        },
                    };
                }),
                external_networks: recoveryPlanAdd.detail.external_networks.map(network => {
                    return {
                        ...network,
                        recovery_cluster_external_network: {
                            id: 0,
                        },
                    };
                }),
                instances: recoveryPlanAdd.detail.instances.map(instance => {
                    return {
                        ...instance,
                        recovery_cluster_hypervisor: {
                            id: 0,
                        },
                    };
                }),
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
                                    <Controller
                                        control={control}
                                        name="recovery_cluster.id"
                                        render={({ field }) => {
                                            return (
                                                <DefaultSelect
                                                    {...field}
                                                    options={recoveryClusterOption}
                                                    onChange={(e: ClusterOptions) => {
                                                        setSelectedRecoveryCluster(e);
                                                        setResetModal(true);
                                                    }}
                                                    label={t('DR.RECOVERY_TARGET_CLUSTER')}
                                                    value={
                                                        recoveryClusterOption.filter(option => {
                                                            return option.value === recoveryCluster.value;
                                                        })[0]
                                                    }
                                                />
                                            );
                                        }}
                                    />
                                </FormGroup>
                            </Info>
                            <Info>
                                <FormGroup>
                                    <DisabledFormTextField
                                        label={t('DR.TYPE')}
                                        name="type"
                                        value={recoveryClusterDetail.type_code.split('.')[2]}
                                    />
                                </FormGroup>
                            </Info>
                            <Info>
                                <FormGroup>
                                    <DisabledFormTextField
                                        label={t('DR.OWNER_GROUP')}
                                        name="type"
                                        value={recoveryClusterDetail.owner_group.name}
                                    />
                                </FormGroup>
                            </Info>
                        </ClusterWrapper>
                    </ResourceWrapper>
                    <Tenant control={control} resetField={resetField} />
                    <AvZone control={control} type="add" />
                    <Volume control={control} type="add" />
                    <Network control={control} type="add" />
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
            {resetModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={resetModal}
                    title={t('DR.RP.CLUSTER_CHANGE')}
                    onClose={() => {
                        setResetModal(false);
                    }}
                    onConfirm={() => {
                        onChangeRecoveryCluster(selectedRecoveryCluster);
                        setResetModal(false);
                    }}
                    actionType="confirm"
                    buttonColor="warning"
                >
                    <DialogText title={recoveryCluster.label} body={t('DR.RP.PLAN_ADD_STORY')} />
                </DefaultDialog>
            )}
        </form>
    );
};

export default ResourceMapping;

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
