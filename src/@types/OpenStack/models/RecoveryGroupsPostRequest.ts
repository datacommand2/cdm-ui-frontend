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

/**
 * 
 * @export
 * @interface RecoveryGroupsPostRequest
 */
export interface RecoveryGroupsPostRequest {
    /**
     * 
     * @type {ProtectionGroup}
     * @memberof RecoveryGroupsPostRequest
     */
    group?: ProtectionGroup;
}

/**
 * Check if a given object implements the RecoveryGroupsPostRequest interface.
 */
export function instanceOfRecoveryGroupsPostRequest(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryGroupsPostRequestFromJSON(json: any): RecoveryGroupsPostRequest {
    return RecoveryGroupsPostRequestFromJSONTyped(json, false);
}

export function RecoveryGroupsPostRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryGroupsPostRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'group': !exists(json, 'group') ? undefined : ProtectionGroupFromJSON(json['group']),
    };
}

export function RecoveryGroupsPostRequestToJSON(value?: RecoveryGroupsPostRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'group': ProtectionGroupToJSON(value.group),
    };
}

