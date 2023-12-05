import { AxiosError } from 'axios';
import { Pagination } from '../../@types';
import {
    ClusterStatus,
    ClusterSyncStatus,
    OpenStackCluster,
    OpenStackClusterAdd,
    OpenStackClusterCheck,
    OpenStackClusterConfig,
    OpenStackClusterEdit,
    OpenStackClusters,
    OpenStackCredentialEdit,
} from '../../@types/Cluster';
import {
    OpenSatckStorage,
    OpenStackAvZone,
    OpenStackHyperviser,
    OpenStackHypervisorInfoEdit,
    OpenStackInstance,
    OpenStackNetwork,
    OpenStackRouter,
    OpenStackSecurityGroup,
    OpenStackSecurityGroupDetail,
    OpenStackStorageMetadataEdit,
    OpenStackTenant,
    OpenStackVolume,
} from '../../@types/Cluster/clusterService';
import { DELETE, GET, PATCH, POST, PUT } from '../../libs/utils/axios';

// 클러스터 목록을 조회하는 함수
export const _getClusterList = async (
    limit?: number | undefined,
    offset?: number | undefined,
    name?: string,
): Promise<[{ clusters: OpenStackClusters[] } | null, Error | AxiosError, number]> => {
    if (limit) {
        return await GET(`/management/clusters?limit=${limit}&offset=${offset}&name="${name?.trim()}"`);
    } else {
        return await GET(`/management/clusters`);
    }
};

// 클러스터 상세조회하는 함수
export const _getClusterDetail = async (clusterID: number): Promise<[{ cluster: OpenStackCluster }, any, number]> => {
    return await GET(`/management/clusters/${clusterID}`);
};

// 클러스터를 추가하는 함수
export const _addCluster = async (cluster: OpenStackClusterAdd) => {
    return await POST(`/management/clusters`, { cluster });
};

// 클러스터를 삭제하는 함수
export const _deleteCluster = async (clusterID: number) => {
    return await DELETE(`/management/clusters/${clusterID}`);
};

// 클러스터를 인증하는 함수
export const _checkCluster = async (connectionInfo: OpenStackClusterCheck) => {
    return await POST(`/management/clusters/check`, connectionInfo);
};

// 클러스터 동기화 상태를 조회하는 함수
export const _syncStatusCluster = async (
    clusterID: number,
): Promise<[ClusterSyncStatus | null, Error | AxiosError, number]> => {
    return await GET(`/management/clusters/${clusterID}/sync-status`);
};

// 클러스터를 수정하는 함수
export const _modifyCluster = async (clusterID: number, cluster: OpenStackClusterEdit) => {
    return await PATCH(`/management/clusters/${clusterID}`, { cluster });
};

// 인증 정보를 수정하는 함수
export const _modifyAuthInfo = async (clusterID: number, authInfo: OpenStackCredentialEdit) => {
    return await PATCH(`/management/clusters/${clusterID}/credential`, authInfo);
};

// 클러스터 hypervisor를 조회하는 함수
export const _getClusterHypervisor = async (
    clusterID: number,
    limit?: number | undefined,
    offset?: number | undefined,
    hostName?: string,
): Promise<
    [
        {
            hypervisors: OpenStackHyperviser[];
            message: {
                code: string;
                contents: string;
            };
            pagination: Pagination;
        },
        any,
        number,
    ]
> => {
    if (limit) {
        return await GET(
            `/management/clusters/${clusterID}/hypervisors?limit=${limit}&offset=${offset}&hostname="${hostName?.trim()}"`,
        );
    } else {
        return await GET(`/management/clusters/${clusterID}/hypervisors`);
    }
};

// 클러스터 hypervisor 상세정보를 조회하는 함수
export const _getClusterHypervisorDetail = async (
    clusterID: number,
    hypervisorID: number,
): Promise<[{ hypervisor: OpenStackHyperviser }, any, number]> => {
    return await GET(`/management/clusters/${clusterID}/hypervisors/${hypervisorID}`);
};

