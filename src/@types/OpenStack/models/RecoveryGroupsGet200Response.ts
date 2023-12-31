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
import type { Pagination } from './Pagination';
import {
    PaginationFromJSON,
    PaginationFromJSONTyped,
    PaginationToJSON,
} from './Pagination';
import type { ProtectionGroup } from './ProtectionGroup';
import {
    ProtectionGroupFromJSON,
    ProtectionGroupFromJSONTyped,
    ProtectionGroupToJSON,
} from './ProtectionGroup';

/**
 * 
 * @export
 * @interface RecoveryGroupsGet200Response
 */
export interface RecoveryGroupsGet200Response {
    /**
     * 
     * @type {Array<ProtectionGroup>}
     * @memberof RecoveryGroupsGet200Response
     */
    groups?: Array<ProtectionGroup>;
    /**
     * 
     * @type {Pagination}
     * @memberof RecoveryGroupsGet200Response
     */
    pagination?: Pagination;
    /**
     * 
     * @type {Message}
     * @memberof RecoveryGroupsGet200Response
     */
    message?: Message;
}

/**
 * Check if a given object implements the RecoveryGroupsGet200Response interface.
 */
export function instanceOfRecoveryGroupsGet200Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryGroupsGet200ResponseFromJSON(json: any): RecoveryGroupsGet200Response {
    return RecoveryGroupsGet200ResponseFromJSONTyped(json, false);
}

export function RecoveryGroupsGet200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryGroupsGet200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'groups': !exists(json, 'groups') ? undefined : ((json['groups'] as Array<any>).map(ProtectionGroupFromJSON)),
        'pagination': !exists(json, 'pagination') ? undefined : PaginationFromJSON(json['pagination']),
        'message': !exists(json, 'message') ? undefined : MessageFromJSON(json['message']),
    };
}

export function RecoveryGroupsGet200ResponseToJSON(value?: RecoveryGroupsGet200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'groups': value.groups === undefined ? undefined : ((value.groups as Array<any>).map(ProtectionGroupToJSON)),
        'pagination': PaginationToJSON(value.pagination),
        'message': MessageToJSON(value.message),
    };
}

