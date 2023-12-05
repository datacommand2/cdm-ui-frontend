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
import type { ClusterTenant } from './ClusterTenant';
import {
    ClusterTenantFromJSON,
    ClusterTenantFromJSONTyped,
    ClusterTenantToJSON,
} from './ClusterTenant';
import type { Message } from './Message';
import {
    MessageFromJSON,
    MessageFromJSONTyped,
    MessageToJSON,
} from './Message';

/**
 * 테넌트 복구계획
 * @export
 * @interface TenantRecoveryPlan
 */
export interface TenantRecoveryPlan {
    /**
     * 복구 유형
     * @type {string}
     * @memberof TenantRecoveryPlan
     */
    recovery_type_code?: TenantRecoveryPlanRecoveryTypeCodeEnum;
    /**
     * 
     * @type {ClusterTenant}
     * @memberof TenantRecoveryPlan
     */
    protection_cluster_tenant?: ClusterTenant;
    /**
     * 
     * @type {ClusterTenant}
     * @memberof TenantRecoveryPlan
     */
    recovery_cluster_tenant?: ClusterTenant;
    /**
     * 미러링 테넌트 이름
     * @type {string}
     * @memberof TenantRecoveryPlan
     */
    recovery_cluster_tenant_mirror_name?: string;
    /**
     * 미러링 테넌트 이름 변경 필요 여부
     * @type {boolean}
     * @memberof TenantRecoveryPlan
     */
    recovery_cluster_tenant_mirror_name_update_flag?: boolean;
    /**
     * 
     * @type {Message}
     * @memberof TenantRecoveryPlan
     */
    recovery_cluster_tenant_mirror_name_update_reason?: Message;
}


/**
 * @export
 */
export const TenantRecoveryPlanRecoveryTypeCodeEnum = {
    dr_recovery_plan_tenant_recovery_type_mirroring: 'dr.recovery.plan.tenant.recovery.type.mirroring'
} as const;
export type TenantRecoveryPlanRecoveryTypeCodeEnum = typeof TenantRecoveryPlanRecoveryTypeCodeEnum[keyof typeof TenantRecoveryPlanRecoveryTypeCodeEnum];


/**
 * Check if a given object implements the TenantRecoveryPlan interface.
 */
export function instanceOfTenantRecoveryPlan(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function TenantRecoveryPlanFromJSON(json: any): TenantRecoveryPlan {
    return TenantRecoveryPlanFromJSONTyped(json, false);
}

export function TenantRecoveryPlanFromJSONTyped(json: any, ignoreDiscriminator: boolean): TenantRecoveryPlan {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'recovery_type_code': !exists(json, 'recovery_type_code') ? undefined : json['recovery_type_code'],
        'protection_cluster_tenant': !exists(json, 'protection_cluster_tenant') ? undefined : ClusterTenantFromJSON(json['protection_cluster_tenant']),
        'recovery_cluster_tenant': !exists(json, 'recovery_cluster_tenant') ? undefined : ClusterTenantFromJSON(json['recovery_cluster_tenant']),
        'recovery_cluster_tenant_mirror_name': !exists(json, 'recovery_cluster_tenant_mirror_name') ? undefined : json['recovery_cluster_tenant_mirror_name'],
        'recovery_cluster_tenant_mirror_name_update_flag': !exists(json, 'recovery_cluster_tenant_mirror_name_update_flag') ? undefined : json['recovery_cluster_tenant_mirror_name_update_flag'],
        'recovery_cluster_tenant_mirror_name_update_reason': !exists(json, 'recovery_cluster_tenant_mirror_name_update_reason') ? undefined : MessageFromJSON(json['recovery_cluster_tenant_mirror_name_update_reason']),
    };
}

export function TenantRecoveryPlanToJSON(value?: TenantRecoveryPlan | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'recovery_type_code': value.recovery_type_code,
        'protection_cluster_tenant': ClusterTenantToJSON(value.protection_cluster_tenant),
        'recovery_cluster_tenant': ClusterTenantToJSON(value.recovery_cluster_tenant),
        'recovery_cluster_tenant_mirror_name': value.recovery_cluster_tenant_mirror_name,
        'recovery_cluster_tenant_mirror_name_update_flag': value.recovery_cluster_tenant_mirror_name_update_flag,
        'recovery_cluster_tenant_mirror_name_update_reason': MessageToJSON(value.recovery_cluster_tenant_mirror_name_update_reason),
    };
}
