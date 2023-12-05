import {
    AccordionDetails,
    Box,
    CircularProgress,
    FormControl,
    FormGroup,
    TableCell,
    TableRow,
    Typography,
    useTheme,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Control, useFieldArray, UseFormResetField } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import {
    _getClusterAvZone,
    _getClusterHypervisor,
    _getClusterNetwork,
    _getClusterVolumeType,
} from '../../../../../api/center/cluster';
import {
    clusterAvZoneKeys,
    clusterHypervisorKeys,
    clusterNetworkKeys,
    clusterVolumeTypeKeys,
} from '../../../../../libs/utils/queryKeys';
import {
    openStackRecoveryPlanAddAtom,
    recoveryClusterAtom,
} from '../../../../../recoil/atom/OpenShiftRecoveryPlanAtom';
import { PlanResourceTable } from '../../../../component/common/PlanResourceTable/PlanResourceTable';
import TableHeader from '../../../../component/common/Table/TableHeader';
import DefaultSelect from '../../../../component/common/Select/DefaultSelect';
import { OptionType } from '../../../../../@types';
import DefaultSkeleton from '../../../../component/common/Skeleton/DefaultSkeleton';
import { ResourceCard } from '../../../../component/common/Resource/ResourceCard';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { formatBytes } from '../../../../../libs/utils/commonFunction';
import TableChip from '../../../../component/common/Chip/TableChip';
import FormTextField from '../../../../component/common/TextField/FormTextField';
import { PlanPanel } from '@/app/component/common/Resource/PlanPanel';

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

interface AvzoneProps {
    control: Control<IForm>;
    type?: 'add' | 'edit';
}

/**
 * 복구계획 가용구역 미러링 정보
 */
