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


import * as runtime from '../runtime';
import type {
  RecoveryGroupsGet200Response,
  RecoveryGroupsGroupIdDelete200Response,
  RecoveryGroupsGroupIdSnapshotsGet200Response,
  RecoveryGroupsPost201Response,
  RecoveryGroupsPostRequest,
  RecoveryUnprotectedInstancesGet200Response,
} from '../models/index';
import {
    RecoveryGroupsGet200ResponseFromJSON,
    RecoveryGroupsGet200ResponseToJSON,
    RecoveryGroupsGroupIdDelete200ResponseFromJSON,
    RecoveryGroupsGroupIdDelete200ResponseToJSON,
    RecoveryGroupsGroupIdSnapshotsGet200ResponseFromJSON,
    RecoveryGroupsGroupIdSnapshotsGet200ResponseToJSON,
    RecoveryGroupsPost201ResponseFromJSON,
    RecoveryGroupsPost201ResponseToJSON,
    RecoveryGroupsPostRequestFromJSON,
    RecoveryGroupsPostRequestToJSON,
    RecoveryUnprotectedInstancesGet200ResponseFromJSON,
    RecoveryUnprotectedInstancesGet200ResponseToJSON,
} from '../models/index';

export interface RecoveryGroupsGetRequest {
    limit?: number;
    offset?: number;
    protection_cluster_id?: number;
    protection_cluster_type_code?: RecoveryGroupsGetProtectionClusterTypeCodeEnum;
    owner_group_id?: number;
    name?: string;
}

export interface RecoveryGroupsGroupIdDeleteRequest {
    group_id: number;
}

export interface RecoveryGroupsGroupIdGetRequest {
    group_id: number;
}

export interface RecoveryGroupsGroupIdPatchRequest {
    group_id: number;
    recovery_groups_post_request?: RecoveryGroupsPostRequest;
}

export interface RecoveryGroupsGroupIdSnapshotsGetRequest {
    group_id: number;
}

export interface RecoveryGroupsGroupIdSnapshotsPostRequest {
    group_id: number;
}

export interface RecoveryGroupsPostOperationRequest {
    recovery_groups_post_request?: RecoveryGroupsPostRequest;
}

export interface RecoveryUnprotectedInstancesGetRequest {
    cluster_id: number;
    limit?: number;
    offset?: number;
    cluster_tenant_id?: number;
    cluster_availability_zone_id?: number;
    cluster_hypervisor_id?: number;
    name?: string;
}

/**
 * ProtectionGroupApi - interface
 * 
 * @export
 * @interface ProtectionGroupApiInterface
 */
