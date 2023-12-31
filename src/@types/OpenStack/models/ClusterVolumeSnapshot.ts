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
/**
 * 클러스터 볼륨 스냅샷
 * @export
 * @interface ClusterVolumeSnapshot
 */
export interface ClusterVolumeSnapshot {
    /**
     * 클러스터 볼륨 스냅샷의 ID
     * @type {number}
     * @memberof ClusterVolumeSnapshot
     */
    id?: number;
    /**
     * 클러스터에서의 볼륨 스냅샷 ID
     * @type {string}
     * @memberof ClusterVolumeSnapshot
     */
    uuid?: string;
    /**
     * 클러스터에서의 볼륨 그룹 스냅샷 ID
     * @type {string}
     * @memberof ClusterVolumeSnapshot
     */
    cluster_volume_group_snapshot_uuid?: string;
    /**
     * 클러스터 볼륨 스냅샷의 이름
     * @type {string}
     * @memberof ClusterVolumeSnapshot
     */
    name?: string;
    /**
     * 클러스터 볼륨 스냅샷의 설명
     * @type {string}
     * @memberof ClusterVolumeSnapshot
     */
    description?: string;
    /**
     * 클러스터 볼륨 스냅샷의 용량
     * @type {number}
     * @memberof ClusterVolumeSnapshot
     */
    size_bytes?: number;
    /**
     * 볼륨 스냅샷 상태
     * @type {string}
     * @memberof ClusterVolumeSnapshot
     */
    status?: ClusterVolumeSnapshotStatusEnum;
    /**
     * 클러스터 볼륨 스냅샷 생성 일시 (Timestamp)
     * @type {number}
     * @memberof ClusterVolumeSnapshot
     */
    created_at?: number;
}


/**
 * @export
 */
export const ClusterVolumeSnapshotStatusEnum = {
    available: 'available',
    error: 'error',
    creating: 'creating',
    deleting: 'deleting',
    error_deleting: 'error_deleting'
} as const;
export type ClusterVolumeSnapshotStatusEnum = typeof ClusterVolumeSnapshotStatusEnum[keyof typeof ClusterVolumeSnapshotStatusEnum];


/**
 * Check if a given object implements the ClusterVolumeSnapshot interface.
 */
export function instanceOfClusterVolumeSnapshot(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ClusterVolumeSnapshotFromJSON(json: any): ClusterVolumeSnapshot {
    return ClusterVolumeSnapshotFromJSONTyped(json, false);
}

export function ClusterVolumeSnapshotFromJSONTyped(json: any, ignoreDiscriminator: boolean): ClusterVolumeSnapshot {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'uuid': !exists(json, 'uuid') ? undefined : json['uuid'],
        'cluster_volume_group_snapshot_uuid': !exists(json, 'cluster_volume_group_snapshot_uuid') ? undefined : json['cluster_volume_group_snapshot_uuid'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'size_bytes': !exists(json, 'size_bytes') ? undefined : json['size_bytes'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'created_at': !exists(json, 'created_at') ? undefined : json['created_at'],
    };
}

export function ClusterVolumeSnapshotToJSON(value?: ClusterVolumeSnapshot | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'uuid': value.uuid,
        'cluster_volume_group_snapshot_uuid': value.cluster_volume_group_snapshot_uuid,
        'name': value.name,
        'description': value.description,
        'size_bytes': value.size_bytes,
        'status': value.status,
        'created_at': value.created_at,
    };
}

