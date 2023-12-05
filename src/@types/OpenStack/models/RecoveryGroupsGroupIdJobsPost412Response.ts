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
import type { Message } from './Message';
import {
    MessageFromJSON,
    MessageFromJSONTyped,
    MessageToJSON,
} from './Message';
import type { RecoveryGroupsGroupIdJobsPost412ResponseInstancesInner } from './RecoveryGroupsGroupIdJobsPost412ResponseInstancesInner';
import {
    RecoveryGroupsGroupIdJobsPost412ResponseInstancesInnerFromJSON,
    RecoveryGroupsGroupIdJobsPost412ResponseInstancesInnerFromJSONTyped,
    RecoveryGroupsGroupIdJobsPost412ResponseInstancesInnerToJSON,
} from './RecoveryGroupsGroupIdJobsPost412ResponseInstancesInner';

/**
 * 
 * @export
 * @interface RecoveryGroupsGroupIdJobsPost412Response
 */
export interface RecoveryGroupsGroupIdJobsPost412Response {
    /**
     * 복구불가 인스턴스 목록
     * @type {Array<RecoveryGroupsGroupIdJobsPost412ResponseInstancesInner>}
     * @memberof RecoveryGroupsGroupIdJobsPost412Response
     */
    instances?: Array<RecoveryGroupsGroupIdJobsPost412ResponseInstancesInner>;
    /**
     * 
     * @type {Message}
     * @memberof RecoveryGroupsGroupIdJobsPost412Response
     */
    message?: Message;
}

/**
 * Check if a given object implements the RecoveryGroupsGroupIdJobsPost412Response interface.
 */
export function instanceOfRecoveryGroupsGroupIdJobsPost412Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryGroupsGroupIdJobsPost412ResponseFromJSON(json: any): RecoveryGroupsGroupIdJobsPost412Response {
    return RecoveryGroupsGroupIdJobsPost412ResponseFromJSONTyped(json, false);
}

export function RecoveryGroupsGroupIdJobsPost412ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryGroupsGroupIdJobsPost412Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'instances': !exists(json, 'instances') ? undefined : ((json['instances'] as Array<any>).map(RecoveryGroupsGroupIdJobsPost412ResponseInstancesInnerFromJSON)),
        'message': !exists(json, 'message') ? undefined : MessageFromJSON(json['message']),
    };
}

export function RecoveryGroupsGroupIdJobsPost412ResponseToJSON(value?: RecoveryGroupsGroupIdJobsPost412Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'instances': value.instances === undefined ? undefined : ((value.instances as Array<any>).map(RecoveryGroupsGroupIdJobsPost412ResponseInstancesInnerToJSON)),
        'message': MessageToJSON(value.message),
    };
}
