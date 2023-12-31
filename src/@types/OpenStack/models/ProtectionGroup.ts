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
import type { AbnormalStateReasons } from './AbnormalStateReasons';
import {
    AbnormalStateReasonsFromJSON,
    AbnormalStateReasonsFromJSONTyped,
    AbnormalStateReasonsToJSON,
} from './AbnormalStateReasons';
import type { Cluster } from './Cluster';
import {
    ClusterFromJSON,
    ClusterFromJSONTyped,
    ClusterToJSON,
} from './Cluster';
import type { ClusterInstance } from './ClusterInstance';
import {
    ClusterInstanceFromJSON,
    ClusterInstanceFromJSONTyped,
    ClusterInstanceToJSON,
} from './ClusterInstance';
import type { UserGroup } from './UserGroup';
import {
    UserGroupFromJSON,
    UserGroupFromJSONTyped,
    UserGroupToJSON,
} from './UserGroup';

/**
 * 보호그룹
 * @export
 * @interface ProtectionGroup
 */
export interface ProtectionGroup {
    /**
     * 보호그룹 ID
     * @type {number}
     * @memberof ProtectionGroup
     */
    id?: number;
    /**
     * 
     * @type {UserGroup}
     * @memberof ProtectionGroup
     */
    owner_group?: UserGroup;
    /**
     * 
     * @type {Cluster}
     * @memberof ProtectionGroup
     */
    protection_cluster?: Cluster;
    /**
     * 보호그룹 이름
     * @type {string}
     * @memberof ProtectionGroup
     */
    name?: string;
    /**
     * 보호그룹 설명
     * @type {string}
     * @memberof ProtectionGroup
     */
    remarks?: string;
    /**
     * 목표복구시점 시간 단위
     * @type {string}
     * @memberof ProtectionGroup
     */
    recovery_point_objective_type?: ProtectionGroupRecoveryPointObjectiveTypeEnum;
    /**
     * 목표복구시점
     * @type {number}
     * @memberof ProtectionGroup
     */
    recovery_point_objective?: number;
    /**
     * 목표복구시간 (min)
     * @type {number}
     * @memberof ProtectionGroup
     */
    recovery_time_objective?: number;
    /**
     * 스냅샷 생성주기 시간 단위
     * @type {string}
     * @memberof ProtectionGroup
     */
    snapshot_interval_type?: ProtectionGroupSnapshotIntervalTypeEnum;
    /**
     * 스냅샷 생성주기 (recovery_point_objective 보다 크면 안됨)
     * @type {number}
     * @memberof ProtectionGroup
     */
    snapshot_interval?: number;
    /**
     * 보호그룹 상태
     * @type {string}
     * @memberof ProtectionGroup
     */
    state_code?: ProtectionGroupStateCodeEnum;
    /**
     * 
     * @type {AbnormalStateReasons}
     * @memberof ProtectionGroup
     */
    abnormal_state_reasons?: AbnormalStateReasons;
    /**
     * 복구대상 인스턴스 목록
     * @type {Array<ClusterInstance>}
     * @memberof ProtectionGroup
     */
    instances?: Array<ClusterInstance>;
    /**
     * 보호그룹 생성일시 (timestamp)
     * @type {number}
     * @memberof ProtectionGroup
     */
    created_at?: number;
    /**
     * 보호그룹 최종 수정일시 (timestamp)
     * @type {number}
     * @memberof ProtectionGroup
     */
    updated_at?: number;
    /**
     * 수정가능 여부
     * @type {boolean}
     * @memberof ProtectionGroup
     */
    updatable?: boolean;
}


/**
 * @export
 */
export const ProtectionGroupRecoveryPointObjectiveTypeEnum = {
    minute: 'recovery.point.objective.type.minute',
    hour: 'recovery.point.objective.type.hour',
    day: 'recovery.point.objective.type.day'
} as const;
export type ProtectionGroupRecoveryPointObjectiveTypeEnum = typeof ProtectionGroupRecoveryPointObjectiveTypeEnum[keyof typeof ProtectionGroupRecoveryPointObjectiveTypeEnum];

