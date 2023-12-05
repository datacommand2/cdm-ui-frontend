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
 * 
 * @export
 * @interface RecoveryGroupsGroupIdJobsJobIdPauseExtendPostRequest
 */
export interface RecoveryGroupsGroupIdJobsJobIdPauseExtendPostRequest {
    /**
     * 연장할 시간
     * @type {number}
     * @memberof RecoveryGroupsGroupIdJobsJobIdPauseExtendPostRequest
     */
    extend_time?: number;
}

/**
 * Check if a given object implements the RecoveryGroupsGroupIdJobsJobIdPauseExtendPostRequest interface.
 */
export function instanceOfRecoveryGroupsGroupIdJobsJobIdPauseExtendPostRequest(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryGroupsGroupIdJobsJobIdPauseExtendPostRequestFromJSON(json: any): RecoveryGroupsGroupIdJobsJobIdPauseExtendPostRequest {
    return RecoveryGroupsGroupIdJobsJobIdPauseExtendPostRequestFromJSONTyped(json, false);
}

export function RecoveryGroupsGroupIdJobsJobIdPauseExtendPostRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryGroupsGroupIdJobsJobIdPauseExtendPostRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'extend_time': !exists(json, 'extend_time') ? undefined : json['extend_time'],
    };
}

export function RecoveryGroupsGroupIdJobsJobIdPauseExtendPostRequestToJSON(value?: RecoveryGroupsGroupIdJobsJobIdPauseExtendPostRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'extend_time': value.extend_time,
    };
}

