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
import type { ProtectionGroupSnapshot } from './ProtectionGroupSnapshot';
import {
    ProtectionGroupSnapshotFromJSON,
    ProtectionGroupSnapshotFromJSONTyped,
    ProtectionGroupSnapshotToJSON,
} from './ProtectionGroupSnapshot';

/**
 * 
 * @export
 * @interface RecoveryGroupsGroupIdSnapshotsGet200Response
 */
export interface RecoveryGroupsGroupIdSnapshotsGet200Response {
    /**
     * 
     * @type {Array<ProtectionGroupSnapshot>}
     * @memberof RecoveryGroupsGroupIdSnapshotsGet200Response
     */
    snapshots?: Array<ProtectionGroupSnapshot>;
    /**
     * 
     * @type {Message}
     * @memberof RecoveryGroupsGroupIdSnapshotsGet200Response
     */
    message?: Message;
}

/**
 * Check if a given object implements the RecoveryGroupsGroupIdSnapshotsGet200Response interface.
 */
export function instanceOfRecoveryGroupsGroupIdSnapshotsGet200Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryGroupsGroupIdSnapshotsGet200ResponseFromJSON(json: any): RecoveryGroupsGroupIdSnapshotsGet200Response {
    return RecoveryGroupsGroupIdSnapshotsGet200ResponseFromJSONTyped(json, false);
}

export function RecoveryGroupsGroupIdSnapshotsGet200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryGroupsGroupIdSnapshotsGet200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'snapshots': !exists(json, 'snapshots') ? undefined : ((json['snapshots'] as Array<any>).map(ProtectionGroupSnapshotFromJSON)),
        'message': !exists(json, 'message') ? undefined : MessageFromJSON(json['message']),
    };
}

export function RecoveryGroupsGroupIdSnapshotsGet200ResponseToJSON(value?: RecoveryGroupsGroupIdSnapshotsGet200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'snapshots': value.snapshots === undefined ? undefined : ((value.snapshots as Array<any>).map(ProtectionGroupSnapshotToJSON)),
        'message': MessageToJSON(value.message),
    };
}