// 클러스터 hypervisor 추가정보를 수정하는 함수
export const _putClusterHypervisorInfo = async (
    clusterID: number,
    hypervisorID: number,
    info: OpenStackHypervisorInfoEdit,
) => {
    return await PUT(`/management/clusters/${clusterID}/hypervisors/${hypervisorID}`, { hypervisor: info });
};

// 클러스터 라우터 정보 목록을 조회하는 함수
export const _getClusterRouter = async (
    clusterID: number,
    limit: number,
    offset: number,
    uuid: string,
): Promise<
    [
        {
            routers: OpenStackRouter[];
            message: {
                code: string;
                contents: string;
            };
            pagination: Pagination;
        },
        any,
        number,
    ]
> => {
    return await GET(`/management/clusters/${clusterID}/routers?limit=${limit}&offset=${offset}&uuid="${uuid.trim()}"`);
};

// 클러스터 테넌트 정보 목록을 조회하는 함수
export const _getClusterTenant = async (
    clusterID: number,
    limit?: number | undefined,
    offset?: number | undefined,
    uuid?: string,
): Promise<
    [
        {
            tenants: OpenStackTenant[];
            message: {
                code: string;
                contents: string;
            };
            pagination: Pagination;
        },
        any,
        number,
    ]
> => {
    if (limit) {
        return await GET(
            `/management/clusters/${clusterID}/tenants?limit=${limit}&offset=${offset}&uuid="${uuid?.trim()}"`,
        );
    } else {
        return await GET(`/management/clusters/${clusterID}/tenants`);
    }
};

// 클러스터 가용구역 정보 목록을 조회하는 함수
export const _getClusterAvZone = async (
    clusterID: number,
    limit?: number | undefined,
    offset?: number | undefined,
): Promise<
    [
        {
            availability_zones: OpenStackAvZone[];
            message: {
                code: string;
                contents: string;
            };
            pagination: Pagination;
        },
        any,
        number,
    ]
> => {
    if (limit) {
        return await GET(`/management/clusters/${clusterID}/availability-zones?limit=${limit}&offset=${offset}`);
    } else {
        return await GET(`/management/clusters/${clusterID}/availability-zones`);
    }
};

// 클러스터 네트워크 정보 목록을 조회하는 함수
export const _getClusterNetwork = async (
    clusterID: number,
    limit?: number | undefined,
    offset?: number | undefined,
    uuid?: string,
): Promise<
    [
        {
            networks: OpenStackNetwork[];
            message: {
                code: string;
                contents: string;
            };
            pagination: Pagination;
        },
        any,
        number,
    ]
> => {
    if (limit) {
        return await GET(
            `/management/clusters/${clusterID}/networks?limit=${limit}&offset=${offset}&uuid="${uuid?.trim()}"`,
        );
    } else {
        return await GET(`/management/clusters/${clusterID}/networks`);
    }
};

// 클러스터 네트워크 상세정보를 조회하는 함수
export const _getClusterNetworkDetail = async (
    clusterID: number,
    networkID: number,
): Promise<[{ network: OpenStackNetwork }, any, number]> => {
    return await GET(`/management/clusters/${clusterID}/networks/${networkID}`);
};

// 클러스터 인스턴스 정보 목록을 조회하는 함수
export const _getClusterInstance = async (
    clusterID: number,
    limit: number,
    offset: number,
    name: string,
): Promise<
    [
        {
            instances: OpenStackInstance[];
            message: {
                code: string;
                contents: string;
            };
            pagination: Pagination;
        },
        any,
        number,
    ]
> => {
    return await GET(
        `/management/clusters/${clusterID}/instances?limit=${limit}&offset=${offset}&name="${name.trim()}"`,
    );
};

// 클러스터 인스턴스 상세정보를 조회하는 함수
export const _getClusterInstanceDetail = async (
    clusterID: number,
    instanceID: number,
): Promise<[{ instance: OpenStackInstance }, any, number]> => {
    return await GET(`/management/clusters/${clusterID}/instances/${instanceID}`);
};

// 클러스터 볼륨 정보 목록을 조회하는 함수
export const _getClusterVolume = async (
    clusterID: number,
    limit: number,
    offset: number,
    name: string,
): Promise<
    [
        {
            volumes: OpenStackVolume[];
            message: {
                code: string;
                contents: string;
            };
            pagination: Pagination;
        },
        any,
        number,
    ]
