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
 * 재해복구작업 내역 로그
 * @export
 * @interface RecoveryTaskLog
 */
export interface RecoveryTaskLog {
    /**
     * 작업 내역 로그 seq
     * @type {number}
     * @memberof RecoveryTaskLog
     */
    log_seq?: number;
    /**
     * 작업 내역 로깅 일시
     * @type {number}
     * @memberof RecoveryTaskLog
     */
    log_dt?: number;
    /**
     * 메시지 코드
     * @type {string}
     * @memberof RecoveryTaskLog
     */
    code?: string;
    /**
     * 메시지 상세 내용 데이터
     * @type {string}
     * @memberof RecoveryTaskLog
     */
    contents?: string;
}

/**
 * Check if a given object implements the RecoveryTaskLog interface.
 */
export function instanceOfRecoveryTaskLog(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryTaskLogFromJSON(json: any): RecoveryTaskLog {
    return RecoveryTaskLogFromJSONTyped(json, false);
}

export function RecoveryTaskLogFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryTaskLog {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'log_seq': !exists(json, 'log_seq') ? undefined : json['log_seq'],
        'log_dt': !exists(json, 'log_dt') ? undefined : json['log_dt'],
        'code': !exists(json, 'code') ? undefined : json['code'],
        'contents': !exists(json, 'contents') ? undefined : json['contents'],
    };
}

export function RecoveryTaskLogToJSON(value?: RecoveryTaskLog | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'log_seq': value.log_seq,
        'log_dt': value.log_dt,
        'code': value.code,
        'contents': value.contents,
    };
}