export const AvZone = ({ control, type = 'add' }: AvzoneProps) => {
    const defaultOption = [{ label: '복구대상 가용구역 없음', value: 0 }];
    const theme = useTheme();
    const recoveryCluster = useRecoilValue(recoveryClusterAtom);
    const recoveryPlanAdd = useRecoilValue(openStackRecoveryPlanAddAtom);
    const setRecoveryPlanAdd = useSetRecoilState(openStackRecoveryPlanAddAtom);

    const { t } = useTranslation();
    const { fields, update } = useFieldArray({ control, name: 'detail.availability_zones' });

    const { data: recoveryAvZones, isLoading: avZoneLoading } = useQuery(
        clusterAvZoneKeys.list({
            clusterID: recoveryCluster.value,
        }),
        () => _getClusterAvZone(recoveryCluster.value),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.availability_zones;
                } else if (status === 204) {
                    return [];
                }
            },
            enabled: !!recoveryCluster?.value,
        },
    );

    /**
     * 가용구역 초기화
     * recovery id가 0일 때 초깃값을 지정해준다.
     */
    const avZoneOptions = useMemo(() => {
        if (recoveryAvZones && recoveryAvZones.length > 0) {
            if (type === 'add') {
                if (recoveryPlanAdd.detail.availability_zones.length > 0) {
                    if (recoveryPlanAdd.detail.availability_zones[0].recovery_cluster_availability_zone?.id === 0) {
                        const initAvZones = recoveryPlanAdd.detail.availability_zones.map((avzone, idx) => {
                            update(idx, {
                                ...avzone,
                                recovery_cluster_availability_zone: {
                                    id: recoveryAvZones[0].id,
                                },
                            });
                            return {
                                ...avzone,
                                recovery_cluster_availability_zone: {
                                    id: recoveryAvZones[0].id,
                                },
                            };
                        });
                        setRecoveryPlanAdd({
                            ...recoveryPlanAdd,
                            detail: {
                                ...recoveryPlanAdd.detail,
                                availability_zones: initAvZones,
                            },
                        });
                    }
                }
            }
            return recoveryAvZones.map(avzone => {
                return { label: avzone.name, value: avzone.id };
            });
        } else return defaultOption;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recoveryAvZones]);
    return (
        <>
            <Title>
                {avZoneLoading ? (
                    <div>
                        {t('DR.AVAILABILITY_ZONE')} (<CircularProgress size={10} color="inherit" />)
                    </div>
                ) : (
                    `${t('DR.AVAILABILITY_ZONE')} (${fields.length})`
                )}
            </Title>
            <ResourceWrapper sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <PlanResourceTable>
                    <PlanResourceTable.Head>
                        <TableCell sx={{ width: '40%' }}>
                            <TableHeader text={'원본 가용구역'} />
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell sx={{ width: '40%' }}>
                            <TableHeader text={'복구 가용구역'} />
                        </TableCell>
                    </PlanResourceTable.Head>
                    <PlanResourceTable.Body>
                        {fields.map((avzone, avzoneIdx) => {
                            return (
                                <TableRow key={avzone.id}>
                                    <TableCell>
                                        <Typography>{avzone.protection_cluster_availability_zone.name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <ArrowForwardIcon />
                                    </TableCell>
                                    <TableCell>
                                        {avZoneOptions ? (
                                            <FormControl>
                                                <DefaultSelect
                                                    name={`detail.availability_zones.${avzoneIdx}.recovery_cluster_availability_zone.id`}
                                                    options={avZoneOptions}
                                                    onChange={(e: OptionType) => {
                                                        update(avzoneIdx, {
                                                            ...avzone,
                                                            recovery_cluster_availability_zone: {
                                                                id: Number(e.value),
                                                            },
                                                        });
                                                    }}
                                                    disabled={!avZoneOptions}
                                                    value={
                                                        avZoneOptions.filter(option => {
                                                            return (
                                                                Number(option.value) ===
                                                                Number(avzone?.recovery_cluster_availability_zone?.id)
                                                            );
                                                        })[0]
                                                    }
                                                />
                                            </FormControl>
                                        ) : (
                                            <DefaultSkeleton />
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </PlanResourceTable.Body>
                </PlanResourceTable>
            </ResourceWrapper>
        </>
    );
};

interface HypervisorProps {
    control: Control<IForm, any>;
    type?: 'add' | 'edit';
}

/**
 * 복구계획 하이퍼바이저 미러링 정보
 */
export const Hypervisor = ({ control, type = 'add' }: HypervisorProps) => {
    const defaultOption = [{ label: '복구대상 하이퍼바이저 없음', value: 0 }];
    const recoveryCluster = useRecoilValue(recoveryClusterAtom);
    const recoveryPlanAdd = useRecoilValue(openStackRecoveryPlanAddAtom);
    const setRecoveryPlanAdd = useSetRecoilState(openStackRecoveryPlanAddAtom);

    const { fields, update } = useFieldArray({ control, name: 'detail.instances' });

    const { data: recoveryHypervisors } = useQuery(
        clusterHypervisorKeys.list({
            clusterID: recoveryCluster.value,
        }),
        () => _getClusterHypervisor(recoveryCluster.value),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.hypervisors;
                } else if (status === 204) {
                    return [];
                }
            },
            enabled: !!recoveryCluster.value,
        },
    );

    const { data: recoveryAvZones } = useQuery(
        clusterAvZoneKeys.list({
            clusterID: recoveryCluster.value,
        }),
        () => _getClusterAvZone(recoveryCluster.value),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.availability_zones;
                } else if (status === 204) {
                    return [];
                }
            },
            enabled: !!recoveryCluster?.value,
        },
    );

    /**
     * 인스턴스 하이퍼바이저 초기화
     * recovery id가 0일 때 초깃값을 지정해준다.
     */
    const hypervisorOptions = useMemo(() => {
        if (recoveryHypervisors && recoveryHypervisors.length > 0 && recoveryAvZones && recoveryAvZones.length > 0) {
            if (type === 'add') {
                if (recoveryPlanAdd.detail.instances.length > 0) {
                    if (recoveryPlanAdd.detail.instances[0].recovery_cluster_hypervisor?.id === 0) {
                        const initInstances = recoveryPlanAdd.detail.instances.map((instance, idx) => {
                            update(idx, {
                                ...instance,
                                recovery_cluster_hypervisor: {
                                    id: recoveryHypervisors[0].id,
                                },
                                recovery_cluster_availability_zone: {
                                    id: recoveryAvZones[0].id,
                                },
                            });
                            return {
                                ...instance,
                                recovery_cluster_hypervisor: {
                                    id: recoveryHypervisors[0].id,
                                },
                                recovery_cluster_availability_zone: {
                                    id: recoveryAvZones[0].id,
                                },
                            };
                        });
                        setRecoveryPlanAdd({
                            ...recoveryPlanAdd,
                            detail: {
                                ...recoveryPlanAdd.detail,
                                instances: initInstances,
                            },
                        });
                    }
                }
            }
            return recoveryHypervisors.map(hypervisor => {
                return { label: `${hypervisor.ip_address}/${hypervisor.hostname}`, value: hypervisor.id };
            });
        } else return defaultOption;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recoveryHypervisors]);

    // 복구 클러스터 하이퍼바이저를 Map 형식으로 저장해놓고 사용
    const clusterHypervisorMap = useMemo(() => {
        const map = new Map();
        if (recoveryHypervisors) {
            recoveryHypervisors.map(hypervisor => {
                map.set(hypervisor.id, hypervisor);
            });
        }
        return map;
    }, [recoveryHypervisors]);

    return (
        <PlanPanel>
            <PlanPanel.Title text={`인스턴스 (${fields.length})`} />
            <AccordionDetails>
                {fields.map((instance, instanceIdx) => {
                    return (
                        <CardWrapper key={instance.id}>
                            <ResourceCard type="protection">
                                <ResourceCard.Wrapper>
                                    <ResourceCard.Title text="원본 컴퓨트 노드(IP / HOST)" />
                                    <ResourceCard.Content>
                                        {`${instance.protection_cluster_instance.hypervisor.ip_address} / ${instance.protection_cluster_instance.hypervisor.hostname}`}
                                    </ResourceCard.Content>
                                </ResourceCard.Wrapper>
                                <Grid>
                                    <GridItem>
                                        <ResourceCard.Wrapper>
                                            <ResourceCard.Title text="가용구역" />
                                            <ResourceCard.Content>
                                                {instance.protection_cluster_instance.availability_zone.name}
                                            </ResourceCard.Content>
                                        </ResourceCard.Wrapper>
                                    </GridItem>
                                    <GridItem>
                                        <ResourceCard.Wrapper>
                                            <ResourceCard.Title text="VCPUs" />
                                            <ResourceCard.Content>
                                                {`${
                                                    instance.protection_cluster_instance.hypervisor?.vcpu_used_cnt ?? 0
                                                }(core) / ${
                                                    instance.protection_cluster_instance.hypervisor?.vcpu_total_cnt ?? 0
                                                }(core)`}
                                            </ResourceCard.Content>
                                        </ResourceCard.Wrapper>
                                    </GridItem>
                                    <GridItem>
                                        <ResourceCard.Wrapper>
                                            <ResourceCard.Title text="RAM" />
                                            <ResourceCard.Content>
                                                {formatBytes(
                                                    instance.protection_cluster_instance.hypervisor.mem_used_bytes,
                                                )}
                                                /
                                                {formatBytes(
                                                    instance.protection_cluster_instance.hypervisor.mem_total_bytes,
                                                )}
                                            </ResourceCard.Content>
                                        </ResourceCard.Wrapper>
                                    </GridItem>
                                </Grid>
                                <Grid>
                                    <GridItem>
                                        <ResourceCard.Wrapper>
                                            <ResourceCard.Title text="Status" />
                                            <ResourceCard.Content>
                                                <TableChip
                                                    label={instance.protection_cluster_instance.status}
                                                    color={instance.status}
                                                />
                                            </ResourceCard.Content>
                                        </ResourceCard.Wrapper>
                                    </GridItem>
                                    <GridItem>
                                        <ResourceCard.Wrapper>
                                            <ResourceCard.Title text="State" />
                                            <ResourceCard.Content>
                                                <TableChip
                                                    label={instance.protection_cluster_instance.state}
                                                    color={instance.state}
                                                />
                                            </ResourceCard.Content>
                                        </ResourceCard.Wrapper>
                                    </GridItem>
                                </Grid>
                            </ResourceCard>
                            <ResourceCard type="recovery">
                                <ResourceCard.Wrapper>
                                    <ResourceCard.Title text="복구 컴퓨트 노드(IP / HOST)" />
                                    <ResourceCard.Content>
                                        <DefaultSelect
                                            name={`detail.instances.${instanceIdx}.recovery_cluster_hypervisor.id`}
                                            options={hypervisorOptions}
                                            onChange={(e: OptionType) => {
                                                update(instanceIdx, {
                                                    ...instance,
                                                    recovery_cluster_hypervisor: {
                                                        id: Number(e.value),
                                                    },
                                                });
                                            }}
                                            disabled={!hypervisorOptions}
                                            value={
                                                hypervisorOptions.filter(option => {
                                                    return (
                                                        Number(option.value) ===
                                                        Number(instance?.recovery_cluster_hypervisor?.id)
                                                    );
                                                })[0]
                                            }
                                        />
                                    </ResourceCard.Content>
                                </ResourceCard.Wrapper>
                                <Grid>
                                    <GridItem>
                                        <ResourceCard.Wrapper>
                                            <ResourceCard.Title text="가용구역" />
                                            <ResourceCard.Content>
                                                {
                                                    clusterHypervisorMap.get(instance.recovery_cluster_hypervisor.id)
                                                        ?.availability_zone.name
                                                }
                                            </ResourceCard.Content>
                                        </ResourceCard.Wrapper>
                                    </GridItem>
                                    <GridItem>
                                        <ResourceCard.Wrapper>
                                            <ResourceCard.Title text="VCPUs" />
                                            <ResourceCard.Content>
                                                {`${
                                                    clusterHypervisorMap.get(instance.recovery_cluster_hypervisor.id)
                                                        ?.vcpu_used_cnt ?? 0
                                                }(core) / ${
                                                    clusterHypervisorMap.get(instance.recovery_cluster_hypervisor.id)
                                                        ?.vcpu_total_cnt ?? 0
                                                }(core)`}
                                            </ResourceCard.Content>
                                        </ResourceCard.Wrapper>
                                    </GridItem>
                                    <GridItem>
                                        <ResourceCard.Wrapper>
                                            <ResourceCard.Title text="RAM" />
                                            <ResourceCard.Content>
                                                {formatBytes(
                                                    clusterHypervisorMap.get(instance.recovery_cluster_hypervisor.id)
                                                        ?.mem_used_bytes,
                                                )}
                                                /
                                                {formatBytes(
                                                    clusterHypervisorMap.get(instance.recovery_cluster_hypervisor.id)
                                                        ?.mem_total_bytes,
                                                )}
                                            </ResourceCard.Content>
                                        </ResourceCard.Wrapper>
                                    </GridItem>
                                </Grid>
                                <Grid>
                                    <GridItem>
                                        <ResourceCard.Wrapper>
                                            <ResourceCard.Title text="Status" />
                                            <ResourceCard.Content>
                                                <TableChip
                                                    label={
                                                        clusterHypervisorMap.get(
                                                            instance.recovery_cluster_hypervisor.id,
                                                        )?.status
                                                    }
                                                    color={
                                                        clusterHypervisorMap.get(
                                                            instance.recovery_cluster_hypervisor.id,
                                                        )?.status
                                                    }
                                                />
                                            </ResourceCard.Content>
                                        </ResourceCard.Wrapper>
                                    </GridItem>
                                    <GridItem>
                                        <ResourceCard.Wrapper>
                                            <ResourceCard.Title text="State" />
                                            <ResourceCard.Content>
                                                <TableChip
                                                    label={
                                                        clusterHypervisorMap.get(
                                                            instance.recovery_cluster_hypervisor.id,
                                                        )?.state
                                                    }
                                                    color={
                                                        clusterHypervisorMap.get(
                                                            instance.recovery_cluster_hypervisor.id,
                                                        )?.state
                                                    }
                                                />
                                            </ResourceCard.Content>
                                        </ResourceCard.Wrapper>
                                    </GridItem>
                                </Grid>
                            </ResourceCard>
                        </CardWrapper>
                    );
                })}
            </AccordionDetails>
        </PlanPanel>
    );
};

