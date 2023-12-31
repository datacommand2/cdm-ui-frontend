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
import type { ClusterInstance } from './ClusterInstance';
import {
    ClusterInstanceFromJSON,
    ClusterInstanceFromJSONTyped,
    ClusterInstanceToJSON,
} from './ClusterInstance';
import type { Message } from './Message';
import {
    MessageFromJSON,
    MessageFromJSONTyped,
    MessageToJSON,
} from './Message';

/**
 * 인스턴스 복구 상태
 * @export
 * @interface RecoveryJobInstanceStatus
 */
export interface RecoveryJobInstanceStatus {
    /**
     * 
     * @type {ClusterInstance}
     * @memberof RecoveryJobInstanceStatus
     */
    instance?: ClusterInstance;
    /**
     * 데이터 시점 유형
     * @type {string}
     * @memberof RecoveryJobInstanceStatus
     */
    recovery_point_type_code?: RecoveryJobInstanceStatusRecoveryPointTypeCodeEnum;
    /**
     * 복구 데이터 시점
     * @type {number}
     * @memberof RecoveryJobInstanceStatus
     */
    recovery_point?: number;
    /**
     * 복구 시작 일시
     * @type {number}
     * @memberof RecoveryJobInstanceStatus
     */
    started_at?: number;
    /**
     * 복구 종료 일시
     * @type {number}
     * @memberof RecoveryJobInstanceStatus
     */
    finished_at?: number;
    /**
     * 복구 상태
     * @type {string}
     * @memberof RecoveryJobInstanceStatus
     */
    state_code?: RecoveryJobInstanceStatusStateCodeEnum;
    /**
     * 복구 결과
     * @type {string}
     * @memberof RecoveryJobInstanceStatus
     */
    result_code?: RecoveryJobInstanceStatusResultCodeEnum;
    /**
     * 복구, 롤백 상태
     * @type {string}
     * @memberof RecoveryJobInstanceStatus
     */
    type_code?: RecoveryJobInstanceStatusTypeCodeEnum;
    /**
     * 
     * @type {Message}
     * @memberof RecoveryJobInstanceStatus
     */
    failed_reason?: Message;
}


/**
 * @export
 */
export const RecoveryJobInstanceStatusRecoveryPointTypeCodeEnum = {
    latest: 'dr.recovery.recovery_point.type.latest',
    latest_snapshot: 'dr.recovery.recovery_point.type.latest_snapshot',
    snapshot: 'dr.recovery.recovery_point.type.snapshot'
} as const;
export type RecoveryJobInstanceStatusRecoveryPointTypeCodeEnum = typeof RecoveryJobInstanceStatusRecoveryPointTypeCodeEnum[keyof typeof RecoveryJobInstanceStatusRecoveryPointTypeCodeEnum];

/**
 * @export
 */
export const RecoveryJobInstanceStatusStateCodeEnum = {
    excepted: 'dr.recovery.job.instance.state.excepted',
    ignored: 'dr.recovery.job.instance.state.ignored',
    preparing: 'dr.recovery.job.instance.state.preparing',
    ready: 'dr.recovery.job.instance.state.ready',
    booting: 'dr.recovery.job.instance.state.booting',
    diagnosing: 'dr.recovery.job.instance.state.diagnosing',
    success: 'dr.recovery.job.instance.state.success',
    failed: 'dr.recovery.job.instance.state.failed'
} as const;
export type RecoveryJobInstanceStatusStateCodeEnum = typeof RecoveryJobInstanceStatusStateCodeEnum[keyof typeof RecoveryJobInstanceStatusStateCodeEnum];

/**
 * @export
 */
export const RecoveryJobInstanceStatusResultCodeEnum = {
    success: 'dr.recovery.instance.result.success',
    failed: 'dr.recovery.instance.result.failed',
    canceled: 'dr.recovery.instance.result.canceled'
} as const;
export type RecoveryJobInstanceStatusResultCodeEnum = typeof RecoveryJobInstanceStatusResultCodeEnum[keyof typeof RecoveryJobInstanceStatusResultCodeEnum];

/**
 * @export
 */
export const RecoveryJobInstanceStatusTypeCodeEnum = {
    create: 'dr.migration.task.create',
    delete: 'dr.migration.task.delete'
} as const;
export type RecoveryJobInstanceStatusTypeCodeEnum = typeof RecoveryJobInstanceStatusTypeCodeEnum[keyof typeof RecoveryJobInstanceStatusTypeCodeEnum];


/**
 * Check if a given object implements the RecoveryJobInstanceStatus interface.
 */
export function instanceOfRecoveryJobInstanceStatus(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryJobInstanceStatusFromJSON(json: any): RecoveryJobInstanceStatus {
    return RecoveryJobInstanceStatusFromJSONTyped(json, false);
}

export function RecoveryJobInstanceStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryJobInstanceStatus {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'instance': !exists(json, 'instance') ? undefined : ClusterInstanceFromJSON(json['instance']),
        'recovery_point_type_code': !exists(json, 'recovery_point_type_code') ? undefined : json['recovery_point_type_code'],
        'recovery_point': !exists(json, 'recovery_point') ? undefined : json['recovery_point'],
        'started_at': !exists(json, 'started_at') ? undefined : json['started_at'],
        'finished_at': !exists(json, 'finished_at') ? undefined : json['finished_at'],
        'state_code': !exists(json, 'state_code') ? undefined : json['state_code'],
        'result_code': !exists(json, 'result_code') ? undefined : json['result_code'],
        'type_code': !exists(json, 'type_code') ? undefined : json['type_code'],
        'failed_reason': !exists(json, 'failed_reason') ? undefined : MessageFromJSON(json['failed_reason']),
    };
}

export function RecoveryJobInstanceStatusToJSON(value?: RecoveryJobInstanceStatus | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'instance': ClusterInstanceToJSON(value.instance),
        'recovery_point_type_code': value.recovery_point_type_code,
        'recovery_point': value.recovery_point,
        'started_at': value.started_at,
        'finished_at': value.finished_at,
        'state_code': value.state_code,
        'result_code': value.result_code,
        'type_code': value.type_code,
        'failed_reason': MessageToJSON(value.failed_reason),
    };
}

