import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { Box, CardActions, CardContent, Divider, FormGroup } from '@mui/material';
import styled from 'styled-components';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useTranslation } from 'react-i18next';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { SubmitHandler, useForm } from 'react-hook-form';

import { _getProtectionGroup, _getProtectionGroupDetail } from '../../../../../api/dr/protectionGroup';
import ActionButton from '../../../../component/common/Button/ActionButton';
import { checkNamingRule } from '../../../../../libs/utils/regex';
import { _getClusterList } from '../../../../../api/center/cluster';
import { clusterKeys, protectionGroupKeys } from '../../../../../libs/utils/queryKeys';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../component/common/Dialog/DialogText';
import DefaultSelect from '../../../../component/common/Select/DefaultSelect';
import {
    initFlagAtom,
    openStackRecoveryPlanAddAtom,
    planInstancesAtom,
    protectionClusterAtom,
    recoveryClusterAtom,
    recoveryClustersAtom,
    selectedProtectionGroupAtom,
} from '../../../../../recoil/atom/OpenShiftRecoveryPlanAtom';
import FormTextField from '../../../../component/common/TextField/FormTextField';
import { OptionType } from '../../../../../@types';
import DisabledFormTextField from '../../../../component/common/TextField/DisabledFormTextField';
import DefaultSpinner from '../../../../component/common/Skeleton/DefaultSpinner';

interface PlanInformationProps {
    setStep: (value: number) => void;
}

interface IForm {
    name: string;
    remarks?: string;
    snapshot_retention_count: number;
}
/**
 * 복구계획 정보를 입력하고 저장하는 컴포넌트
 * 보호그룹 상세 정보를 받아와서 리소스 매핑에 필요한 '원본' 클러스터 정보들을 저장
 * 보호그룹이 바뀔 때마다 정보 새롭게 저장한다.
 * 복구 클러스터 리스트도 저장
 * 복구 클러스터리스트의 첫 번째 클러스터로 매핑에 필요한 '복구' 클러스터 정보를 저장한다
 */
