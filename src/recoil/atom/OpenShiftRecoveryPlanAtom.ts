import { Edge, Node } from 'reactflow';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

import { OptionType } from '../../@types';
import { OpenStackRecoveryPlanAdd, OpenStackRecoveryPlanEdit } from '../../@types/RecoveryPlan';

const { persistAtom } = recoilPersist();

const protectionClusterAtom = atom<any>({
    key: 'protectionCluster',
    default: {},
});
const planInstancesAtom = atom({
    key: 'planInstances',
    default: {
        operatedInstances: [] as any[],
        nonOperatedInstances: [] as any[],
    },
});

const recoveryClustersAtom = atom({
    key: 'recoveryClusters',
    default: [] as any[],
});

const recoveryClusterAtom = atom<any>({
    key: 'recoveryCluster',
    default: { value: 'default', label: '클러스터' },
});
const initFlagAtom = atom<boolean>({
    key: 'initFlag',
    default: true,
});

const openStackRecoveryPlanAddAtom = atom<OpenStackRecoveryPlanAdd>({
    key: 'openStackRecoveryPlanAdd',
    default: {
        direction_code: 'dr.recovery.direction.failover',
        recovery_cluster: {
            id: 0,
        },
        protection_cluster: {
            id: 0,
        },
        name: '',
        snapshot_retention_count: 12,
        detail: {
            tenants: [],
            availability_zones: [],
            external_networks: [],
            storages: [],
            instances: [],
        },
    },
});
const openStackRecoveryPlanEditAtom = atom<OpenStackRecoveryPlanEdit>({
    key: 'openStackRecoveryPlanEdit',
    default: {
        protection_cluster: {
            id: 0,
        },
        recovery_cluster: {
            id: 0,
        },
        direction_code: 'dr.recovery.direction.failover',
        id: 0,
        name: '',
        snapshot_retention_count: 12,
        detail: {
            tenants: [],
            availability_zones: [],
            external_networks: [],
            storages: [],
            instances: [],
        },
    },
});

const selectedProtectionGroupAtom = atom<OptionType>({
    key: 'selectedProtectionGroup',
    default: { value: 'default', label: '보호그룹' },
    effects_UNSTABLE: [persistAtom],
});

const flowInitAtom = atom({
    key: 'flowInit',
    default: true,
    effects_UNSTABLE: [persistAtom],
});
const nodesAtom = atom<Node[]>({
    key: 'flowNodes',
    default: undefined,
    effects_UNSTABLE: [persistAtom],
});

const edgesAtom = atom<Edge[]>({
    key: 'flowEdges',
    default: [],
    effects_UNSTABLE: [persistAtom],
});

const templateNodesAtom = atom<Node[]>({
    key: 'flowTemplateNodes',
    default: undefined,
});

const templateEdgesAtom = atom<Edge[]>({
    key: 'flowTemplateEdges',
    default: [],
});

const positionAtom = atom({
    key: 'position',
    default: {
        x: 0,
        y: 0,
        zoom: 1,
    },
    effects_UNSTABLE: [persistAtom],
});

export {
    selectedProtectionGroupAtom,
    nodesAtom,
    edgesAtom,
    positionAtom,
    initFlagAtom,
    recoveryClustersAtom,
    recoveryClusterAtom,
    openStackRecoveryPlanAddAtom,
    templateNodesAtom,
    templateEdgesAtom,
    planInstancesAtom,
    flowInitAtom,
    protectionClusterAtom,
    openStackRecoveryPlanEditAtom,
};
