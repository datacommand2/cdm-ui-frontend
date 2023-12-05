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
import type { RecoveryJobFloatingIpStatus } from './RecoveryJobFloatingIpStatus';
import {
    RecoveryJobFloatingIpStatusFromJSON,
    RecoveryJobFloatingIpStatusFromJSONTyped,
    RecoveryJobFloatingIpStatusToJSON,
} from './RecoveryJobFloatingIpStatus';
import type { RecoveryJobInstanceSpecStatus } from './RecoveryJobInstanceSpecStatus';
import {
    RecoveryJobInstanceSpecStatusFromJSON,
    RecoveryJobInstanceSpecStatusFromJSONTyped,
    RecoveryJobInstanceSpecStatusToJSON,
} from './RecoveryJobInstanceSpecStatus';
import type { RecoveryJobInstanceStatus } from './RecoveryJobInstanceStatus';
import {
    RecoveryJobInstanceStatusFromJSON,
    RecoveryJobInstanceStatusFromJSONTyped,
    RecoveryJobInstanceStatusToJSON,
} from './RecoveryJobInstanceStatus';
import type { RecoveryJobKeyPairStatus } from './RecoveryJobKeyPairStatus';
import {
    RecoveryJobKeyPairStatusFromJSON,
    RecoveryJobKeyPairStatusFromJSONTyped,
    RecoveryJobKeyPairStatusToJSON,
} from './RecoveryJobKeyPairStatus';
import type { RecoveryJobNetworkStatus } from './RecoveryJobNetworkStatus';
import {
    RecoveryJobNetworkStatusFromJSON,
    RecoveryJobNetworkStatusFromJSONTyped,
    RecoveryJobNetworkStatusToJSON,
} from './RecoveryJobNetworkStatus';
import type { RecoveryJobRouterStatus } from './RecoveryJobRouterStatus';
import {
    RecoveryJobRouterStatusFromJSON,
    RecoveryJobRouterStatusFromJSONTyped,
    RecoveryJobRouterStatusToJSON,
} from './RecoveryJobRouterStatus';
import type { RecoveryJobSecurityGroupStatus } from './RecoveryJobSecurityGroupStatus';
import {
    RecoveryJobSecurityGroupStatusFromJSON,
    RecoveryJobSecurityGroupStatusFromJSONTyped,
    RecoveryJobSecurityGroupStatusToJSON,
} from './RecoveryJobSecurityGroupStatus';
import type { RecoveryJobStatus } from './RecoveryJobStatus';
import {
    RecoveryJobStatusFromJSON,
    RecoveryJobStatusFromJSONTyped,
    RecoveryJobStatusToJSON,
} from './RecoveryJobStatus';
import type { RecoveryJobSubnetStatus } from './RecoveryJobSubnetStatus';
import {
    RecoveryJobSubnetStatusFromJSON,
    RecoveryJobSubnetStatusFromJSONTyped,
    RecoveryJobSubnetStatusToJSON,
} from './RecoveryJobSubnetStatus';
import type { RecoveryJobTenantStatus } from './RecoveryJobTenantStatus';
import {
    RecoveryJobTenantStatusFromJSON,
    RecoveryJobTenantStatusFromJSONTyped,
    RecoveryJobTenantStatusToJSON,
} from './RecoveryJobTenantStatus';
import type { RecoveryJobVolumeStatus } from './RecoveryJobVolumeStatus';
import {
    RecoveryJobVolumeStatusFromJSON,
    RecoveryJobVolumeStatusFromJSONTyped,
    RecoveryJobVolumeStatusToJSON,
} from './RecoveryJobVolumeStatus';

/**
 * 
 * @export
 * @interface RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response
 */
export interface RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response {
    /**
     * 
     * @type {RecoveryJobStatus}
     * @memberof RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response
     */
    status?: RecoveryJobStatus;
    /**
     * 
     * @type {Array<RecoveryJobTenantStatus>}
     * @memberof RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response
     */
    tenants?: Array<RecoveryJobTenantStatus>;
    /**
     * 
     * @type {Array<RecoveryJobSecurityGroupStatus>}
     * @memberof RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response
     */
    security_groups?: Array<RecoveryJobSecurityGroupStatus>;
    /**
     * 
     * @type {Array<RecoveryJobNetworkStatus>}
     * @memberof RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response
     */
    networks?: Array<RecoveryJobNetworkStatus>;
    /**
     * 
     * @type {Array<RecoveryJobSubnetStatus>}
     * @memberof RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response
     */
    subnets?: Array<RecoveryJobSubnetStatus>;
    /**
     * 
     * @type {Array<RecoveryJobFloatingIpStatus>}
     * @memberof RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response
     */
    floating_ips?: Array<RecoveryJobFloatingIpStatus>;
    /**
     * 
     * @type {Array<RecoveryJobRouterStatus>}
     * @memberof RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response
     */
    routers?: Array<RecoveryJobRouterStatus>;
    /**
     * 
     * @type {Array<RecoveryJobVolumeStatus>}
     * @memberof RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response
     */
    volumes?: Array<RecoveryJobVolumeStatus>;
    /**
     * 
     * @type {Array<RecoveryJobKeyPairStatus>}
     * @memberof RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response
     */
    key_pairs?: Array<RecoveryJobKeyPairStatus>;
    /**
     * 
     * @type {Array<RecoveryJobInstanceSpecStatus>}
     * @memberof RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response
     */
    instance_spec?: Array<RecoveryJobInstanceSpecStatus>;
    /**
     * 
     * @type {Array<RecoveryJobInstanceStatus>}
     * @memberof RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response
     */
    instances?: Array<RecoveryJobInstanceStatus>;
}