/**
 * @export
 */
export const ProtectionGroupSnapshotIntervalTypeEnum = {
    minutely: 'snapshot.interval.type.minutely',
    hourly: 'snapshot.interval.type.hourly',
    daily: 'snapshot.interval.type.daily'
} as const;
export type ProtectionGroupSnapshotIntervalTypeEnum = typeof ProtectionGroupSnapshotIntervalTypeEnum[keyof typeof ProtectionGroupSnapshotIntervalTypeEnum];

/**
 * @export
 */
export const ProtectionGroupStateCodeEnum = {
    normal: 'dr.protection.group.state.normal',
    warning: 'dr.protection.group.state.warning',
    critical: 'dr.protection.group.state.critical',
    emergency: 'dr.protection.group.state.emergency'
} as const;
export type ProtectionGroupStateCodeEnum = typeof ProtectionGroupStateCodeEnum[keyof typeof ProtectionGroupStateCodeEnum];


/**
 * Check if a given object implements the ProtectionGroup interface.
 */
export function instanceOfProtectionGroup(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ProtectionGroupFromJSON(json: any): ProtectionGroup {
    return ProtectionGroupFromJSONTyped(json, false);
}

export function ProtectionGroupFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProtectionGroup {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'owner_group': !exists(json, 'owner_group') ? undefined : UserGroupFromJSON(json['owner_group']),
        'protection_cluster': !exists(json, 'protection_cluster') ? undefined : ClusterFromJSON(json['protection_cluster']),
        'name': !exists(json, 'name') ? undefined : json['name'],
        'remarks': !exists(json, 'remarks') ? undefined : json['remarks'],
        'recovery_point_objective_type': !exists(json, 'recovery_point_objective_type') ? undefined : json['recovery_point_objective_type'],
        'recovery_point_objective': !exists(json, 'recovery_point_objective') ? undefined : json['recovery_point_objective'],
        'recovery_time_objective': !exists(json, 'recovery_time_objective') ? undefined : json['recovery_time_objective'],
        'snapshot_interval_type': !exists(json, 'snapshot_interval_type') ? undefined : json['snapshot_interval_type'],
        'snapshot_interval': !exists(json, 'snapshot_interval') ? undefined : json['snapshot_interval'],
        'state_code': !exists(json, 'state_code') ? undefined : json['state_code'],
        'abnormal_state_reasons': !exists(json, 'abnormal_state_reasons') ? undefined : AbnormalStateReasonsFromJSON(json['abnormal_state_reasons']),
        'instances': !exists(json, 'instances') ? undefined : ((json['instances'] as Array<any>).map(ClusterInstanceFromJSON)),
        'created_at': !exists(json, 'created_at') ? undefined : json['created_at'],
        'updated_at': !exists(json, 'updated_at') ? undefined : json['updated_at'],
        'updatable': !exists(json, 'updatable') ? undefined : json['updatable'],
    };
}

export function ProtectionGroupToJSON(value?: ProtectionGroup | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'owner_group': UserGroupToJSON(value.owner_group),
        'protection_cluster': ClusterToJSON(value.protection_cluster),
        'name': value.name,
        'remarks': value.remarks,
        'recovery_point_objective_type': value.recovery_point_objective_type,
        'recovery_point_objective': value.recovery_point_objective,
        'recovery_time_objective': value.recovery_time_objective,
        'snapshot_interval_type': value.snapshot_interval_type,
        'snapshot_interval': value.snapshot_interval,
        'state_code': value.state_code,
        'abnormal_state_reasons': AbnormalStateReasonsToJSON(value.abnormal_state_reasons),
        'instances': value.instances === undefined ? undefined : ((value.instances as Array<any>).map(ClusterInstanceToJSON)),
        'created_at': value.created_at,
        'updated_at': value.updated_at,
        'updatable': value.updatable,
    };
}