interface NetworkProps {
    control: Control<IForm>;
    type?: 'add' | 'edit';
}

/**
 * 복구계획 네트워크 매핑 정보
 */
export const Network = ({ control, type = 'add' }: NetworkProps) => {
    const defaultOption = [{ label: '복구대상 네트워크 없음', value: 0 }];

    const theme = useTheme();
    const recoveryCluster = useRecoilValue(recoveryClusterAtom);
    const { t } = useTranslation();
    const recoveryPlanAdd = useRecoilValue(openStackRecoveryPlanAddAtom);
    const setRecoveryPlanAdd = useSetRecoilState(openStackRecoveryPlanAddAtom);

    const { fields, update } = useFieldArray({ control, name: 'detail.external_networks' });

    const { data: recoveryNetworks, isLoading: networkLoading } = useQuery(
        clusterNetworkKeys.list({
            clusterID: recoveryCluster.value,
        }),
        () => _getClusterNetwork(recoveryCluster.value),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    const networks = data.networks.filter(network => network.external_flag);
                    return networks ?? [];
                } else if (status === 204) {
                    return [];
                }
            },
            enabled: !!recoveryCluster?.value,
        },
    );

    /**
     * 복구 네트워크  초기화
     */
    const networkOptions = useMemo(() => {
        if (recoveryNetworks) {
            if (recoveryNetworks.length > 0) {
                if (type === 'add') {
                    if (recoveryPlanAdd.detail.external_networks.length > 0) {
                        if (recoveryPlanAdd.detail.external_networks[0].recovery_cluster_external_network?.id === 0) {
                            const initNetworks = recoveryPlanAdd.detail.external_networks.map((network, idx) => {
                                update(idx, {
                                    ...network,
                                    recovery_cluster_external_network: {
                                        id: recoveryNetworks[0].id,
                                    },
                                });
                                return {
                                    ...network,
                                    recovery_cluster_external_network: {
                                        id: recoveryNetworks[0].id,
                                    },
                                };
                            });
                            setRecoveryPlanAdd({
                                ...recoveryPlanAdd,
                                detail: {
                                    ...recoveryPlanAdd.detail,
                                    external_networks: initNetworks,
                                },
                            });
                        }
                    }
                }
                return recoveryNetworks.map(network => {
                    return { label: network.name, value: network.id };
                });
            } else return defaultOption;
        } else return defaultOption;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recoveryNetworks]);

    // 복구 클러스터 네트워크를 Map 형식으로 저장해놓고 사용
    const clusterRegistriesMap = useMemo(() => {
        const map = new Map();
        if (recoveryNetworks) {
            recoveryNetworks.map(network => {
                map.set(network.id, network);
            });
        }
        return map;
    }, [recoveryNetworks]);

    return (
        <>
            <Title>
                {networkLoading ? (
                    <div>
                        {t('DR.NETWORK')} (<CircularProgress size={10} color="inherit" />)
                    </div>
                ) : (
                    `${t('DR.NETWORK')} (${fields.length})`
                )}
            </Title>
            <ResourceWrapper sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <PlanResourceTable>
                    <PlanResourceTable.Head>
                        <TableCell>
                            <TableHeader text={t('TABLE.ORIGINAL_NETWORK')} />
                        </TableCell>
                        <TableCell>
                            <TableHeader text={t('TABLE.TENANT')} />
                        </TableCell>
                        <TableCell>
                            <TableHeader text={t('TABLE.TYPE')} />
                        </TableCell>
                        <TableCell>
                            <TableHeader text={t('TABLE.DESCRIPTION')} />
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                            <TableHeader text={t('TABLE.RECOVERY_NETWORK')} />
                        </TableCell>
                        <TableCell>
                            <TableHeader text={t('TABLE.TENANT')} />
                        </TableCell>
                        <TableCell>
                            <TableHeader text={t('TABLE.TYPE')} />
                        </TableCell>
                        <TableCell>
                            <TableHeader text={t('TABLE.DESCRIPTION')} />
                        </TableCell>
                    </PlanResourceTable.Head>
                    <PlanResourceTable.Body>
                        {fields.map((network, networkIdx) => {
                            return (
                                <TableRow key={network.id}>
                                    <TableCell>
                                        <Typography>
                                            {' '}
                                            {network.protection_cluster_external_network.name ?? '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            {network.protection_cluster_external_network.tenant?.name ?? '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            {network.protection_cluster_external_network.type_code ?? '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            {network.protection_cluster_external_network.description ?? '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <ArrowForwardIcon />
                                    </TableCell>
                                    <TableCell>
                                        {networkOptions ? (
                                            <FormControl>
                                                <DefaultSelect
                                                    name={`detail.external_networks.${networkIdx}.recovery_cluster_external_network.id`}
                                                    options={networkOptions}
                                                    onChange={(e: OptionType) => {
                                                        update(networkIdx, {
                                                            ...network,
                                                            recovery_cluster_external_network: {
                                                                id: Number(e.value),
                                                            },
                                                        });
                                                    }}
                                                    disabled={!networkOptions}
                                                    value={
                                                        networkOptions.filter(option => {
                                                            return (
                                                                Number(option.value) ===
                                                                Number(network.recovery_cluster_external_network.id)
                                                            );
                                                        })[0]
                                                    }
                                                />
                                            </FormControl>
                                        ) : (
                                            <DefaultSkeleton />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            {clusterRegistriesMap.get(network?.recovery_cluster_external_network?.id)
                                                ?.tenant?.name ?? '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            {clusterRegistriesMap.get(network?.recovery_cluster_external_network?.id)
                                                ?.type_code ?? '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            {clusterRegistriesMap.get(network?.recovery_cluster_external_network?.id)
                                                ?.description ?? '-'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </PlanResourceTable.Body>
                </PlanResourceTable>
            </ResourceWrapper>
        </>
    );
};

interface TenantProps {
    control: Control<IForm>;
    resetField: UseFormResetField<IForm>;
}

/**
 * 복구계획 테넌트 미러링 정보
 */
export const Tenant = ({ control, resetField }: TenantProps) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { fields } = useFieldArray({ control, name: 'detail.tenants' });

    return (
        <>
            <Title>{t('TABLE.TENANT')}</Title>
            <ResourceWrapper sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <PlanResourceTable>
                    <PlanResourceTable.Head>
                        <TableCell sx={{ width: '40%' }}>
                            <TableHeader text={'원본 프로젝트'} />
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell sx={{ width: '40%' }}>
                            <TableHeader text={'복구 프로젝트'} />
                        </TableCell>
                    </PlanResourceTable.Head>
                    <PlanResourceTable.Body>
                        {fields.map((tenant, tenantIdx) => {
                            return (
                                <TableRow key={tenant.id}>
                                    <TableCell>
                                        <Typography>{tenant.protection_cluster_tenant.name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <ArrowForwardIcon />
                                    </TableCell>
                                    <TableCell>
                                        <FormGroup>
                                            <FormTextField<IForm>
                                                name={`detail.tenants.${tenantIdx}.recovery_cluster_tenant_mirror_name`}
                                                resetField={resetField}
                                                type="text"
                                                control={control}
                                                rules={{
                                                    maxLength: {
                                                        value: 55,
                                                        message: '최대 55자까지 입력이 가능합니다.',
                                                    },
                                                    required: {
                                                        value: true,
                                                        message: '입력값은 필수입니다.',
                                                    },
                                                }}
                                            />
                                        </FormGroup>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </PlanResourceTable.Body>
                </PlanResourceTable>
            </ResourceWrapper>
        </>
    );
};

interface VolumeProps {
    control: Control<IForm>;
    type?: 'add' | 'edit';
}

/**
 * 복구계획 볼륨(스토리지) 매핑 정보
 */
export const Volume = ({ control, type = 'add' }: VolumeProps) => {
    const defaultOption = [{ label: '복구대상 볼륨 없음', value: 0 }];

    const theme = useTheme();
    const recoveryCluster = useRecoilValue(recoveryClusterAtom);
    const { t } = useTranslation();
    const recoveryPlanAdd = useRecoilValue(openStackRecoveryPlanAddAtom);
    const setRecoveryPlanAdd = useSetRecoilState(openStackRecoveryPlanAddAtom);

    const { fields, update } = useFieldArray({ control, name: 'detail.storages' });

    const { data: recoveryStorages, isLoading: storageLoading } = useQuery(
        clusterVolumeTypeKeys.list({
            clusterID: recoveryCluster.value,
        }),
        () => _getClusterVolumeType(recoveryCluster.value),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.storages;
                } else if (status === 204) {
                    return [];
                }
            },
            enabled: !!recoveryCluster?.value,
        },
    );

    /**
     * 볼륨타입 초기화
     */
    const storageOptions = useMemo(() => {
        if (recoveryStorages && recoveryStorages.length > 0) {
            if (type === 'add') {
                if (recoveryPlanAdd.detail.storages.length > 0) {
                    if (recoveryPlanAdd.detail.storages[0].recovery_cluster_storage?.id === 0) {
                        const initStorages = recoveryPlanAdd.detail.storages.map((storage, idx) => {
                            update(idx, {
                                ...storage,
                                recovery_cluster_storage: {
                                    id: recoveryStorages[0].id,
                                },
                            });
                            return {
                                ...storage,
                                recovery_cluster_storage: {
                                    id: recoveryStorages[0].id,
                                },
                            };
                        });
                        setRecoveryPlanAdd({
                            ...recoveryPlanAdd,
                            detail: {
                                ...recoveryPlanAdd.detail,
                                storages: initStorages,
                            },
                        });
                    }
                }
            }
            return recoveryStorages.map(storage => {
                return { label: storage.name, value: storage.id };
            });
        } else return defaultOption;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recoveryStorages]);

    return (
        <>
            <Title>
                {storageLoading ? (
                    <div>
                        {t('DR.VOLUME')} (<CircularProgress size={10} color="inherit" />)
                    </div>
                ) : (
                    `${t('DR.VOLUME')} (${fields.length})`
                )}
            </Title>
            <ResourceWrapper sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <PlanResourceTable>
                    <PlanResourceTable.Head>
                        <TableCell sx={{ width: '40%' }}>
                            <TableHeader text={'원본 볼륨'} />
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell sx={{ width: '40%' }}>
                            <TableHeader text={'복구 볼륨'} />
                        </TableCell>
                    </PlanResourceTable.Head>
                    <PlanResourceTable.Body>
                        {fields.map((storage, storageIdx) => {
                            return (
                                <TableRow key={storage.id}>
                                    <TableCell>
                                        <Typography>{storage.protection_cluster_storage.name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <ArrowForwardIcon />
                                    </TableCell>
                                    <TableCell>
                                        {storageOptions ? (
                                            <FormControl>
                                                <DefaultSelect
                                                    name={`detail.storages.${storageIdx}.recovery_cluster_storage.id`}
                                                    options={storageOptions}
                                                    onChange={(e: OptionType) => {
                                                        update(storageIdx, {
                                                            ...storage,
                                                            recovery_cluster_storage: {
                                                                id: Number(e.value),
                                                            },
                                                        });
                                                    }}
                                                    disabled={!storageOptions}
                                                    value={
                                                        storageOptions.filter(option => {
                                                            return (
                                                                Number(option.value) ===
                                                                Number(storage.recovery_cluster_storage.id)
                                                            );
                                                        })[0]
                                                    }
                                                />
                                            </FormControl>
                                        ) : (
                                            <DefaultSkeleton />
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </PlanResourceTable.Body>
                </PlanResourceTable>
            </ResourceWrapper>
        </>
    );
};

const CardWrapper = styled.div`
    display: flex;
    column-gap: 10px;
    padding-bottom: 4rem;
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

const Grid = styled(Grid2).attrs({ container: true, columnSpacing: 3 })``;

const GridItem = styled(Grid2).attrs({ xs: 12, sm: 6, md: 4 })`
    & .MuiChip-root {
        width: fit-content;
    }
`;
