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
import type { RecoveryDashboardSummaryInstancesGet200ResponseSummary } from './RecoveryDashboardSummaryInstancesGet200ResponseSummary';
import {
    RecoveryDashboardSummaryInstancesGet200ResponseSummaryFromJSON,
    RecoveryDashboardSummaryInstancesGet200ResponseSummaryFromJSONTyped,
    RecoveryDashboardSummaryInstancesGet200ResponseSummaryToJSON,
} from './RecoveryDashboardSummaryInstancesGet200ResponseSummary';

/**
 * 
 * @export
 * @interface RecoveryDashboardSummaryInstancesGet200Response
 */
export interface RecoveryDashboardSummaryInstancesGet200Response {
    /**
     * 
     * @type {RecoveryDashboardSummaryInstancesGet200ResponseSummary}
     * @memberof RecoveryDashboardSummaryInstancesGet200Response
     */
    summary?: RecoveryDashboardSummaryInstancesGet200ResponseSummary;
    /**
     * 
     * @type {Message}
     * @memberof RecoveryDashboardSummaryInstancesGet200Response
     */
    message?: Message;
}

/**
 * Check if a given object implements the RecoveryDashboardSummaryInstancesGet200Response interface.
 */
export function instanceOfRecoveryDashboardSummaryInstancesGet200Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryDashboardSummaryInstancesGet200ResponseFromJSON(json: any): RecoveryDashboardSummaryInstancesGet200Response {
    return RecoveryDashboardSummaryInstancesGet200ResponseFromJSONTyped(json, false);
}

export function RecoveryDashboardSummaryInstancesGet200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryDashboardSummaryInstancesGet200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'summary': !exists(json, 'summary') ? undefined : RecoveryDashboardSummaryInstancesGet200ResponseSummaryFromJSON(json['summary']),
        'message': !exists(json, 'message') ? undefined : MessageFromJSON(json['message']),
    };
}

export function RecoveryDashboardSummaryInstancesGet200ResponseToJSON(value?: RecoveryDashboardSummaryInstancesGet200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'summary': RecoveryDashboardSummaryInstancesGet200ResponseSummaryToJSON(value.summary),
        'message': MessageToJSON(value.message),
    };
}

