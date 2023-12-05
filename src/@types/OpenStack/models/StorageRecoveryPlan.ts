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
import type { ClusterStorage } from './ClusterStorage';
import {
    ClusterStorageFromJSON,
    ClusterStorageFromJSONTyped,
    ClusterStorageToJSON,
} from './ClusterStorage';
import type { Message } from './Message';
import {
    MessageFromJSON,
    MessageFromJSONTyped,
    MessageToJSON,
} from './Message';

/**
 * 볼륨타입 복구계획
 * @export
 * @interface StorageRecoveryPlan
 */
export interface StorageRecoveryPlan {
    /**
     * 복구 유형 (매핑만 지원)
     * @type {string}
     * @memberof StorageRecoveryPlan
     */
    recovery_type_code?: StorageRecoveryPlanRecoveryTypeCodeEnum;
    /**
     * 
     * @type {ClusterStorage}
     * @memberof StorageRecoveryPlan
     */
    protection_cluster_storage?: ClusterStorage;
    /**
     * 
     * @type {ClusterStorage}
     * @memberof StorageRecoveryPlan
     */
    recovery_cluster_storage?: ClusterStorage;
    /**
     * 볼륨타입 변경 필요 여부
     * @type {boolean}
     * @memberof StorageRecoveryPlan
     */
    recovery_cluster_storage_update_flag?: boolean;
    /**
     * 
     * @type {Message}
     * @memberof StorageRecoveryPlan
     */
    recovery_cluster_storage_update_reason?: Message;
    /**
     * 복구 불가 여부
     * @type {boolean}
     * @memberof StorageRecoveryPlan
     */
    unavailable_flag?: boolean;
    /**
     * 
     * @type {Message}
     * @memberof StorageRecoveryPlan
     */
    unavailable_reason?: Message;
}


/**
 * @export
 */
export const StorageRecoveryPlanRecoveryTypeCodeEnum = {
    dr_recovery_plan_storage_recovery_type_mapping: 'dr.recovery.plan.storage.recovery.type.mapping'
} as const;
export type StorageRecoveryPlanRecoveryTypeCodeEnum = typeof StorageRecoveryPlanRecoveryTypeCodeEnum[keyof typeof StorageRecoveryPlanRecoveryTypeCodeEnum];


/**
 * Check if a given object implements the StorageRecoveryPlan interface.
 */
export function instanceOfStorageRecoveryPlan(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function StorageRecoveryPlanFromJSON(json: any): StorageRecoveryPlan {
    return StorageRecoveryPlanFromJSONTyped(json, false);
}

export function StorageRecoveryPlanFromJSONTyped(json: any, ignoreDiscriminator: boolean): StorageRecoveryPlan {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'recovery_type_code': !exists(json, 'recovery_type_code') ? undefined : json['recovery_type_code'],
        'protection_cluster_storage': !exists(json, 'protection_cluster_storage') ? undefined : ClusterStorageFromJSON(json['protection_cluster_storage']),
        'recovery_cluster_storage': !exists(json, 'recovery_cluster_storage') ? undefined : ClusterStorageFromJSON(json['recovery_cluster_storage']),
        'recovery_cluster_storage_update_flag': !exists(json, 'recovery_cluster_storage_update_flag') ? undefined : json['recovery_cluster_storage_update_flag'],
        'recovery_cluster_storage_update_reason': !exists(json, 'recovery_cluster_storage_update_reason') ? undefined : MessageFromJSON(json['recovery_cluster_storage_update_reason']),
        'unavailable_flag': !exists(json, 'unavailable_flag') ? undefined : json['unavailable_flag'],
        'unavailable_reason': !exists(json, 'unavailable_reason') ? undefined : MessageFromJSON(json['unavailable_reason']),
    };
}

export function StorageRecoveryPlanToJSON(value?: StorageRecoveryPlan | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'recovery_type_code': value.recovery_type_code,
        'protection_cluster_storage': ClusterStorageToJSON(value.protection_cluster_storage),
        'recovery_cluster_storage': ClusterStorageToJSON(value.recovery_cluster_storage),
        'recovery_cluster_storage_update_flag': value.recovery_cluster_storage_update_flag,
        'recovery_cluster_storage_update_reason': MessageToJSON(value.recovery_cluster_storage_update_reason),
        'unavailable_flag': value.unavailable_flag,
        'unavailable_reason': MessageToJSON(value.unavailable_reason),
    };
}