const PlanInformation = ({ setStep }: PlanInformationProps) => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const selectedProtectionGroup = useRecoilValue(selectedProtectionGroupAtom);
    const setSelectedProtectionGroup = useSetRecoilState(selectedProtectionGroupAtom);
    const setProtectionCluster = useSetRecoilState(protectionClusterAtom);
    const setRecoveryClusters = useSetRecoilState(recoveryClustersAtom);
    const setRecoveryCluster = useSetRecoilState(recoveryClusterAtom);
    const setInitFlag = useSetRecoilState(initFlagAtom);
    const initFlag = useRecoilValue(initFlagAtom);
    const setRecoveryPlanAdd = useSetRecoilState(openStackRecoveryPlanAddAtom);
    const recoveryPlanAdd = useRecoilValue(openStackRecoveryPlanAddAtom);
    const setPlanInstances = useSetRecoilState(planInstancesAtom);

    const [modal, setModalState] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<OptionType>({ value: 'default', label: '보호그룹' });

    // 보호그룹 목록을 불러오는 함수
    const { data: protectionGroups } = useQuery(protectionGroupKeys.all, () => _getProtectionGroup(), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                return data.groups;
            } else if (status === 204) {
                return [];
            }
        },
    });

    const ProtectionGroupOptions: {
        value: string;
        label: string;
    }[] = useMemo(
        () =>
            protectionGroups
                ? protectionGroups?.map((group: any) => {
                      return { value: group.id, label: group.name };
                  })
                : [{ value: '', label: '보호그룹이 존재하지 않습니다. ' }],
        [protectionGroups],
    );

    // 초기 보호그룹 설정
    useEffect(() => {
        if (protectionGroups) {
            // 선택된 보호그룹이 존재하지 않을 때
            if (selectedProtectionGroup.value === 'default') {
                const protectionGroup = protectionGroups.filter((group: any) => group.id === location.state.groupID)[0];
                setSelectedProtectionGroup({
                    value: protectionGroup.id,
                    label: protectionGroup.name,
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [protectionGroups]);

    // 보호그룹 상세 정보를 받아와서 원본 네트워크, 스토리지, 볼륨, 테넌트, 가용구역 정보를 저장한다.
    const { data: protectionGroupData, isLoading: protectionGroupLoading } = useQuery(
        protectionGroupKeys.detail(selectedProtectionGroup.value),
        () => _getProtectionGroupDetail(selectedProtectionGroup.value),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.group;
                }
            },
            enabled: selectedProtectionGroup.value !== 'default',
        },
    );

    // 보호그룹의 인스턴스가 존재하지 않으면 toast로 경고 메세지를 띄워준다.
    useEffect(() => {
        if (protectionGroupData) {
            setProtectionCluster(protectionGroupData.protection_cluster);
            if (!protectionGroupData?.instances) {
                toast.warn(t('DR.INSTANCE.NOT_EXIST_IN_GROUP'));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [protectionGroupData, setRecoveryPlanAdd, t]);

    // 클러스터 리스트를 불러오는 함수 => useEffect로 recovery 클러스터 리스트 저장
    const { data: clusterList } = useQuery(clusterKeys.all, () => _getClusterList(), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                return data?.clusters.filter(cluster => cluster.id !== protectionGroupData?.protection_cluster.id);
            }
        },
        enabled: protectionGroupData !== undefined,
    });

    // 타겟 클러스터 목록을 지정한다
    useEffect(() => {
        if (clusterList) {
            setRecoveryClusters(clusterList);
            setRecoveryCluster({
                value: clusterList[0].id,
                label: clusterList[0].name,
                state_code: clusterList[0].state_code,
            });
            setRecoveryPlanAdd({
                ...recoveryPlanAdd,
                recovery_cluster: {
                    id: clusterList[0].id,
                },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clusterList, setRecoveryClusters, setRecoveryPlanAdd]);

    const { handleSubmit, control, resetField, reset } = useForm<IForm>({
        defaultValues: {
            name: recoveryPlanAdd?.name ?? '',
            snapshot_retention_count: recoveryPlanAdd?.snapshot_retention_count ?? 12,
            remarks: recoveryPlanAdd?.remarks ?? '',
        },
    });

    const onSubmit: SubmitHandler<IForm> = data => {
        if (clusterList?.length === 0) {
            toast.warn('복구 클러스터가 존재하지 않습니다. 클러스터 추가 등록이 필요합니다.');
            return;
        }
        if (protectionGroupData.protection_cluster?.state_code === 'cluster.state.inactive') {
            toast.error('클러스터의 상태가 inactive 입니다.');
            return;
        }

        if (initFlag) {
            setPlanInstances({
                nonOperatedInstances: protectionGroupData.instances,
                operatedInstances: [],
            });
            const tenants: any[] = [];
            const avzones: any[] = [];
            const storages: any[] = [];
            const networks: any[] = [];
            const instances: any[] = [];
            protectionGroupData.instances.map((instance: any) => {
                // tenant
                if (!tenants.find(({ id }) => id === instance.tenant.id)) {
                    tenants.push(instance.tenant);
                }
                // avzone
                if (!avzones.find(({ id }) => id === instance.availability_zone.id)) {
                    avzones.push(instance.availability_zone);
                }
                // storages
                if (instance?.volumes) {
                    instance.volumes.map((volume: any) => {
                        if (!storages.find(({ id }) => id === volume.storage.id)) {
                            storages.push(volume.storage);
                        }
                    });
                }
                // external_networks
                if (instance?.routers) {
                    instance.routers.map((router: any) => {
                        router.external_routing_interfaces.map((route: any) => {
                            if (!networks.find(({ id }) => id === route.network.id)) {
                                networks.push(route.network);
                            }
                        });
                    });
                }
                // instances
                if (!instances.find(({ id }) => id === instance.id)) {
                    instances.push(instance);
                }
            });
            setRecoveryPlanAdd({
                ...recoveryPlanAdd,
                name: data.name,
                remarks: data?.remarks ?? '',
                snapshot_retention_count: data.snapshot_retention_count,
                protection_cluster: {
                    id: protectionGroupData.protection_cluster.id,
                },
                // 초기원본 정보를 생성한다.
                detail: {
                    tenants: tenants.map(tenant => {
                        return {
                            recovery_type_code: 'dr.recovery.plan.tenant.recovery.type.mirroring',
                            protection_cluster_tenant: { ...tenant },
                            recovery_cluster_tenant_mirror_name: '',
                        };
                    }),
                    availability_zones: avzones.map(avzone => {
                        return {
                            recovery_type_code: 'dr.recovery.plan.availability-zone.recovery.type.mapping',
                            protection_cluster_availability_zone: {
                                ...avzone,
                            },
                            recovery_cluster_availability_zone: {
                                id: 0,
                            },
                        };
                    }),
                    storages: storages.map(storage => {
                        return {
                            recovery_type_code: 'dr.recovery.plan.storage.recovery.type.mapping',
                            protection_cluster_storage: {
                                ...storage,
                            },
                            recovery_cluster_storage: {
                                id: 0,
                            },
                        };
                    }),
                    external_networks: networks.map(network => {
                        return {
                            recovery_type_code: 'dr.recovery.plan.network.recovery.type.mapping',
                            protection_cluster_external_network: {
                                ...network,
                            },
                            recovery_cluster_external_network: {
                                id: 0,
                            },
                        };
                    }),
                    instances: instances.map(instance => {
                        return {
                            recovery_type_code: 'dr.recovery.plan.instance.recovery.type.mirroring',
                            protection_cluster_instance: {
                                ...instance,
                            },
                            recovery_cluster_hypervisor: {
                                id: 0,
                            },
                            recovery_cluster_availability_zone: {
                                id: 0,
                            },
                            auto_start_flag: false,
                            dependencies: [],
                        };
                    }),
                },
            });
        } else {
            setRecoveryPlanAdd({
                ...recoveryPlanAdd,
                name: data.name,
                remarks: data?.remarks ?? '',
                snapshot_retention_count: data.snapshot_retention_count,
                protection_cluster: {
                    id: protectionGroupData.protection_cluster.id,
                },
            });
        }
        setInitFlag(false);

        setStep(2);
    };

    const onChangeProtectionGroup = (e: OptionType) => {
        setModalState(true);
        setSelectedGroup(e);
    };

    if (!protectionGroupData) return <DefaultSpinner />;
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
                                <DefaultSelect
                                    name="protectionGroup"
                                    options={ProtectionGroupOptions}
                                    label={t('DR.PROTECTION_GROUP')}
                                    onChange={onChangeProtectionGroup}
                                    value={
                                        ProtectionGroupOptions.filter(option => {
                                            return option.value === selectedProtectionGroup.value;
                                        })[0]
                                    }
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
                                    value={protectionGroupData?.protection_cluster?.name}
                                    state={protectionGroupData?.protection_cluster?.state_code}
                                />
                            </FormGroup>
                        </Group>
                        <Group>
                            <FormGroup>
                                <DisabledFormTextField
                                    label={t('DR.TYPE')}
                                    name="type"
                                    value={
                                        protectionGroupData &&
                                        protectionGroupData?.protection_cluster?.type_code.split('.')[2]
                                    }
                                />
                            </FormGroup>
                        </Group>
                        <Group>
                            <FormGroup>
                                <DisabledFormTextField
                                    label={t('DR.OWNER_GROUP')}
                                    name="ownerGroup"
                                    value={
                                        protectionGroupData && protectionGroupData?.protection_cluster?.owner_group.name
                                    }
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
                        navigate(-1);
                    }}
                />
                <ActionButton
                    buttonType="next"
                    type="submit"
                    disabled={protectionGroupData && protectionGroupData.instances ? false : true}
                />
            </CardActions>
            {modal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={modal}
                    title={t('DR.RP.CHANGE_PROTECTION')}
                    onConfirm={() => {
                        // 보호그룹 변경 확인
                        reset();
                        const group = protectionGroups.find((group: any) => group.id === selectedGroup.value);
                        if (group) {
                            setSelectedProtectionGroup({
                                value: group.id,
                                label: group.name,
                            });
                        }
                        setInitFlag(true);
                        setModalState(false);
                    }}
                    onClose={() => {
                        setModalState(false);
                    }}
                    isLoading={protectionGroupLoading}
                    actionType="confirm"
                    buttonColor="warning"
                >
                    <DialogText
                        title={protectionGroupData && protectionGroupData.name}
                        body={t('DR.RP.RESET_CLUSTER')}
                    />
                </DefaultDialog>
            )}
        </form>
    );
};

export default PlanInformation;

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
