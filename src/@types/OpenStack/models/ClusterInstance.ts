/* tslint:disable */
/* eslint-disable */
/**
 * CDM-DisasterRecovery
 * 설명추가
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { Cluster } from './Cluster';
import {
    ClusterFromJSON,
    ClusterFromJSONTyped,
    ClusterToJSON,
} from './Cluster';
import type { ClusterAvailabilityZone } from './ClusterAvailabilityZone';
import {
    ClusterAvailabilityZoneFromJSON,
    ClusterAvailabilityZoneFromJSONTyped,
    ClusterAvailabilityZoneToJSON,
} from './ClusterAvailabilityZone';
import type { ClusterHypervisor } from './ClusterHypervisor';
import {
    ClusterHypervisorFromJSON,
    ClusterHypervisorFromJSONTyped,
    ClusterHypervisorToJSON,
} from './ClusterHypervisor';
import type { ClusterInstanceNetwork } from './ClusterInstanceNetwork';
import {
    ClusterInstanceNetworkFromJSON,
    ClusterInstanceNetworkFromJSONTyped,
    ClusterInstanceNetworkToJSON,
} from './ClusterInstanceNetwork';
import type { ClusterInstanceSecurityGroupsInner } from './ClusterInstanceSecurityGroupsInner';
import {
    ClusterInstanceSecurityGroupsInnerFromJSON,
    ClusterInstanceSecurityGroupsInnerFromJSONTyped,
    ClusterInstanceSecurityGroupsInnerToJSON,
} from './ClusterInstanceSecurityGroupsInner';
import type { ClusterInstanceSpec } from './ClusterInstanceSpec';
import {
    ClusterInstanceSpecFromJSON,
    ClusterInstanceSpecFromJSONTyped,
    ClusterInstanceSpecToJSON,
} from './ClusterInstanceSpec';
import type { ClusterInstanceVolume } from './ClusterInstanceVolume';
import {
    ClusterInstanceVolumeFromJSON,
    ClusterInstanceVolumeFromJSONTyped,
    ClusterInstanceVolumeToJSON,
} from './ClusterInstanceVolume';
import type { ClusterKeyPair } from './ClusterKeyPair';
import {
    ClusterKeyPairFromJSON,
    ClusterKeyPairFromJSONTyped,
    ClusterKeyPairToJSON,
} from './ClusterKeyPair';
import type { ClusterRouter } from './ClusterRouter';
import {
    ClusterRouterFromJSON,
    ClusterRouterFromJSONTyped,
    ClusterRouterToJSON,
} from './ClusterRouter';
import type { ClusterTenant } from './ClusterTenant';
import {
    ClusterTenantFromJSON,
    ClusterTenantFromJSONTyped,
    ClusterTenantToJSON,
} from './ClusterTenant';

/**
 * 클러스터 인스턴스
 * @export
 * @interface ClusterInstance
 */
