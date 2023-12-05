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
import type { Tenant } from './Tenant';
import {
    TenantFromJSON,
    TenantFromJSONTyped,
    TenantToJSON,
} from './Tenant';

/**
 * 사용자 그룹
 * @export
 * @interface UserGroup
 */
export interface UserGroup {
    /**
     * 사용자 그룹 ID
     * @type {number}
     * @memberof UserGroup
     */
    id?: number;
    /**
     * 
     * @type {Tenant}
     * @memberof UserGroup
     */
    tenant?: Tenant;
    /**
     * 사용자 그룹 이름
     * @type {string}
     * @memberof UserGroup
     */
    name?: string;
    /**
     * 비고
     * @type {string}
     * @memberof UserGroup
     */
    remarks?: string;
    /**
     * 사용자 그룹 생성 날짜
     * @type {number}
     * @memberof UserGroup
     */
    created_at?: number;
    /**
     * 사용자 그룹 변경 날짜
     * @type {number}
     * @memberof UserGroup
     */
    updated_at?: number;
}

/**
 * Check if a given object implements the UserGroup interface.
 */
export function instanceOfUserGroup(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function UserGroupFromJSON(json: any): UserGroup {
    return UserGroupFromJSONTyped(json, false);
}

export function UserGroupFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserGroup {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'tenant': !exists(json, 'tenant') ? undefined : TenantFromJSON(json['tenant']),
        'name': !exists(json, 'name') ? undefined : json['name'],
        'remarks': !exists(json, 'remarks') ? undefined : json['remarks'],
        'created_at': !exists(json, 'created_at') ? undefined : json['created_at'],
        'updated_at': !exists(json, 'updated_at') ? undefined : json['updated_at'],
    };
}

export function UserGroupToJSON(value?: UserGroup | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'tenant': TenantToJSON(value.tenant),
        'name': value.name,
        'remarks': value.remarks,
        'created_at': value.created_at,
        'updated_at': value.updated_at,
    };
}
