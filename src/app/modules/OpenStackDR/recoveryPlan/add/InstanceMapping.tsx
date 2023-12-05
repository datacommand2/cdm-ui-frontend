import { CardActions, CardContent, Divider } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { _addRecoveryPlan } from '../../../../../api/dr/recoveryPlan';
import { PATHNAME } from '../../../../../constant/pathname';

import { recoveryPlanKeys } from '../../../../../libs/utils/queryKeys';
import {
    openStackRecoveryPlanAddAtom,
    selectedProtectionGroupAtom,
} from '../../../../../recoil/atom/OpenShiftRecoveryPlanAtom';
import ActionButton from '../../../../component/common/Button/ActionButton';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../component/common/Dialog/DialogText';
import { Hypervisor } from '../common/components';
import { storeVolumes } from '../common/utils';

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

interface InstanceMappingProps {
    setStep: any;
}

const InstanceMapping = ({ setStep }: InstanceMappingProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    // 복구계획을 추가하는 함수
    const recoveryPlanAdd = useRecoilValue(openStackRecoveryPlanAddAtom);
    const setRecoveryPlanAdd = useSetRecoilState(openStackRecoveryPlanAddAtom);
    const selectedProtectionGroup = useRecoilValue(selectedProtectionGroupAtom);
    const [addModal, setAddModal] = useState(false);

    const { control, handleSubmit, getValues } = useForm<IForm>({
        defaultValues: {
            detail: recoveryPlanAdd.detail,
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<IForm> = data => {
        if (
            data.detail.instances.find(
                instance =>
                    instance.protection_cluster_instance.hypervisor.state === 'down' ||
                    instance.protection_cluster_instance.hypervisor.status === 'disabled',
            )
        ) {
            toast.error(`인스턴스의 state와 status를 확인해주세요.`);
        } else {
            storeHypervisorResource(data);
            setAddModal(true);
        }
    };

    const storeHypervisorResource = (values: IForm) => {
        setRecoveryPlanAdd({
            ...recoveryPlanAdd,
            detail: {
                ...recoveryPlanAdd.detail,
                instances: values.detail.instances,
            },
        });
    };

    const { isLoading: addLoading, mutate: addRecoveryPlan } = useMutation(
        (payload: any) =>
            _addRecoveryPlan(selectedProtectionGroup.value, {
                plan: payload,
            }),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    toast.success(t('DR.RP.SUCCESS_ADD_PLAN'));
                    navigate(PATHNAME.OPENSTACK_PLAN);
                    queryClient.invalidateQueries(recoveryPlanKeys.all);
                }
                setAddModal(false);
            },
        },
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
                <Hypervisor control={control} />
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <ActionButton
                    buttonType="cancel"
                    onClick={() => {
                        navigate(PATHNAME.OPENSTACK_PLAN);
                    }}
                />
                <ActionButton
                    buttonType="prev"
                    onClick={() => {
                        storeHypervisorResource(getValues());
                        setStep(3);
                    }}
                />
                <ActionButton buttonType="add" type="submit" />
            </CardActions>
            {addModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={addModal}
                    title={t('DR.RP.PLAN_ADD')}
                    onClose={() => {
                        setAddModal(false);
                    }}
                    onConfirm={() => {
                        // volumes 데이터 집어넣는 함수
                        // 필요없는 데이터를 제거해서 payload를 구성한다.
                        // => PlanInformation 컴포넌트에서 데이터를 저장할 때, name, desc 같은 정보도 같이 저장했기 때문에
                        // => "보호 클러스터 테넌트의 이름" 같은 정보는 payload에는 포함되어 있지 않음
                        const recoveryPlan = {
                            ...recoveryPlanAdd,
                            detail: {
                                ...recoveryPlanAdd.detail,
                                tenants: recoveryPlanAdd.detail.tenants.map(tenant => {
                                    return {
                                        recovery_type_code: tenant.recovery_type_code,
                                        protection_cluster_tenant: {
                                            id: tenant.protection_cluster_tenant.id,
                                        },
                                        recovery_cluster_tenant_mirror_name: tenant.recovery_cluster_tenant_mirror_name,
                                    };
                                }),
                                availability_zones: recoveryPlanAdd.detail.availability_zones.map(avzone => {
                                    return {
                                        recovery_type_code: avzone.recovery_type_code,
                                        protection_cluster_availability_zone: {
                                            id: avzone.protection_cluster_availability_zone.id,
                                        },
                                        recovery_cluster_availability_zone: {
                                            id: avzone.recovery_cluster_availability_zone.id,
                                        },
                                    };
                                }),
                                external_networks: recoveryPlanAdd.detail.external_networks.map(network => {
                                    return {
                                        recovery_type_code: network.recovery_type_code,
                                        protection_cluster_external_network: {
                                            id: network.protection_cluster_external_network.id,
                                        },
                                        recovery_cluster_external_network: {
                                            id: network.recovery_cluster_external_network.id,
                                        },
                                    };
                                }),
                                storages: recoveryPlanAdd.detail.storages.map(storage => {
                                    return {
                                        recovery_type_code: storage.recovery_type_code,
                                        protection_cluster_storage: {
                                            id: storage.protection_cluster_storage.id,
                                        },
                                        recovery_cluster_storage: {
                                            id: storage.recovery_cluster_storage.id,
                                        },
                                    };
                                }),
                                volumes: storeVolumes(recoveryPlanAdd.detail),
                                instances: recoveryPlanAdd.detail.instances.map(instance => {
                                    return {
                                        recovery_type_code: instance.recovery_type_code,
                                        protection_cluster_instance: {
                                            id: instance.protection_cluster_instance.id,
                                        },
                                        recovery_cluster_availability_zone: {
                                            id: instance.recovery_cluster_availability_zone.id,
                                        },
                                        recovery_cluster_hypervisor: {
                                            id: instance.recovery_cluster_hypervisor.id,
                                        },
                                        auto_start_flag: instance.auto_start_flag,
                                        dependencies: instance.dependencies ?? [],
                                    };
                                }),
                            },
                        };

                        addRecoveryPlan(recoveryPlan);
                    }}
                    isLoading={addLoading}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    <DialogText title={recoveryPlanAdd.name} body={t('DR.RP.WANNA_ADD_PLAN')} />
                </DefaultDialog>
            )}
        </form>
    );
};

export default InstanceMapping;