> => {
    return await GET(`/management/clusters/${clusterID}/volumes?limit=${limit}&offset=${offset}&name="${name.trim()}"`);
};

// 클러스터 보안그룹 정보 목록을 조회하는 함수
export const _getClusterSecurityGroup = async (
    clusterID: number,
    limit: number,
    offset: number,
    uuid: string,
): Promise<
    [
        {
            security_groups: OpenStackSecurityGroup[];
            message: {
                code: string;
                contents: string;
            };
            pagination: Pagination;
        },
        any,
        number,
    ]
> => {
    return await GET(
        `/management/clusters/${clusterID}/security-groups?limit=${limit}&offset=${offset}&uuid="${uuid.trim()}"`,
    );
};

// 클러스터 보안그룹 상세정보를 조회하는 함수
export const _getClusterSecurityGroupDetail = async (
    clusterID: number,
    groupID: number,
): Promise<[{ security_group: OpenStackSecurityGroupDetail }, any, number]> => {
    return await GET(`/management/clusters/${clusterID}/security-groups/${groupID}`);
};

// 클러스터 볼륨타입 정보 목록을 조회하는 함수
export const _getClusterVolumeType = async (
    clusterID: number,
    limit?: number | undefined,
    offset?: number | undefined,
    name?: string,
): Promise<
    [
        {
            storages: OpenSatckStorage[];
            message: {
                code: string;
                contents: string;
            };
            pagination: Pagination;
        },
        any,
        number,
    ]
> => {
    if (limit) {
        return await GET(
            `/management/clusters/${clusterID}/storages?limit=${limit}&offset=${offset}&name="${name?.trim()}"`,
        );
    } else {
        return await GET(`/management/clusters/${clusterID}/storages`);
    }
};

// 클러스터 볼륨타입 상세정보를 조회하는 함수
export const _getClusterVolumeTypeDetail = async (
    clusterID: number,
    storageID: number,
): Promise<[{ storage: OpenSatckStorage }, any, number]> => {
    return await GET(`/management/clusters/${clusterID}/storages/${storageID}`);
};

// 클러스터 볼륨타입 메타데이터를 수정하는 함수
export const _modifyVolumeTypeMetaData = async (
    clusterID: number,
    storageID: number,
    metadata: OpenStackStorageMetadataEdit,
) => {
    return await PATCH(`/management/clusters/${clusterID}/storages/${storageID}`, { metadata });
};

/**
 * 클러스터 상태를 확인하는 함수
 */
export const _getClusterStatus = async (
    clusterID: number,
): Promise<[ClusterStatus | null, Error | AxiosError, number]> => {
    return await GET(`/management/clusters/${clusterID}/check`);
};

/**
 * 클러스터 config를 조회하는 함수
 */
export const _getClusterConfig = async (
    clusterID: number,
): Promise<[{ config: OpenStackClusterConfig }, any, number]> => {
    return await GET(`/management/clusters/${clusterID}/config`);
};

/**
 * 클러스터 config를 수정하는 함수
 * @param {number} clusterID
 * @param {object} config
 * @returns
 */
export const _modifyClusterConfig = async (clusterID: number, config: OpenStackClusterConfig) => {
    return await PATCH(`/management/clusters/${clusterID}/config`, { config });
};

/**
 * 클러스터 서비스 정보를 수정하는 함수
 */
export const _modifyClusterException = async (clusterID: number, exception: ClusterStatus) => {
    return await POST(`/management/clusters/${clusterID}/sync-exception`, exception);
};

/**
 * 인스턴스 사용자 스크립트 조회 함수
 * @param clusterID
 * @param instanceID
 */
export const _getInstanceScript = async (clusterID: number, instanceID: number) => {
    return await GET(`/management/clusters/${clusterID}/user-scripts/${instanceID}`);
};

/**
 * 인스턴스 사용자 스크립트 수정하는 함수
 */
export const _modifyInstanceScript = async (clusterID: number, instanceID: number, script: string) => {
    return await PATCH(`/management/clusters/${clusterID}/user-scripts/${instanceID}`, { user_data: btoa(script) });
};
