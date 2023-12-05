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
import type { RecoveryJobStatus } from './RecoveryJobStatus';
import {
    RecoveryJobStatusFromJSON,
    RecoveryJobStatusFromJSONTyped,
    RecoveryJobStatusToJSON,
} from './RecoveryJobStatus';

/**
 * 
 * @export
 * @interface RecoveryGroupsGroupIdJobsJobIdMonitorGet200Response
 */
export interface RecoveryGroupsGroupIdJobsJobIdMonitorGet200Response {
    /**
     * 
     * @type {RecoveryJobStatus}
     * @memberof RecoveryGroupsGroupIdJobsJobIdMonitorGet200Response
     */
    status?: RecoveryJobStatus;
}

/**
 * Check if a given object implements the RecoveryGroupsGroupIdJobsJobIdMonitorGet200Response interface.
 */
export function instanceOfRecoveryGroupsGroupIdJobsJobIdMonitorGet200Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryGroupsGroupIdJobsJobIdMonitorGet200ResponseFromJSON(json: any): RecoveryGroupsGroupIdJobsJobIdMonitorGet200Response {
    return RecoveryGroupsGroupIdJobsJobIdMonitorGet200ResponseFromJSONTyped(json, false);
}

export function RecoveryGroupsGroupIdJobsJobIdMonitorGet200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryGroupsGroupIdJobsJobIdMonitorGet200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'status': !exists(json, 'status') ? undefined : RecoveryJobStatusFromJSON(json['status']),
    };
}

export function RecoveryGroupsGroupIdJobsJobIdMonitorGet200ResponseToJSON(value?: RecoveryGroupsGroupIdJobsJobIdMonitorGet200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'status': RecoveryJobStatusToJSON(value.status),
    };
}
