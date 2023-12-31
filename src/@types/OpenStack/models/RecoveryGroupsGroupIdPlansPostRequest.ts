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
import type { RecoveryPlan } from './RecoveryPlan';
import {
    RecoveryPlanFromJSON,
    RecoveryPlanFromJSONTyped,
    RecoveryPlanToJSON,
} from './RecoveryPlan';

/**
 * 
 * @export
 * @interface RecoveryGroupsGroupIdPlansPostRequest
 */
export interface RecoveryGroupsGroupIdPlansPostRequest {
    /**
     * 
     * @type {RecoveryPlan}
     * @memberof RecoveryGroupsGroupIdPlansPostRequest
     */
    plan?: RecoveryPlan;
    /**
     * warning 을 무시하고 등록
     * @type {boolean}
     * @memberof RecoveryGroupsGroupIdPlansPostRequest
     */
    force?: boolean;
}

/**
 * Check if a given object implements the RecoveryGroupsGroupIdPlansPostRequest interface.
 */
export function instanceOfRecoveryGroupsGroupIdPlansPostRequest(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryGroupsGroupIdPlansPostRequestFromJSON(json: any): RecoveryGroupsGroupIdPlansPostRequest {
    return RecoveryGroupsGroupIdPlansPostRequestFromJSONTyped(json, false);
}

export function RecoveryGroupsGroupIdPlansPostRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryGroupsGroupIdPlansPostRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'plan': !exists(json, 'plan') ? undefined : RecoveryPlanFromJSON(json['plan']),
        'force': !exists(json, 'force') ? undefined : json['force'],
    };
}

export function RecoveryGroupsGroupIdPlansPostRequestToJSON(value?: RecoveryGroupsGroupIdPlansPostRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'plan': RecoveryPlanToJSON(value.plan),
        'force': value.force,
    };
}