export interface ProtectionGroupApiInterface {
    /**
     * 설명추가
     * @summary 보호그룹 목록 조회
     * @param {number} [limit] 한 페이지에 표시할 항목 개수
     * @param {number} [offset] 페이지에 표시할 항목 인덱스
     * @param {number} [protection_cluster_id] 보호대상 클러스터 ID
     * @param {'cluster.type.openstack' | 'cluster.type.openshift' | 'cluster.type.kubernetes' | 'cluster.type.vmware'} [protection_cluster_type_code] 보호대상 클러스터 종류
     * @param {number} [owner_group_id] 보호그룹 원본 클러스터의 Owner 그룹 ID
     * @param {string} [name] 보호그룹 이름
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProtectionGroupApiInterface
     */
    recoveryGroupsGetRaw(requestParameters: RecoveryGroupsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGet200Response>>;

    /**
     * 설명추가
     * 보호그룹 목록 조회
     */
    recoveryGroupsGet(requestParameters: RecoveryGroupsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGet200Response>;

    /**
     * 설명추가
     * @summary 보호그룹 삭제
     * @param {number} group_id 보호그룹 ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProtectionGroupApiInterface
     */
    recoveryGroupsGroupIdDeleteRaw(requestParameters: RecoveryGroupsGroupIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdDelete200Response>>;

    /**
     * 설명추가
     * 보호그룹 삭제
     */
    recoveryGroupsGroupIdDelete(requestParameters: RecoveryGroupsGroupIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdDelete200Response>;

    /**
     * 설명추가
     * @summary 보호그룹 조회
     * @param {number} group_id 보호그룹 ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProtectionGroupApiInterface
     */
    recoveryGroupsGroupIdGetRaw(requestParameters: RecoveryGroupsGroupIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsPost201Response>>;

    /**
     * 설명추가
     * 보호그룹 조회
     */
    recoveryGroupsGroupIdGet(requestParameters: RecoveryGroupsGroupIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsPost201Response>;

    /**
     * 설명추가
     * @summary 보호그룹 수정
     * @param {number} group_id 보호그룹 ID
     * @param {RecoveryGroupsPostRequest} [recovery_groups_post_request] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProtectionGroupApiInterface
     */
    recoveryGroupsGroupIdPatchRaw(requestParameters: RecoveryGroupsGroupIdPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsPost201Response>>;

    /**
     * 설명추가
     * 보호그룹 수정
     */
    recoveryGroupsGroupIdPatch(requestParameters: RecoveryGroupsGroupIdPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsPost201Response>;

    /**
     * 설명추가
     * @summary 보호그룹 스냅샷 목록 조회
     * @param {number} group_id 보호그룹 ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProtectionGroupApiInterface
     */
    recoveryGroupsGroupIdSnapshotsGetRaw(requestParameters: RecoveryGroupsGroupIdSnapshotsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdSnapshotsGet200Response>>;

    /**
     * 설명추가
     * 보호그룹 스냅샷 목록 조회
     */
    recoveryGroupsGroupIdSnapshotsGet(requestParameters: RecoveryGroupsGroupIdSnapshotsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdSnapshotsGet200Response>;

    /**
     * 설명추가
     * @summary 보호그룹 스냅샷 추가
     * @param {number} group_id 보호그룹 ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProtectionGroupApiInterface
     */
    recoveryGroupsGroupIdSnapshotsPostRaw(requestParameters: RecoveryGroupsGroupIdSnapshotsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdDelete200Response>>;

    /**
     * 설명추가
     * 보호그룹 스냅샷 추가
     */
    recoveryGroupsGroupIdSnapshotsPost(requestParameters: RecoveryGroupsGroupIdSnapshotsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdDelete200Response>;

    /**
     * 설명추가
     * @summary 보호그룹 등록
     * @param {RecoveryGroupsPostRequest} [recovery_groups_post_request] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProtectionGroupApiInterface
     */
    recoveryGroupsPostRaw(requestParameters: RecoveryGroupsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsPost201Response>>;

    /**
     * 설명추가
     * 보호그룹 등록
     */
    recoveryGroupsPost(requestParameters: RecoveryGroupsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsPost201Response>;

    /**
     * 설명추가
     * @summary 클러스터 비보호 인스턴스 목록 조회
     * @param {number} cluster_id 클러스터 ID
     * @param {number} [limit] 한 페이지에 표시할 항목 개수
     * @param {number} [offset] 페이지에 표시할 항목 인덱스
     * @param {number} [cluster_tenant_id] 클러스터 테넌트 ID
     * @param {number} [cluster_availability_zone_id] 클러스터 가용구역 ID
     * @param {number} [cluster_hypervisor_id] 클러스터 Hypervisor ID
     * @param {string} [name] 인스턴스 이름
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ProtectionGroupApiInterface
     */
    recoveryUnprotectedInstancesGetRaw(requestParameters: RecoveryUnprotectedInstancesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryUnprotectedInstancesGet200Response>>;

    /**
     * 설명추가
     * 클러스터 비보호 인스턴스 목록 조회
     */
    recoveryUnprotectedInstancesGet(requestParameters: RecoveryUnprotectedInstancesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryUnprotectedInstancesGet200Response>;

}

/**
 * 
 */
export class ProtectionGroupApi extends runtime.BaseAPI implements ProtectionGroupApiInterface {

    /**
     * 설명추가
     * 보호그룹 목록 조회
     */
    async recoveryGroupsGetRaw(requestParameters: RecoveryGroupsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGet200Response>> {
        const queryParameters: any = {};

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
        }

        if (requestParameters.protection_cluster_id !== undefined) {
            queryParameters['protection_cluster_id'] = requestParameters.protection_cluster_id;
        }

        if (requestParameters.protection_cluster_type_code !== undefined) {
            queryParameters['protection_cluster_type_code'] = requestParameters.protection_cluster_type_code;
        }

        if (requestParameters.owner_group_id !== undefined) {
            queryParameters['owner_group_id'] = requestParameters.owner_group_id;
        }

        if (requestParameters.name !== undefined) {
            queryParameters['name'] = requestParameters.name;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/recovery/groups`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RecoveryGroupsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * 설명추가
     * 보호그룹 목록 조회
     */
    async recoveryGroupsGet(requestParameters: RecoveryGroupsGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGet200Response> {
        const response = await this.recoveryGroupsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 설명추가
     * 보호그룹 삭제
     */
    async recoveryGroupsGroupIdDeleteRaw(requestParameters: RecoveryGroupsGroupIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdDelete200Response>> {
        if (requestParameters.group_id === null || requestParameters.group_id === undefined) {
            throw new runtime.RequiredError('group_id','Required parameter requestParameters.group_id was null or undefined when calling recoveryGroupsGroupIdDelete.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/recovery/groups/{group_id}`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.group_id))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RecoveryGroupsGroupIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * 설명추가
     * 보호그룹 삭제
     */
    async recoveryGroupsGroupIdDelete(requestParameters: RecoveryGroupsGroupIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdDelete200Response> {
        const response = await this.recoveryGroupsGroupIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 설명추가
     * 보호그룹 조회
     */
    async recoveryGroupsGroupIdGetRaw(requestParameters: RecoveryGroupsGroupIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsPost201Response>> {
        if (requestParameters.group_id === null || requestParameters.group_id === undefined) {
            throw new runtime.RequiredError('group_id','Required parameter requestParameters.group_id was null or undefined when calling recoveryGroupsGroupIdGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/recovery/groups/{group_id}`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.group_id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RecoveryGroupsPost201ResponseFromJSON(jsonValue));
    }

    /**
     * 설명추가
     * 보호그룹 조회
     */
    async recoveryGroupsGroupIdGet(requestParameters: RecoveryGroupsGroupIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsPost201Response> {
        const response = await this.recoveryGroupsGroupIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 설명추가
     * 보호그룹 수정
     */
    async recoveryGroupsGroupIdPatchRaw(requestParameters: RecoveryGroupsGroupIdPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsPost201Response>> {
        if (requestParameters.group_id === null || requestParameters.group_id === undefined) {
            throw new runtime.RequiredError('group_id','Required parameter requestParameters.group_id was null or undefined when calling recoveryGroupsGroupIdPatch.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/recovery/groups/{group_id}`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.group_id))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: RecoveryGroupsPostRequestToJSON(requestParameters.recovery_groups_post_request),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RecoveryGroupsPost201ResponseFromJSON(jsonValue));
    }

    /**
     * 설명추가
     * 보호그룹 수정
     */
    async recoveryGroupsGroupIdPatch(requestParameters: RecoveryGroupsGroupIdPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsPost201Response> {
        const response = await this.recoveryGroupsGroupIdPatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 설명추가
     * 보호그룹 스냅샷 목록 조회
     */
    async recoveryGroupsGroupIdSnapshotsGetRaw(requestParameters: RecoveryGroupsGroupIdSnapshotsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdSnapshotsGet200Response>> {
        if (requestParameters.group_id === null || requestParameters.group_id === undefined) {
            throw new runtime.RequiredError('group_id','Required parameter requestParameters.group_id was null or undefined when calling recoveryGroupsGroupIdSnapshotsGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/recovery/groups/{group_id}/snapshots`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.group_id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RecoveryGroupsGroupIdSnapshotsGet200ResponseFromJSON(jsonValue));
    }

    /**
     * 설명추가
     * 보호그룹 스냅샷 목록 조회
     */
    async recoveryGroupsGroupIdSnapshotsGet(requestParameters: RecoveryGroupsGroupIdSnapshotsGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdSnapshotsGet200Response> {
        const response = await this.recoveryGroupsGroupIdSnapshotsGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 설명추가
     * 보호그룹 스냅샷 추가
     */
    async recoveryGroupsGroupIdSnapshotsPostRaw(requestParameters: RecoveryGroupsGroupIdSnapshotsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdDelete200Response>> {
        if (requestParameters.group_id === null || requestParameters.group_id === undefined) {
            throw new runtime.RequiredError('group_id','Required parameter requestParameters.group_id was null or undefined when calling recoveryGroupsGroupIdSnapshotsPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/recovery/groups/{group_id}/snapshots`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.group_id))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RecoveryGroupsGroupIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * 설명추가
     * 보호그룹 스냅샷 추가
     */
    async recoveryGroupsGroupIdSnapshotsPost(requestParameters: RecoveryGroupsGroupIdSnapshotsPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdDelete200Response> {
        const response = await this.recoveryGroupsGroupIdSnapshotsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 설명추가
     * 보호그룹 등록
     */
    async recoveryGroupsPostRaw(requestParameters: RecoveryGroupsPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsPost201Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/recovery/groups`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RecoveryGroupsPostRequestToJSON(requestParameters.recovery_groups_post_request),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RecoveryGroupsPost201ResponseFromJSON(jsonValue));
    }

    /**
     * 설명추가
     * 보호그룹 등록
     */
    async recoveryGroupsPost(requestParameters: RecoveryGroupsPostOperationRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsPost201Response> {
        const response = await this.recoveryGroupsPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 설명추가
     * 클러스터 비보호 인스턴스 목록 조회
     */
    async recoveryUnprotectedInstancesGetRaw(requestParameters: RecoveryUnprotectedInstancesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryUnprotectedInstancesGet200Response>> {
        if (requestParameters.cluster_id === null || requestParameters.cluster_id === undefined) {
            throw new runtime.RequiredError('cluster_id','Required parameter requestParameters.cluster_id was null or undefined when calling recoveryUnprotectedInstancesGet.');
        }

        const queryParameters: any = {};

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
        }

        if (requestParameters.cluster_id !== undefined) {
            queryParameters['cluster_id'] = requestParameters.cluster_id;
        }

        if (requestParameters.cluster_tenant_id !== undefined) {
            queryParameters['cluster_tenant_id'] = requestParameters.cluster_tenant_id;
        }

        if (requestParameters.cluster_availability_zone_id !== undefined) {
            queryParameters['cluster_availability_zone_id'] = requestParameters.cluster_availability_zone_id;
        }

        if (requestParameters.cluster_hypervisor_id !== undefined) {
            queryParameters['cluster_hypervisor_id'] = requestParameters.cluster_hypervisor_id;
        }

        if (requestParameters.name !== undefined) {
            queryParameters['name'] = requestParameters.name;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/recovery/unprotected-instances`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RecoveryUnprotectedInstancesGet200ResponseFromJSON(jsonValue));
    }

    /**
     * 설명추가
     * 클러스터 비보호 인스턴스 목록 조회
     */
    async recoveryUnprotectedInstancesGet(requestParameters: RecoveryUnprotectedInstancesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryUnprotectedInstancesGet200Response> {
        const response = await this.recoveryUnprotectedInstancesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const RecoveryGroupsGetProtectionClusterTypeCodeEnum = {
    openstack: 'cluster.type.openstack',
    openshift: 'cluster.type.openshift',
    kubernetes: 'cluster.type.kubernetes',
    vmware: 'cluster.type.vmware'
} as const;
export type RecoveryGroupsGetProtectionClusterTypeCodeEnum = typeof RecoveryGroupsGetProtectionClusterTypeCodeEnum[keyof typeof RecoveryGroupsGetProtectionClusterTypeCodeEnum];