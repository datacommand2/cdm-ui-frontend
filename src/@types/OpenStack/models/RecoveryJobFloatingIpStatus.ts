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
import type { ClusterFloatingIP } from './ClusterFloatingIP';
import {
    ClusterFloatingIPFromJSON,
    ClusterFloatingIPFromJSONTyped,
    ClusterFloatingIPToJSON,
} from './ClusterFloatingIP';
import type { Message } from './Message';
import {
    MessageFromJSON,
    MessageFromJSONTyped,
    MessageToJSON,
} from './Message';

/**
 * FloatingIP 복구 상태
 * @export
 * @interface RecoveryJobFloatingIpStatus
 */
export interface RecoveryJobFloatingIpStatus {
    /**
     * 
     * @type {ClusterFloatingIP}
     * @memberof RecoveryJobFloatingIpStatus
     */
    floating_ip?: ClusterFloatingIP;
    /**
     * 데이터 시점 유형
     * @type {string}
     * @memberof RecoveryJobFloatingIpStatus
     */
    recovery_point_type_code?: RecoveryJobFloatingIpStatusRecoveryPointTypeCodeEnum;
    /**
     * 복구 데이터 시점
     * @type {number}
     * @memberof RecoveryJobFloatingIpStatus
     */
    recovery_point?: number;
    /**
     * 복구 시작 일시
     * @type {number}
     * @memberof RecoveryJobFloatingIpStatus
     */
    started_at?: number;
    /**
     * 복구 종료 일시
     * @type {number}
     * @memberof RecoveryJobFloatingIpStatus
     */
    finished_at?: number;
    /**
     * 복구 상태
     * @type {string}
     * @memberof RecoveryJobFloatingIpStatus
     */
    state_code?: RecoveryJobFloatingIpStatusStateCodeEnum;
    /**
     * 복구 결과
     * @type {string}
     * @memberof RecoveryJobFloatingIpStatus
     */
    result_code?: RecoveryJobFloatingIpStatusResultCodeEnum;
    /**
     * 복구, 롤백 상태
     * @type {string}
     * @memberof RecoveryJobFloatingIpStatus
     */
    type_code?: RecoveryJobFloatingIpStatusTypeCodeEnum;
    /**
     * 
     * @type {Message}
     * @memberof RecoveryJobFloatingIpStatus
     */
    failed_reason?: Message;
    /**
     * 롤백 여부
     * @type {boolean}
     * @memberof RecoveryJobFloatingIpStatus
     */
    rollback_flag?: boolean;
}


/**
 * @export
 */
export const RecoveryJobFloatingIpStatusRecoveryPointTypeCodeEnum = {
    latest: 'dr.recovery.recovery_point.type.latest',
    latest_snapshot: 'dr.recovery.recovery_point.type.latest_snapshot',
    snapshot: 'dr.recovery.recovery_point.type.snapshot'
} as const;
export type RecoveryJobFloatingIpStatusRecoveryPointTypeCodeEnum = typeof RecoveryJobFloatingIpStatusRecoveryPointTypeCodeEnum[keyof typeof RecoveryJobFloatingIpStatusRecoveryPointTypeCodeEnum];

/**
 * @export
 */
export const RecoveryJobFloatingIpStatusStateCodeEnum = {
    waiting: 'waiting',
    running: 'running',
    done: 'done'
} as const;
export type RecoveryJobFloatingIpStatusStateCodeEnum = typeof RecoveryJobFloatingIpStatusStateCodeEnum[keyof typeof RecoveryJobFloatingIpStatusStateCodeEnum];

/**
 * @export
 */
export const RecoveryJobFloatingIpStatusResultCodeEnum = {
    success: 'success',
    failed: 'failed',
    excepted: 'excepted',
    ignored: 'ignored',
    canceled: 'canceled'
} as const;
export type RecoveryJobFloatingIpStatusResultCodeEnum = typeof RecoveryJobFloatingIpStatusResultCodeEnum[keyof typeof RecoveryJobFloatingIpStatusResultCodeEnum];

/**
 * @export
 */
export const RecoveryJobFloatingIpStatusTypeCodeEnum = {
    create: 'dr.migration.task.create',
    delete: 'dr.migration.task.delete'
} as const;
export type RecoveryJobFloatingIpStatusTypeCodeEnum = typeof RecoveryJobFloatingIpStatusTypeCodeEnum[keyof typeof RecoveryJobFloatingIpStatusTypeCodeEnum];


/**
 * Check if a given object implements the RecoveryJobFloatingIpStatus interface.
 */
export function instanceOfRecoveryJobFloatingIpStatus(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryJobFloatingIpStatusFromJSON(json: any): RecoveryJobFloatingIpStatus {
    return RecoveryJobFloatingIpStatusFromJSONTyped(json, false);
}

export function RecoveryJobFloatingIpStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryJobFloatingIpStatus {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'floating_ip': !exists(json, 'floating_ip') ? undefined : ClusterFloatingIPFromJSON(json['floating_ip']),
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

export function RecoveryJobFloatingIpStatusToJSON(value?: RecoveryJobFloatingIpStatus | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'floating_ip': ClusterFloatingIPToJSON(value.floating_ip),
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
