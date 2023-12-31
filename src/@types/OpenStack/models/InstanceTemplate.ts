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
import type { InstanceTemplateInstance } from './InstanceTemplateInstance';
import {
    InstanceTemplateInstanceFromJSON,
    InstanceTemplateInstanceFromJSONTyped,
    InstanceTemplateInstanceToJSON,
} from './InstanceTemplateInstance';
import type { UserGroup } from './UserGroup';
import {
    UserGroupFromJSON,
    UserGroupFromJSONTyped,
    UserGroupToJSON,
} from './UserGroup';

/**
 * 인스턴스 템플릿
 * @export
 * @interface InstanceTemplate
 */
export interface InstanceTemplate {
    /**
     * 인스턴스 템플릿 ID
     * @type {number}
     * @memberof InstanceTemplate
     */
    id?: number;
    /**
     * 
     * @type {UserGroup}
     * @memberof InstanceTemplate
     */
    owner_group?: UserGroup;
    /**
     * 보호그룹 이름
     * @type {string}
     * @memberof InstanceTemplate
     */
    name?: string;
    /**
     * 보호그룹 설명
     * @type {string}
     * @memberof InstanceTemplate
     */
    remarks?: string;
    /**
     * 보호그룹 생성일시 (timestamp)
     * @type {number}
     * @memberof InstanceTemplate
     */
    created_at?: number;
    /**
     * 인스턴스 템플릿의 인스턴스 목록
     * @type {Array<InstanceTemplateInstance>}
     * @memberof InstanceTemplate
     */
    instances?: Array<InstanceTemplateInstance>;
}

/**
 * Check if a given object implements the InstanceTemplate interface.
 */
export function instanceOfInstanceTemplate(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function InstanceTemplateFromJSON(json: any): InstanceTemplate {
    return InstanceTemplateFromJSONTyped(json, false);
}

export function InstanceTemplateFromJSONTyped(json: any, ignoreDiscriminator: boolean): InstanceTemplate {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'owner_group': !exists(json, 'owner_group') ? undefined : UserGroupFromJSON(json['owner_group']),
        'name': !exists(json, 'name') ? undefined : json['name'],
        'remarks': !exists(json, 'remarks') ? undefined : json['remarks'],
        'created_at': !exists(json, 'created_at') ? undefined : json['created_at'],
        'instances': !exists(json, 'instances') ? undefined : ((json['instances'] as Array<any>).map(InstanceTemplateInstanceFromJSON)),
    };
}

export function InstanceTemplateToJSON(value?: InstanceTemplate | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'owner_group': UserGroupToJSON(value.owner_group),
        'name': value.name,
        'remarks': value.remarks,
        'created_at': value.created_at,
        'instances': value.instances === undefined ? undefined : ((value.instances as Array<any>).map(InstanceTemplateInstanceToJSON)),
    };
}

