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
import type { ProtectionGroup } from './ProtectionGroup';
import {
    ProtectionGroupFromJSON,
    ProtectionGroupFromJSONTyped,
    ProtectionGroupToJSON,
} from './ProtectionGroup';
import type { ProtectionGroupSnapshot } from './ProtectionGroupSnapshot';
import {
    ProtectionGroupSnapshotFromJSON,
    ProtectionGroupSnapshotFromJSONTyped,
    ProtectionGroupSnapshotToJSON,
} from './ProtectionGroupSnapshot';
import type { RecoveryPlan } from './RecoveryPlan';
import {
    RecoveryPlanFromJSON,
    RecoveryPlanFromJSONTyped,
    RecoveryPlanToJSON,
} from './RecoveryPlan';
import type { Schedule } from './Schedule';
import {
    ScheduleFromJSON,
    ScheduleFromJSONTyped,
    ScheduleToJSON,
} from './Schedule';
import type { User } from './User';
import {
    UserFromJSON,
    UserFromJSONTyped,
    UserToJSON,
} from './User';

/**
 * 
 * @export
 * @interface RecoveryGroupsGroupIdJobsGet200ResponseJobsInner
 */
export interface RecoveryGroupsGroupIdJobsGet200ResponseJobsInner {
    /**
     * 
     * @type {User}
     * @memberof RecoveryGroupsGroupIdJobsGet200ResponseJobsInner
     */
    operator?: User;
    /**
     * 재해복구작업 ID
     * @type {number}
     * @memberof RecoveryGroupsGroupIdJobsGet200ResponseJobsInner
     */
    id?: number;
    /**
     * 
     * @type {ProtectionGroup}
     * @memberof RecoveryGroupsGroupIdJobsGet200ResponseJobsInner
     */
    group?: ProtectionGroup;
    /**
     * 
     * @type {RecoveryPlan}
     * @memberof RecoveryGroupsGroupIdJobsGet200ResponseJobsInner
     */
    plan?: RecoveryPlan;
    /**
     * 복구 유형
     * @type {string}
     * @memberof RecoveryGroupsGroupIdJobsGet200ResponseJobsInner
     */
    type_code?: RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerTypeCodeEnum;
    /**
     * 데이터 시점 유형
     * @type {string}
     * @memberof RecoveryGroupsGroupIdJobsGet200ResponseJobsInner
     */
    recovery_point_type_code?: RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerRecoveryPointTypeCodeEnum;
    /**
     * 
     * @type {ProtectionGroupSnapshot}
     * @memberof RecoveryGroupsGroupIdJobsGet200ResponseJobsInner
     */
    recovery_point_snapshot?: ProtectionGroupSnapshot;
    /**
     * 
     * @type {Schedule}
     * @memberof RecoveryGroupsGroupIdJobsGet200ResponseJobsInner
     */
    schedule?: Schedule;
    /**
     * 실행 예정시간
     * @type {number}
     * @memberof RecoveryGroupsGroupIdJobsGet200ResponseJobsInner
     */
    next_runtime?: number;
    /**
     * Operation
     * @type {string}
     * @memberof RecoveryGroupsGroupIdJobsGet200ResponseJobsInner
     */
    operation_code?: RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerOperationCodeEnum;
    /**
     * 작업 상태
     * @type {string}
     * @memberof RecoveryGroupsGroupIdJobsGet200ResponseJobsInner
     */
    state_code?: RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerStateCodeEnum;
    /**
     * 작업 생성일시
     * @type {number}
     * @memberof RecoveryGroupsGroupIdJobsGet200ResponseJobsInner
     */
    created_at?: number;
    /**
     * 작업 수정일시
     * @type {number}
     * @memberof RecoveryGroupsGroupIdJobsGet200ResponseJobsInner
     */
    updated_at?: number;
}


/**
 * @export
 */
export const RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerTypeCodeEnum = {
    simulation: 'dr.recovery.type.simulation',
    migration: 'dr.recovery.type.migration'
} as const;
export type RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerTypeCodeEnum = typeof RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerTypeCodeEnum[keyof typeof RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerTypeCodeEnum];

/**
 * @export
 */
