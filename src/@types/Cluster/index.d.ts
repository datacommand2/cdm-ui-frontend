import { Group } from '../Cloud/user';

/**
 * 클러스터 타입
 */
type ClusterTypeCode =
    | 'cluster.type.openstack'
    | 'cluster.type.openshift'
    | 'cluster.type.kubernetes'
    | 'cluster.type.vmware'
    | 'cluster.type.ncloud'
    | 'cluster.type.samplecloud';

/**
 * 클러스터 상태
 */
type ClusterStateCode = 'cluster.state.active' | 'cluster.state.inactive' | 'cluster.state.warning';

/**
 * 클러스터 동기화 상태
 */
export type ClusterSyncStatusCode =
    | 'cluster.sync.state.init'
    | 'cluster.sync.state.running'
    | 'cluster.sync.state.loading'
    | 'cluster.sync.state.done'
    | 'cluster.sync.state.failed'
    | 'cluster.sync.state.error'
    | 'cluster.sync.state.unknown'
    | 'cluster.sync.state.none';

/**
 * 클러스터 서비스 동기화
 */
export type ClusterServiceSyncTypeCode =
    | 'cluster.tenant.list.sync'
    | 'cluster.availability_zone.list.sync'
    | 'cluster.hypervisor.list.sync'
    | 'cluster.security_group.list.sync'
    | 'cluster.network.list.sync'
    | 'cluster.router.list.sync'
    | 'cluster.storage.list.sync'
    | 'cluster.volume.list.sync'
    | 'cluster.volume-snapshot.list.sync'
    | 'cluster.keypair.list.sync'
    | 'cluster.instance.list.sync';

/**
 * 클러스터 서비스 동기화 진행률
 */
export type ClusterServiceSyncProgress =
    | 'cluster.sync.completed'
    | 'cluster.sync.running'
    | 'cluster.sync.failed'
    | 'cluster.sync.waiting'
    | 'waiting';
/**
 * 오픈스택 클러스터 동기화 상태 타입
 */
type ClusterSyncCompletion = {
    progress_status?: ClusterServiceSyncProgress | 'waiting';
    resource: ClusterServiceSyncTypeCode;
};

/**
 * 클러스터 동기화 상태 타입
 */
export type ClusterSyncStatus = {
    id: number | string;
    progress?: string;
    status: ClusterSyncStatusCode;
    completion?: ClusterSyncCompletion[];
    manual?: boolean;
    init?: string;
    reasons?: {
        code: string;
        contents: string;
    }[];
};

/**
 * 오픈스택 클러스터 상태 타입
 */
export interface ClusterStatus {
    storages: {
        id: string;
        binary: string;
        backend_name: string;
        host: string;
        zone?: string;
        status?: string;
        last_updated?: string;
        exception?: boolean;
    }[];
    computes: {
        id: string;
        binary: string;
        host: string;
        zone?: string;
        status?: string;
        last_updated?: string;
        exception?: boolean;
    }[];
    networks: {
        id: string;
        type: string;
        binary: string;
        host: string;
        status?: string;
        last_updated?: string;
        exception?: boolean;
    }[];
    status: ClusterStateCode;
    updated_at?: number;
    compute_error?: string;
    storage_error?: string;
    network_error?: string;
}

/**
 * 오픈스택 클러스터 Detail 인터페이스
 */
export interface OpenStackCluster {
    id: number;
    owner_group: OwnerGroupProps;
    permissions?: {
        group: Group;
        mode_code: 'cluster.permission.mode.readonly' | 'cluster.permission.mode.readwrite';
    };
    name: string;
    remarks?: string;
    type_code: ClusterTypeCode;
    api_server_url?: string;
    credential?: string;
    state_code?: ClusterStateCode;
    created_at: number;
    updated_at?: number;
    synchronized_at?: number;
}

/**
 * 오픈스택 클러스터 목록 인터페이스
 */
export interface OpenStackClusters {
    id: number;
    owner_group: OwnerGroupProps;
    permissions?: {
        group: Group;
        mode_code: 'cluster.permission.mode.readonly' | 'cluster.permission.mode.readwrite';
    };
    name: string;
    remarks?: string;
    type_code: ClusterTypeCode;
    api_server_url: string;
    credential: string;
    state_code: ClusterStateCode;
    created_at: number;
    updated_at?: number;
    synchronized_at?: number;
}

/**
 * 오픈스택 클러스터 추가 인터페이스
 */
export interface OpenStackClusterAdd {
    owner_group: {
        id: number;
    };
    name: string;
    type_code: ClusterTypeCode;
    api_server_url: string;
    credential: string;
    remarks?: string;
}

/**
 * 오픈스택 클러스터 수정 인터페이스
 */
export interface OpenStackClusterEdit {
    id: number;
    owner_group: {
        id: number;
    };
    name: string;
    type_code: ClusterTypeCode;
    api_server_url: string;
    remarks?: string;
}

/**
 * 클러스터 연결 확인 인터페이스
 */
export interface OpenStackClusterCheck {
    type_code: ClusterTypeCode;
    api_server_url: string;
    credential: string;
}

/**
 * 클러스터 Config 인터페이스
 */
export interface OpenStackClusterConfig {
    timestamp_interval: number;
    reserved_sync_interval: number;
}

/**
 * 클러스터 인증 정보 수정 인터페이스
 */
export interface OpenStackCredentialEdit {
    old_credential: string;
    new_credential: string;
}
