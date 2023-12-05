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
import type { InstanceTemplate } from './InstanceTemplate';
import {
    InstanceTemplateFromJSON,
    InstanceTemplateFromJSONTyped,
    InstanceTemplateToJSON,
} from './InstanceTemplate';
import type { Message } from './Message';
import {
    MessageFromJSON,
    MessageFromJSONTyped,
    MessageToJSON,
} from './Message';
import type { Pagination } from './Pagination';
import {
    PaginationFromJSON,
    PaginationFromJSONTyped,
    PaginationToJSON,
} from './Pagination';

/**
 * 
 * @export
 * @interface RecoveryTemplatesGet200Response
 */
export interface RecoveryTemplatesGet200Response {
    /**
     * 
     * @type {Array<InstanceTemplate>}
     * @memberof RecoveryTemplatesGet200Response
     */
    instance_templates?: Array<InstanceTemplate>;
    /**
     * 
     * @type {Pagination}
     * @memberof RecoveryTemplatesGet200Response
     */
    pagination?: Pagination;
    /**
     * 
     * @type {Message}
     * @memberof RecoveryTemplatesGet200Response
     */
    message?: Message;
}

/**
 * Check if a given object implements the RecoveryTemplatesGet200Response interface.
 */
export function instanceOfRecoveryTemplatesGet200Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryTemplatesGet200ResponseFromJSON(json: any): RecoveryTemplatesGet200Response {
    return RecoveryTemplatesGet200ResponseFromJSONTyped(json, false);
}

export function RecoveryTemplatesGet200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryTemplatesGet200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'instance_templates': !exists(json, 'instance_templates') ? undefined : ((json['instance_templates'] as Array<any>).map(InstanceTemplateFromJSON)),
        'pagination': !exists(json, 'pagination') ? undefined : PaginationFromJSON(json['pagination']),
        'message': !exists(json, 'message') ? undefined : MessageFromJSON(json['message']),
    };
}

export function RecoveryTemplatesGet200ResponseToJSON(value?: RecoveryTemplatesGet200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'instance_templates': value.instance_templates === undefined ? undefined : ((value.instance_templates as Array<any>).map(InstanceTemplateToJSON)),
        'pagination': PaginationToJSON(value.pagination),
        'message': MessageToJSON(value.message),
    };
}