export const RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerRecoveryPointTypeCodeEnum = {
    latest: 'dr.recovery.recovery_point.type.latest',
    latest_snapshot: 'dr.recovery.recovery_point.type.latest_snapshot',
    snapshot: 'dr.recovery.recovery_point.type.snapshot'
} as const;
export type RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerRecoveryPointTypeCodeEnum = typeof RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerRecoveryPointTypeCodeEnum[keyof typeof RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerRecoveryPointTypeCodeEnum];

/**
 * @export
 */
export const RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerOperationCodeEnum = {
    run: 'run',
    pause: 'pause',
    cancel: 'cancel',
    retry: 'retry',
    rollback: 'rollback',
    retry_rollback: 'retry-rollback',
    ignore_rollback: 'ignore-rollback',
    confirm: 'confirm',
    retry_confirm: 'retry-confirm',
    cancel_confirm: 'cancel-confirm'
} as const;
export type RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerOperationCodeEnum = typeof RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerOperationCodeEnum[keyof typeof RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerOperationCodeEnum];

/**
 * @export
 */
export const RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerStateCodeEnum = {
    waiting: 'dr.recovery.job.state.waiting',
    pending: 'dr.recovery.job.state.pending',
    running: 'dr.recovery.job.state.running',
    canceling: 'dr.recovery.job.state.canceling',
    paused: 'dr.recovery.job.state.paused',
    completed: 'dr.recovery.job.state.completed',
    clearing: 'dr.recovery.job.state.clearing',
    clear_failed: 'dr.recovery.job.state.clear-failed',
    reporting: 'dr.recovery.job.state.reporting',
    finished: 'dr.recovery.job.state.finished'
} as const;
export type RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerStateCodeEnum = typeof RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerStateCodeEnum[keyof typeof RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerStateCodeEnum];


/**
 * Check if a given object implements the RecoveryGroupsGroupIdJobsGet200ResponseJobsInner interface.
 */
export function instanceOfRecoveryGroupsGroupIdJobsGet200ResponseJobsInner(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerFromJSON(json: any): RecoveryGroupsGroupIdJobsGet200ResponseJobsInner {
    return RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerFromJSONTyped(json, false);
}

export function RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryGroupsGroupIdJobsGet200ResponseJobsInner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'operator': !exists(json, 'operator') ? undefined : UserFromJSON(json['operator']),
        'id': !exists(json, 'id') ? undefined : json['id'],
        'group': !exists(json, 'group') ? undefined : ProtectionGroupFromJSON(json['group']),
        'plan': !exists(json, 'plan') ? undefined : RecoveryPlanFromJSON(json['plan']),
        'type_code': !exists(json, 'type_code') ? undefined : json['type_code'],
        'recovery_point_type_code': !exists(json, 'recovery_point_type_code') ? undefined : json['recovery_point_type_code'],
        'recovery_point_snapshot': !exists(json, 'recovery_point_snapshot') ? undefined : ProtectionGroupSnapshotFromJSON(json['recovery_point_snapshot']),
        'schedule': !exists(json, 'schedule') ? undefined : ScheduleFromJSON(json['schedule']),
        'next_runtime': !exists(json, 'next_runtime') ? undefined : json['next_runtime'],
        'operation_code': !exists(json, 'operation_code') ? undefined : json['operation_code'],
        'state_code': !exists(json, 'state_code') ? undefined : json['state_code'],
        'created_at': !exists(json, 'created_at') ? undefined : json['created_at'],
        'updated_at': !exists(json, 'updated_at') ? undefined : json['updated_at'],
    };
}

export function RecoveryGroupsGroupIdJobsGet200ResponseJobsInnerToJSON(value?: RecoveryGroupsGroupIdJobsGet200ResponseJobsInner | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'operator': UserToJSON(value.operator),
        'id': value.id,
        'group': ProtectionGroupToJSON(value.group),
        'plan': RecoveryPlanToJSON(value.plan),
        'type_code': value.type_code,
        'recovery_point_type_code': value.recovery_point_type_code,
        'recovery_point_snapshot': ProtectionGroupSnapshotToJSON(value.recovery_point_snapshot),
        'schedule': ScheduleToJSON(value.schedule),
        'next_runtime': value.next_runtime,
        'operation_code': value.operation_code,
        'state_code': value.state_code,
        'created_at': value.created_at,
        'updated_at': value.updated_at,
    };
}

