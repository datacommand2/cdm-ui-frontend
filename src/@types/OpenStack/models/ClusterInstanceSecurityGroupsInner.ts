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
import type { Cluster } from './Cluster';
import {
    ClusterFromJSON,
    ClusterFromJSONTyped,
    ClusterToJSON,
} from './Cluster';
import type { ClusterSecurityGroupRule } from './ClusterSecurityGroupRule';
import {
    ClusterSecurityGroupRuleFromJSON,
    ClusterSecurityGroupRuleFromJSONTyped,
    ClusterSecurityGroupRuleToJSON,
} from './ClusterSecurityGroupRule';
import type { ClusterTenant } from './ClusterTenant';
import {
    ClusterTenantFromJSON,
    ClusterTenantFromJSONTyped,
    ClusterTenantToJSON,
} from './ClusterTenant';

/**
 * 
 * @export
 * @interface ClusterInstanceSecurityGroupsInner
 */
export interface ClusterInstanceSecurityGroupsInner {
    /**
     * 클러스터 보안그룹의 규칙 목록
     * @type {Array<ClusterSecurityGroupRule>}
     * @memberof ClusterInstanceSecurityGroupsInner
     */
    rules?: Array<ClusterSecurityGroupRule>;
    /**
     * 클러스터 보안그룹의 ID
     * @type {number}
     * @memberof ClusterInstanceSecurityGroupsInner
     */
    id?: number;
    /**
     * 
     * @type {Cluster}
     * @memberof ClusterInstanceSecurityGroupsInner
     */
    cluster?: Cluster;
    /**
     * 
     * @type {ClusterTenant}
     * @memberof ClusterInstanceSecurityGroupsInner
     */
    tenant?: ClusterTenant;
    /**
     * 클러스터에서의 보안그룹 ID
     * @type {string}
     * @memberof ClusterInstanceSecurityGroupsInner
     */
    uuid?: string;
    /**
     * 클러스터 보안그룹의 이름
     * @type {string}
     * @memberof ClusterInstanceSecurityGroupsInner
     */
    name?: string;
    /**
     * 클러스터 보안그룹의 설명
     * @type {string}
     * @memberof ClusterInstanceSecurityGroupsInner
     */
    description?: string;
}

/**
 * Check if a given object implements the ClusterInstanceSecurityGroupsInner interface.
 */
export function instanceOfClusterInstanceSecurityGroupsInner(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ClusterInstanceSecurityGroupsInnerFromJSON(json: any): ClusterInstanceSecurityGroupsInner {
    return ClusterInstanceSecurityGroupsInnerFromJSONTyped(json, false);
}

export function ClusterInstanceSecurityGroupsInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): ClusterInstanceSecurityGroupsInner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'rules': !exists(json, 'rules') ? undefined : ((json['rules'] as Array<any>).map(ClusterSecurityGroupRuleFromJSON)),
        'id': !exists(json, 'id') ? undefined : json['id'],
        'cluster': !exists(json, 'cluster') ? undefined : ClusterFromJSON(json['cluster']),
        'tenant': !exists(json, 'tenant') ? undefined : ClusterTenantFromJSON(json['tenant']),
        'uuid': !exists(json, 'uuid') ? undefined : json['uuid'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'description': !exists(json, 'description') ? undefined : json['description'],
    };
}

export function ClusterInstanceSecurityGroupsInnerToJSON(value?: ClusterInstanceSecurityGroupsInner | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'rules': value.rules === undefined ? undefined : ((value.rules as Array<any>).map(ClusterSecurityGroupRuleToJSON)),
        'id': value.id,
        'cluster': ClusterToJSON(value.cluster),
        'tenant': ClusterTenantToJSON(value.tenant),
        'uuid': value.uuid,
        'name': value.name,
        'description': value.description,
    };
}

