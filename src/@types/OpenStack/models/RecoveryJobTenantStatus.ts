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
import type { ClusterTenant } from './ClusterTenant';
import {
    ClusterTenantFromJSON,
    ClusterTenantFromJSONTyped,
    ClusterTenantToJSON,
} from './ClusterTenant';
import type { Message } from './Message';
import {
    MessageFromJSON,
    MessageFromJSONTyped,
    MessageToJSON,
} from './Message';

/**
 * 테넌트 복구 상태
 * @export
 * @interface RecoveryJobTenantStatus
 */
export interface RecoveryJobTenantStatus {
    /**
     * 
     * @type {ClusterTenant}
     * @memberof RecoveryJobTenantStatus
     */
    tenant?: ClusterTenant;
    /**
     * 데이터 시점 유형
     * @type {string}
     * @memberof RecoveryJobTenantStatus
     */
    recovery_point_type_code?: RecoveryJobTenantStatusRecoveryPointTypeCodeEnum;
    /**
     * 복구 데이터 시점
     * @type {number}
     * @memberof RecoveryJobTenantStatus
     */
    recovery_point?: number;
    /**
     * 복구 시작 일시
     * @type {number}
     * @memberof RecoveryJobTenantStatus
     */
    started_at?: number;
    /**
     * 복구 종료 일시
     * @type {number}
     * @memberof RecoveryJobTenantStatus
     */
    finished_at?: number;
    /**
     * 복구 상태
     * @type {string}
     * @memberof RecoveryJobTenantStatus
     */
    state_code?: RecoveryJobTenantStatusStateCodeEnum;
    /**
     * 복구 결과
     * @type {string}
     * @memberof RecoveryJobTenantStatus
     */
    result_code?: RecoveryJobTenantStatusResultCodeEnum;
    /**
     * 복구, 롤백 상태
     * @type {string}
     * @memberof RecoveryJobTenantStatus
     */
    type_code?: RecoveryJobTenantStatusTypeCodeEnum;
    /**
     * 
     * @type {Message}
     * @memberof RecoveryJobTenantStatus
     */
    failed_reason?: Message;
    /**
     * 롤백 여부
     * @type {boolean}
     * @memberof RecoveryJobTenantStatus
     */
    rollback_flag?: boolean;
}


/**
 * @export
 */
export const RecoveryJobTenantStatusRecoveryPointTypeCodeEnum = {
    latest: 'dr.recovery.recovery_point.type.latest',
    latest_snapshot: 'dr.recovery.recovery_point.type.latest_snapshot',
    snapshot: 'dr.recovery.recovery_point.type.snapshot'
} as const;
export type RecoveryJobTenantStatusRecoveryPointTypeCodeEnum = typeof RecoveryJobTenantStatusRecoveryPointTypeCodeEnum[keyof typeof RecoveryJobTenantStatusRecoveryPointTypeCodeEnum];

/**
 * @export
 */
export const RecoveryJobTenantStatusStateCodeEnum = {
    waiting: 'waiting',
    running: 'running',
    done: 'done'
} as const;
export type RecoveryJobTenantStatusStateCodeEnum = typeof RecoveryJobTenantStatusStateCodeEnum[keyof typeof RecoveryJobTenantStatusStateCodeEnum];

/**
 * @export
 */
export const RecoveryJobTenantStatusResultCodeEnum = {
    success: 'success',
    failed: 'failed',
    excepted: 'excepted',
    ignored: 'ignored',
    canceled: 'canceled'
} as const;
export type RecoveryJobTenantStatusResultCodeEnum = typeof RecoveryJobTenantStatusResultCodeEnum[keyof typeof RecoveryJobTenantStatusResultCodeEnum];

/**
 * @export
 */
export const RecoveryJobTenantStatusTypeCodeEnum = {
    create: 'dr.migration.task.create',
    delete: 'dr.migration.task.delete'
} as const;
export type RecoveryJobTenantStatusTypeCodeEnum = typeof RecoveryJobTenantStatusTypeCodeEnum[keyof typeof RecoveryJobTenantStatusTypeCodeEnum];


/**
 * Check if a given object implements the RecoveryJobTenantStatus interface.
 */
export function instanceOfRecoveryJobTenantStatus(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryJobTenantStatusFromJSON(json: any): RecoveryJobTenantStatus {
    return RecoveryJobTenantStatusFromJSONTyped(json, false);
}

export function RecoveryJobTenantStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryJobTenantStatus {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'tenant': !exists(json, 'tenant') ? undefined : ClusterTenantFromJSON(json['tenant']),
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

export function RecoveryJobTenantStatusToJSON(value?: RecoveryJobTenantStatus | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'tenant': ClusterTenantToJSON(value.tenant),
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

