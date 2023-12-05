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
import type { ClusterNetwork } from './ClusterNetwork';
import {
    ClusterNetworkFromJSON,
    ClusterNetworkFromJSONTyped,
    ClusterNetworkToJSON,
} from './ClusterNetwork';
import type { Message } from './Message';
import {
    MessageFromJSON,
    MessageFromJSONTyped,
    MessageToJSON,
} from './Message';

/**
 * 네트워크 복구 상태
 * @export
 * @interface RecoveryJobNetworkStatus
 */
export interface RecoveryJobNetworkStatus {
    /**
     * 
     * @type {ClusterNetwork}
     * @memberof RecoveryJobNetworkStatus
     */
    network?: ClusterNetwork;
    /**
     * 데이터 시점 유형
     * @type {string}
     * @memberof RecoveryJobNetworkStatus
     */
    recovery_point_type_code?: RecoveryJobNetworkStatusRecoveryPointTypeCodeEnum;
    /**
     * 복구 데이터 시점
     * @type {number}
     * @memberof RecoveryJobNetworkStatus
     */
    recovery_point?: number;
    /**
     * 복구 시작 일시
     * @type {number}
     * @memberof RecoveryJobNetworkStatus
     */
    started_at?: number;
    /**
     * 복구 종료 일시
     * @type {number}
     * @memberof RecoveryJobNetworkStatus
     */
    finished_at?: number;
    /**
     * 복구 상태
     * @type {string}
     * @memberof RecoveryJobNetworkStatus
     */
    state_code?: RecoveryJobNetworkStatusStateCodeEnum;
    /**
     * 복구 결과
     * @type {string}
     * @memberof RecoveryJobNetworkStatus
     */
    result_code?: RecoveryJobNetworkStatusResultCodeEnum;
    /**
     * 복구, 롤백 상태
     * @type {string}
     * @memberof RecoveryJobNetworkStatus
     */
    type_code?: RecoveryJobNetworkStatusTypeCodeEnum;
    /**
     * 
     * @type {Message}
     * @memberof RecoveryJobNetworkStatus
     */
    failed_reason?: Message;
    /**
     * 롤백 여부
     * @type {boolean}
     * @memberof RecoveryJobNetworkStatus
     */
    rollback_flag?: boolean;
}


/**
 * @export
 */
export const RecoveryJobNetworkStatusRecoveryPointTypeCodeEnum = {
    latest: 'dr.recovery.recovery_point.type.latest',
    latest_snapshot: 'dr.recovery.recovery_point.type.latest_snapshot',
    snapshot: 'dr.recovery.recovery_point.type.snapshot'
} as const;
export type RecoveryJobNetworkStatusRecoveryPointTypeCodeEnum = typeof RecoveryJobNetworkStatusRecoveryPointTypeCodeEnum[keyof typeof RecoveryJobNetworkStatusRecoveryPointTypeCodeEnum];

/**
 * @export
 */
export const RecoveryJobNetworkStatusStateCodeEnum = {
    waiting: 'waiting',
    running: 'running',
    done: 'done'
} as const;
export type RecoveryJobNetworkStatusStateCodeEnum = typeof RecoveryJobNetworkStatusStateCodeEnum[keyof typeof RecoveryJobNetworkStatusStateCodeEnum];

/**
 * @export
 */
export const RecoveryJobNetworkStatusResultCodeEnum = {
    success: 'success',
    failed: 'failed',
    excepted: 'excepted',
    ignored: 'ignored',
    canceled: 'canceled'
} as const;
export type RecoveryJobNetworkStatusResultCodeEnum = typeof RecoveryJobNetworkStatusResultCodeEnum[keyof typeof RecoveryJobNetworkStatusResultCodeEnum];

/**
 * @export
 */
export const RecoveryJobNetworkStatusTypeCodeEnum = {
    create: 'dr.migration.task.create',
    delete: 'dr.migration.task.delete'
} as const;
export type RecoveryJobNetworkStatusTypeCodeEnum = typeof RecoveryJobNetworkStatusTypeCodeEnum[keyof typeof RecoveryJobNetworkStatusTypeCodeEnum];


/**
 * Check if a given object implements the RecoveryJobNetworkStatus interface.
 */
export function instanceOfRecoveryJobNetworkStatus(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryJobNetworkStatusFromJSON(json: any): RecoveryJobNetworkStatus {
    return RecoveryJobNetworkStatusFromJSONTyped(json, false);
}

export function RecoveryJobNetworkStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryJobNetworkStatus {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'network': !exists(json, 'network') ? undefined : ClusterNetworkFromJSON(json['network']),
        'recovery_point_type_code': !exists(json, 'recovery_point_type_code') ? undefined : json['recovery_point_type_code'],
        'recovery_point': !exists(json, 'recovery_point') ? undefined : json['recovery_point'],
        'started_at': !exists(json, 'started_at') ? undefined : json['started_at'],
        'finished_at': !exists(json, 'finished_at') ? undefined : json['finished_at'],
        'state_code': !exists(json, 'state_code') ? undefined : json['state_code'],
        'result_code': !exists(json, 'result_code') ? undefined : json['result_code'],
        'type_code': !exists(json, 'type_code') ? undefined : json['type_code'],
        'failed_reason': !exists(json, 'failed_reason') ? undefined : MessageFromJSON(json['failed_reason']),
        'rollback_flag': !exists(json, 'rollback_flag') ? undefined : json['rollback_flag'],
    };
}

export function RecoveryJobNetworkStatusToJSON(value?: RecoveryJobNetworkStatus | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'network': ClusterNetworkToJSON(value.network),
        'recovery_point_type_code': value.recovery_point_type_code,
        'recovery_point': value.recovery_point,
        'started_at': value.started_at,
        'finished_at': value.finished_at,
        'state_code': value.state_code,
        'result_code': value.result_code,
        'type_code': value.type_code,
        'failed_reason': MessageToJSON(value.failed_reason),
        'rollback_flag': value.rollback_flag,
    };
}
