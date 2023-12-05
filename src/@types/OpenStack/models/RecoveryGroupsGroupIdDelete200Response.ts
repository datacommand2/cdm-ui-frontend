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

/**
 * 
 * @export
 * @interface RecoveryGroupsGroupIdDelete200Response
 */
export interface RecoveryGroupsGroupIdDelete200Response {
    /**
     * 
     * @type {Message}
     * @memberof RecoveryGroupsGroupIdDelete200Response
     */
    message?: Message;
}

/**
 * Check if a given object implements the RecoveryGroupsGroupIdDelete200Response interface.
 */
export function instanceOfRecoveryGroupsGroupIdDelete200Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryGroupsGroupIdDelete200ResponseFromJSON(json: any): RecoveryGroupsGroupIdDelete200Response {
    return RecoveryGroupsGroupIdDelete200ResponseFromJSONTyped(json, false);
}

export function RecoveryGroupsGroupIdDelete200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryGroupsGroupIdDelete200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'message': !exists(json, 'message') ? undefined : MessageFromJSON(json['message']),
    };
}

export function RecoveryGroupsGroupIdDelete200ResponseToJSON(value?: RecoveryGroupsGroupIdDelete200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'message': MessageToJSON(value.message),
    };
}