export interface ClusterInstance {
    /**
     * 클러스터 인스턴스의 ID
     * @type {number}
     * @memberof ClusterInstance
     */
    id?: number;
    /**
     * 
     * @type {Cluster}
     * @memberof ClusterInstance
     */
    cluster?: Cluster;
    /**
     * 
     * @type {ClusterTenant}
     * @memberof ClusterInstance
     */
    tenant?: ClusterTenant;
    /**
     * 
     * @type {ClusterAvailabilityZone}
     * @memberof ClusterInstance
     */
    availability_zone?: ClusterAvailabilityZone;
    /**
     * 
     * @type {ClusterHypervisor}
     * @memberof ClusterInstance
     */
    hypervisor?: ClusterHypervisor;
    /**
     * 클러스터에서의 인스턴스 ID
     * @type {string}
     * @memberof ClusterInstance
     */
    uuid?: string;
    /**
     * 클러스터 인스턴스의 이름
     * @type {string}
     * @memberof ClusterInstance
     */
    name?: string;
    /**
     * 클러스터 인스턴스의 설명
     * @type {string}
     * @memberof ClusterInstance
     */
    description?: string;
    /**
     * 인스턴스 상태
     * - ACTIVE: The server is active.
     * - BUILD: The server has not yet finished the original build process.
     * - DELETED: The server is deleted.
     * - ERROR: The server is in error.
     * - HARD_REBOOT: The server is hard rebooting. This is equivalent to pulling the power plug on a physical server, plugging it back in, and rebooting it.
     * - MIGRATING: The server is migrating. This is caused by a live migration (moving a server that is active) action.
     * - PASSWORD: The password is being reset on the server.
     * - PAUSED: The server is paused.
     * - REBOOT: The server is in a soft reboot state. A reboot command was passed to the operating system.
     * - REBUILD: The server is currently being rebuilt from an image.
     * - RESCUE: The server is in rescue mode.
     * - RESIZE: Server is performing the differential copy of data that changed during its initial copy. Server is down for this stage.
     * - REVERT_RESIZE: The resize or migration of a server failed for some reason. The destination server is being cleaned up and the original source server is restarting.
     * - SHELVED: The server is in shelved state. Depends on the shelve offload time, the server will be automatically shelved off loaded.
     * - SHELVED_OFFLOADED: The shelved server is offloaded (removed from the compute host) and it needs unshelved action to be used again.
     * - SHUTOFF: The server was powered down by the user, either through the OpenStack Compute API or from within the server. For example, the user issued a shutdown -h command from within the server. If the OpenStack Compute manager detects that the VM was powered down, it transitions the server to the SHUTOFF status.
     * - SOFT_DELETED: The server is marked as deleted but will remain in the cloud for some configurable amount of time. While soft-deleted, an authorized user can restore the server back to normal state. When the time expires, the server will be deleted permanently.
     * - SUSPENDED: The server is suspended, either by request or necessity. See the feature support matrix for supported compute drivers. When you suspend a server, its state is stored on disk, all memory is written to disk, and the server is stopped. Suspending a server is similar to placing a device in hibernation and its occupied resource will not be freed but rather kept for when the server is resumed. If an instance is infrequently used and the occupied resource needs to be freed to create other servers, it should be shelved.
     * - UNKNOWN: The state of the server is unknown. It could be because a part of the infrastructure is temporarily down (see Handling Down Cells for more information). Contact your cloud provider.
     * - VERIFY_RESIZE: System is awaiting confirmation that the server is operational after a move or resize.
     * 
     * @type {string}
     * @memberof ClusterInstance
     */
    status?: ClusterInstanceStatusEnum;
    /**
     * 인스턴스 전원 상태
     * - 0: NOSTATE
     * - 1: RUNNING
     * - 3: PAUSED
     * - 4: SHUTDOWN
     * - 6: CRASHED
     * - 7: SUSPENDED
     * 
     * @type {string}
     * @memberof ClusterInstance
     */
    state?: ClusterInstanceStateEnum;
    /**
     * 
     * @type {ClusterKeyPair}
     * @memberof ClusterInstance
     */
    keypair?: ClusterKeyPair;
    /**
     * 
     * @type {ClusterInstanceSpec}
     * @memberof ClusterInstance
     */
    spec?: ClusterInstanceSpec;
    /**
     * 인스턴스의 네트워크 목록
     * @type {Array<ClusterInstanceNetwork>}
     * @memberof ClusterInstance
     */
    networks?: Array<ClusterInstanceNetwork>;
    /**
     * 인스턴스의 네트워크들과 연결된 라우터 목록
     * @type {Array<ClusterRouter>}
     * @memberof ClusterInstance
     */
    routers?: Array<ClusterRouter>;
    /**
     * 인스턴스의 보안그룹 목록
     * @type {Array<ClusterInstanceSecurityGroupsInner>}
     * @memberof ClusterInstance
     */
    security_groups?: Array<ClusterInstanceSecurityGroupsInner>;
    /**
     * 인스턴스의 볼륨 목록
     * @type {Array<ClusterInstanceVolume>}
     * @memberof ClusterInstance
     */
    volumes?: Array<ClusterInstanceVolume>;
}


/**
 * @export
 */
