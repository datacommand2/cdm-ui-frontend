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
import type { UserGroup } from './UserGroup';
import {
    UserGroupFromJSON,
    UserGroupFromJSONTyped,
    UserGroupToJSON,
} from './UserGroup';

/**
 * 클러스터 권한
 * @export
 * @interface ClusterPermission
 */
export interface ClusterPermission {
    /**
     * 
     * @type {UserGroup}
     * @memberof ClusterPermission
     */
    group?: UserGroup;
    /**
     * 
     * @type {string}
     * @memberof ClusterPermission
     */
    mode_code?: ClusterPermissionModeCodeEnum;
}


/**
 * @export
 */
export const ClusterPermissionModeCodeEnum = {
    readonly: 'cluster.permission.mode.readonly',
    readwrite: 'cluster.permission.mode.readwrite'
} as const;
export type ClusterPermissionModeCodeEnum = typeof ClusterPermissionModeCodeEnum[keyof typeof ClusterPermissionModeCodeEnum];


/**
 * Check if a given object implements the ClusterPermission interface.
 */
export function instanceOfClusterPermission(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ClusterPermissionFromJSON(json: any): ClusterPermission {
    return ClusterPermissionFromJSONTyped(json, false);
}

export function ClusterPermissionFromJSONTyped(json: any, ignoreDiscriminator: boolean): ClusterPermission {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'group': !exists(json, 'group') ? undefined : UserGroupFromJSON(json['group']),
        'mode_code': !exists(json, 'mode_code') ? undefined : json['mode_code'],
    };
}

export function ClusterPermissionToJSON(value?: ClusterPermission | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'group': UserGroupToJSON(value.group),
        'mode_code': value.mode_code,
    };
}