/**
 * Check if a given object implements the RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response interface.
 */
export function instanceOfRecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RecoveryGroupsGroupIdJobsJobIdMonitorsGet200ResponseFromJSON(json: any): RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response {
    return RecoveryGroupsGroupIdJobsJobIdMonitorsGet200ResponseFromJSONTyped(json, false);
}

export function RecoveryGroupsGroupIdJobsJobIdMonitorsGet200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'status': !exists(json, 'status') ? undefined : RecoveryJobStatusFromJSON(json['status']),
        'tenants': !exists(json, 'tenants') ? undefined : ((json['tenants'] as Array<any>).map(RecoveryJobTenantStatusFromJSON)),
        'security_groups': !exists(json, 'security_groups') ? undefined : ((json['security_groups'] as Array<any>).map(RecoveryJobSecurityGroupStatusFromJSON)),
        'networks': !exists(json, 'networks') ? undefined : ((json['networks'] as Array<any>).map(RecoveryJobNetworkStatusFromJSON)),
        'subnets': !exists(json, 'subnets') ? undefined : ((json['subnets'] as Array<any>).map(RecoveryJobSubnetStatusFromJSON)),
        'floating_ips': !exists(json, 'floating_ips') ? undefined : ((json['floating_ips'] as Array<any>).map(RecoveryJobFloatingIpStatusFromJSON)),
        'routers': !exists(json, 'routers') ? undefined : ((json['routers'] as Array<any>).map(RecoveryJobRouterStatusFromJSON)),
        'volumes': !exists(json, 'volumes') ? undefined : ((json['volumes'] as Array<any>).map(RecoveryJobVolumeStatusFromJSON)),
        'key_pairs': !exists(json, 'key_pairs') ? undefined : ((json['key_pairs'] as Array<any>).map(RecoveryJobKeyPairStatusFromJSON)),
        'instance_spec': !exists(json, 'instance_spec') ? undefined : ((json['instance_spec'] as Array<any>).map(RecoveryJobInstanceSpecStatusFromJSON)),
        'instances': !exists(json, 'instances') ? undefined : ((json['instances'] as Array<any>).map(RecoveryJobInstanceStatusFromJSON)),
    };
}

export function RecoveryGroupsGroupIdJobsJobIdMonitorsGet200ResponseToJSON(value?: RecoveryGroupsGroupIdJobsJobIdMonitorsGet200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'status': RecoveryJobStatusToJSON(value.status),
        'tenants': value.tenants === undefined ? undefined : ((value.tenants as Array<any>).map(RecoveryJobTenantStatusToJSON)),
        'security_groups': value.security_groups === undefined ? undefined : ((value.security_groups as Array<any>).map(RecoveryJobSecurityGroupStatusToJSON)),
        'networks': value.networks === undefined ? undefined : ((value.networks as Array<any>).map(RecoveryJobNetworkStatusToJSON)),
        'subnets': value.subnets === undefined ? undefined : ((value.subnets as Array<any>).map(RecoveryJobSubnetStatusToJSON)),
        'floating_ips': value.floating_ips === undefined ? undefined : ((value.floating_ips as Array<any>).map(RecoveryJobFloatingIpStatusToJSON)),
        'routers': value.routers === undefined ? undefined : ((value.routers as Array<any>).map(RecoveryJobRouterStatusToJSON)),
        'volumes': value.volumes === undefined ? undefined : ((value.volumes as Array<any>).map(RecoveryJobVolumeStatusToJSON)),
        'key_pairs': value.key_pairs === undefined ? undefined : ((value.key_pairs as Array<any>).map(RecoveryJobKeyPairStatusToJSON)),
        'instance_spec': value.instance_spec === undefined ? undefined : ((value.instance_spec as Array<any>).map(RecoveryJobInstanceSpecStatusToJSON)),
        'instances': value.instances === undefined ? undefined : ((value.instances as Array<any>).map(RecoveryJobInstanceStatusToJSON)),
    };
}