export const ClusterInstanceStatusEnum = {
    active: 'ACTIVE',
    build: 'BUILD',
    deleted: 'DELETED',
    error: 'ERROR',
    hard_reboot: 'HARD_REBOOT',
    migrating: 'MIGRATING',
    password: 'PASSWORD',
    paused: 'PAUSED',
    reboot: 'REBOOT',
    rebuild: 'REBUILD',
    rescue: 'RESCUE',
    resize: 'RESIZE',
    revert_resize: 'REVERT_RESIZE',
    shelved: 'SHELVED',
    shelved_offloaded: 'SHELVED_OFFLOADED',
    shutoff: 'SHUTOFF',
    soft_deleted: 'SOFT_DELETED',
    suspended: 'SUSPENDED',
    unknown: 'UNKNOWN',
    verify_resize: 'VERIFY_RESIZE'
} as const;
export type ClusterInstanceStatusEnum = typeof ClusterInstanceStatusEnum[keyof typeof ClusterInstanceStatusEnum];

/**
 * @export
 */
export const ClusterInstanceStateEnum = {
    _0: '0',
    _1: '1',
    _3: '3',
    _4: '4',
    _6: '6',
    _7: '7'
} as const;
export type ClusterInstanceStateEnum = typeof ClusterInstanceStateEnum[keyof typeof ClusterInstanceStateEnum];


/**
 * Check if a given object implements the ClusterInstance interface.
 */
export function instanceOfClusterInstance(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ClusterInstanceFromJSON(json: any): ClusterInstance {
    return ClusterInstanceFromJSONTyped(json, false);
}

export function ClusterInstanceFromJSONTyped(json: any, ignoreDiscriminator: boolean): ClusterInstance {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'cluster': !exists(json, 'cluster') ? undefined : ClusterFromJSON(json['cluster']),
        'tenant': !exists(json, 'tenant') ? undefined : ClusterTenantFromJSON(json['tenant']),
        'availability_zone': !exists(json, 'availability_zone') ? undefined : ClusterAvailabilityZoneFromJSON(json['availability_zone']),
        'hypervisor': !exists(json, 'hypervisor') ? undefined : ClusterHypervisorFromJSON(json['hypervisor']),
        'uuid': !exists(json, 'uuid') ? undefined : json['uuid'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'state': !exists(json, 'state') ? undefined : json['state'],
        'keypair': !exists(json, 'keypair') ? undefined : ClusterKeyPairFromJSON(json['keypair']),
        'spec': !exists(json, 'spec') ? undefined : ClusterInstanceSpecFromJSON(json['spec']),
        'networks': !exists(json, 'networks') ? undefined : ((json['networks'] as Array<any>).map(ClusterInstanceNetworkFromJSON)),
        'routers': !exists(json, 'routers') ? undefined : ((json['routers'] as Array<any>).map(ClusterRouterFromJSON)),
        'security_groups': !exists(json, 'security_groups') ? undefined : ((json['security_groups'] as Array<any>).map(ClusterInstanceSecurityGroupsInnerFromJSON)),
        'volumes': !exists(json, 'volumes') ? undefined : ((json['volumes'] as Array<any>).map(ClusterInstanceVolumeFromJSON)),
    };
}

export function ClusterInstanceToJSON(value?: ClusterInstance | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'cluster': ClusterToJSON(value.cluster),
        'tenant': ClusterTenantToJSON(value.tenant),
        'availability_zone': ClusterAvailabilityZoneToJSON(value.availability_zone),
        'hypervisor': ClusterHypervisorToJSON(value.hypervisor),
        'uuid': value.uuid,
        'name': value.name,
        'description': value.description,
        'status': value.status,
        'state': value.state,
        'keypair': ClusterKeyPairToJSON(value.keypair),
        'spec': ClusterInstanceSpecToJSON(value.spec),
        'networks': value.networks === undefined ? undefined : ((value.networks as Array<any>).map(ClusterInstanceNetworkToJSON)),
        'routers': value.routers === undefined ? undefined : ((value.routers as Array<any>).map(ClusterRouterToJSON)),
        'security_groups': value.security_groups === undefined ? undefined : ((value.security_groups as Array<any>).map(ClusterInstanceSecurityGroupsInnerToJSON)),
        'volumes': value.volumes === undefined ? undefined : ((value.volumes as Array<any>).map(ClusterInstanceVolumeToJSON)),
    };
}
