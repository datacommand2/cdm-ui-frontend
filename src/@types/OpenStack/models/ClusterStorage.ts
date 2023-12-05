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

/**
 * 클러스터 볼륨타입
 * @export
 * @interface ClusterStorage
 */
export interface ClusterStorage {
    /**
     * 클러스터 볼륨타입의 ID
     * @type {number}
     * @memberof ClusterStorage
     */
    id?: number;
    /**
     * 
     * @type {Cluster}
     * @memberof ClusterStorage
     */
    cluster?: Cluster;
    /**
     * 클러스터에서의 볼륨타입 ID
     * @type {string}
     * @memberof ClusterStorage
     */
    uuid?: string;
    /**
     * 클러스터 볼륨타입의 이름
     * @type {string}
     * @memberof ClusterStorage
     */
    name?: string;
    /**
     * 클러스터 볼륨타입의 설명
     * @type {string}
     * @memberof ClusterStorage
     */
    description?: string;
    /**
     * 클러스터 볼륨타입의 종류
     * @type {string}
     * @memberof ClusterStorage
     */
    type_code?: ClusterStorageTypeCodeEnum;
    /**
     * 클러스터 볼륨타입의 용량
     * @type {number}
     * @memberof ClusterStorage
     */
    capacity_bytes?: number;
    /**
     * 클러스터 볼륨타입의 사용량
     * @type {number}
     * @memberof ClusterStorage
     */
    used_bytes?: number;
}


/**
 * @export
 */
export const ClusterStorageTypeCodeEnum = {
    lvm: 'openstack.storage.type.lvm',
    nfs: 'openstack.storage.type.nfs',
    ceph: 'openstack.storage.type.ceph'
} as const;
export type ClusterStorageTypeCodeEnum = typeof ClusterStorageTypeCodeEnum[keyof typeof ClusterStorageTypeCodeEnum];


/**
 * Check if a given object implements the ClusterStorage interface.
 */
export function instanceOfClusterStorage(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ClusterStorageFromJSON(json: any): ClusterStorage {
    return ClusterStorageFromJSONTyped(json, false);
}

export function ClusterStorageFromJSONTyped(json: any, ignoreDiscriminator: boolean): ClusterStorage {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'cluster': !exists(json, 'cluster') ? undefined : ClusterFromJSON(json['cluster']),
        'uuid': !exists(json, 'uuid') ? undefined : json['uuid'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'type_code': !exists(json, 'type_code') ? undefined : json['type_code'],
        'capacity_bytes': !exists(json, 'capacity_bytes') ? undefined : json['capacity_bytes'],
        'used_bytes': !exists(json, 'used_bytes') ? undefined : json['used_bytes'],
    };
}

export function ClusterStorageToJSON(value?: ClusterStorage | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'cluster': ClusterToJSON(value.cluster),
        'uuid': value.uuid,
        'name': value.name,
        'description': value.description,
        'type_code': value.type_code,
        'capacity_bytes': value.capacity_bytes,
        'used_bytes': value.used_bytes,
    };
}
