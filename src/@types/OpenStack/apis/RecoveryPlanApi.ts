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
  RecoveryGroupsGroupIdDelete200Response,
  RecoveryGroupsGroupIdPlansGet200Response,
  RecoveryGroupsGroupIdPlansPost201Response,
  RecoveryGroupsGroupIdPlansPost412Response,
  RecoveryGroupsGroupIdPlansPostRequest,
} from '../models/index';
import {
    RecoveryGroupsGroupIdDelete200ResponseFromJSON,
    RecoveryGroupsGroupIdDelete200ResponseToJSON,
    RecoveryGroupsGroupIdPlansGet200ResponseFromJSON,
    RecoveryGroupsGroupIdPlansGet200ResponseToJSON,
    RecoveryGroupsGroupIdPlansPost201ResponseFromJSON,
    RecoveryGroupsGroupIdPlansPost201ResponseToJSON,
    RecoveryGroupsGroupIdPlansPost412ResponseFromJSON,
    RecoveryGroupsGroupIdPlansPost412ResponseToJSON,
    RecoveryGroupsGroupIdPlansPostRequestFromJSON,
    RecoveryGroupsGroupIdPlansPostRequestToJSON,
} from '../models/index';

export interface RecoveryGroupsGroupIdPlansGetRequest {
    group_id: number;
    limit?: number;
    offset?: number;
    name?: string;
}

export interface RecoveryGroupsGroupIdPlansPlanIdDeleteRequest {
    group_id: number;
    plan_id: number;
}

export interface RecoveryGroupsGroupIdPlansPlanIdGetRequest {
    group_id: number;
    plan_id: number;
    group_snapshot_id?: number;
}

export interface RecoveryGroupsGroupIdPlansPlanIdPatchRequest {
    group_id: number;
    plan_id: number;
    recovery_groups_group_id_plans_post_request?: RecoveryGroupsGroupIdPlansPostRequest;
}

export interface RecoveryGroupsGroupIdPlansPostOperationRequest {
    group_id: number;
    recovery_groups_group_id_plans_post_request?: RecoveryGroupsGroupIdPlansPostRequest;
}

/**
 * RecoveryPlanApi - interface
 * 
 * @export
 * @interface RecoveryPlanApiInterface
 */
export interface RecoveryPlanApiInterface {
    /**
     * 설명추가
     * @summary 재해복구계획 목록 조회
     * @param {number} group_id 보호그룹 ID
     * @param {number} [limit] 한 페이지에 표시할 항목 개수
     * @param {number} [offset] 페이지에 표시할 항목 인덱스
     * @param {string} [name] 보호그룹 이름
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RecoveryPlanApiInterface
     */
    recoveryGroupsGroupIdPlansGetRaw(requestParameters: RecoveryGroupsGroupIdPlansGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdPlansGet200Response>>;

    /**
     * 설명추가
     * 재해복구계획 목록 조회
     */
    recoveryGroupsGroupIdPlansGet(requestParameters: RecoveryGroupsGroupIdPlansGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdPlansGet200Response>;

    /**
     * 설명추가
     * @summary 재해복구계획 삭제
     * @param {number} group_id 보호그룹 ID
     * @param {number} plan_id 재해복구계획 ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RecoveryPlanApiInterface
     */
    recoveryGroupsGroupIdPlansPlanIdDeleteRaw(requestParameters: RecoveryGroupsGroupIdPlansPlanIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdDelete200Response>>;

    /**
     * 설명추가
     * 재해복구계획 삭제
     */
    recoveryGroupsGroupIdPlansPlanIdDelete(requestParameters: RecoveryGroupsGroupIdPlansPlanIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdDelete200Response>;

    /**
     * 설명추가
     * @summary 재해복구계획 조회
     * @param {number} group_id 보호그룹 ID
     * @param {number} plan_id 재해복구계획 ID
     * @param {number} [group_snapshot_id] 보호 그룹 스냅샷 ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RecoveryPlanApiInterface
     */
    recoveryGroupsGroupIdPlansPlanIdGetRaw(requestParameters: RecoveryGroupsGroupIdPlansPlanIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdPlansPost201Response>>;

    /**
     * 설명추가
     * 재해복구계획 조회
     */
    recoveryGroupsGroupIdPlansPlanIdGet(requestParameters: RecoveryGroupsGroupIdPlansPlanIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdPlansPost201Response>;

    /**
     * 설명추가
     * @summary 재해복구계획 수정
     * @param {number} group_id 보호그룹 ID
     * @param {number} plan_id 재해복구계획 ID
     * @param {RecoveryGroupsGroupIdPlansPostRequest} [recovery_groups_group_id_plans_post_request] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RecoveryPlanApiInterface
     */
    recoveryGroupsGroupIdPlansPlanIdPatchRaw(requestParameters: RecoveryGroupsGroupIdPlansPlanIdPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdPlansPost201Response>>;

    /**
     * 설명추가
     * 재해복구계획 수정
     */
    recoveryGroupsGroupIdPlansPlanIdPatch(requestParameters: RecoveryGroupsGroupIdPlansPlanIdPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdPlansPost201Response>;

    /**
     * 설명추가
     * @summary 재해복구계획 등록
     * @param {number} group_id 보호그룹 ID
     * @param {RecoveryGroupsGroupIdPlansPostRequest} [recovery_groups_group_id_plans_post_request] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof RecoveryPlanApiInterface
     */
    recoveryGroupsGroupIdPlansPostRaw(requestParameters: RecoveryGroupsGroupIdPlansPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdPlansPost201Response>>;

    /**
     * 설명추가
     * 재해복구계획 등록
     */
    recoveryGroupsGroupIdPlansPost(requestParameters: RecoveryGroupsGroupIdPlansPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdPlansPost201Response>;

}

/**
 * 
 */
export class RecoveryPlanApi extends runtime.BaseAPI implements RecoveryPlanApiInterface {

    /**
     * 설명추가
     * 재해복구계획 목록 조회
     */
    async recoveryGroupsGroupIdPlansGetRaw(requestParameters: RecoveryGroupsGroupIdPlansGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdPlansGet200Response>> {
        if (requestParameters.group_id === null || requestParameters.group_id === undefined) {
            throw new runtime.RequiredError('group_id','Required parameter requestParameters.group_id was null or undefined when calling recoveryGroupsGroupIdPlansGet.');
        }

        const queryParameters: any = {};

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
        }

        if (requestParameters.name !== undefined) {
            queryParameters['name'] = requestParameters.name;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/recovery/groups/{group_id}/plans`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.group_id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RecoveryGroupsGroupIdPlansGet200ResponseFromJSON(jsonValue));
    }

    /**
     * 설명추가
     * 재해복구계획 목록 조회
     */
    async recoveryGroupsGroupIdPlansGet(requestParameters: RecoveryGroupsGroupIdPlansGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdPlansGet200Response> {
        const response = await this.recoveryGroupsGroupIdPlansGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 설명추가
     * 재해복구계획 삭제
     */
    async recoveryGroupsGroupIdPlansPlanIdDeleteRaw(requestParameters: RecoveryGroupsGroupIdPlansPlanIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdDelete200Response>> {
        if (requestParameters.group_id === null || requestParameters.group_id === undefined) {
            throw new runtime.RequiredError('group_id','Required parameter requestParameters.group_id was null or undefined when calling recoveryGroupsGroupIdPlansPlanIdDelete.');
        }

        if (requestParameters.plan_id === null || requestParameters.plan_id === undefined) {
            throw new runtime.RequiredError('plan_id','Required parameter requestParameters.plan_id was null or undefined when calling recoveryGroupsGroupIdPlansPlanIdDelete.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/recovery/groups/{group_id}/plans/{plan_id}`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.group_id))).replace(`{${"plan_id"}}`, encodeURIComponent(String(requestParameters.plan_id))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RecoveryGroupsGroupIdDelete200ResponseFromJSON(jsonValue));
    }

    /**
     * 설명추가
     * 재해복구계획 삭제
     */
    async recoveryGroupsGroupIdPlansPlanIdDelete(requestParameters: RecoveryGroupsGroupIdPlansPlanIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdDelete200Response> {
        const response = await this.recoveryGroupsGroupIdPlansPlanIdDeleteRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 설명추가
     * 재해복구계획 조회
     */
    async recoveryGroupsGroupIdPlansPlanIdGetRaw(requestParameters: RecoveryGroupsGroupIdPlansPlanIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdPlansPost201Response>> {
        if (requestParameters.group_id === null || requestParameters.group_id === undefined) {
            throw new runtime.RequiredError('group_id','Required parameter requestParameters.group_id was null or undefined when calling recoveryGroupsGroupIdPlansPlanIdGet.');
        }

        if (requestParameters.plan_id === null || requestParameters.plan_id === undefined) {
            throw new runtime.RequiredError('plan_id','Required parameter requestParameters.plan_id was null or undefined when calling recoveryGroupsGroupIdPlansPlanIdGet.');
        }

        const queryParameters: any = {};

        if (requestParameters.group_snapshot_id !== undefined) {
            queryParameters['group_snapshot_id'] = requestParameters.group_snapshot_id;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/recovery/groups/{group_id}/plans/{plan_id}`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.group_id))).replace(`{${"plan_id"}}`, encodeURIComponent(String(requestParameters.plan_id))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RecoveryGroupsGroupIdPlansPost201ResponseFromJSON(jsonValue));
    }

    /**
     * 설명추가
     * 재해복구계획 조회
     */
    async recoveryGroupsGroupIdPlansPlanIdGet(requestParameters: RecoveryGroupsGroupIdPlansPlanIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdPlansPost201Response> {
        const response = await this.recoveryGroupsGroupIdPlansPlanIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 설명추가
     * 재해복구계획 수정
     */
    async recoveryGroupsGroupIdPlansPlanIdPatchRaw(requestParameters: RecoveryGroupsGroupIdPlansPlanIdPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdPlansPost201Response>> {
        if (requestParameters.group_id === null || requestParameters.group_id === undefined) {
            throw new runtime.RequiredError('group_id','Required parameter requestParameters.group_id was null or undefined when calling recoveryGroupsGroupIdPlansPlanIdPatch.');
        }

        if (requestParameters.plan_id === null || requestParameters.plan_id === undefined) {
            throw new runtime.RequiredError('plan_id','Required parameter requestParameters.plan_id was null or undefined when calling recoveryGroupsGroupIdPlansPlanIdPatch.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/recovery/groups/{group_id}/plans/{plan_id}`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.group_id))).replace(`{${"plan_id"}}`, encodeURIComponent(String(requestParameters.plan_id))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: RecoveryGroupsGroupIdPlansPostRequestToJSON(requestParameters.recovery_groups_group_id_plans_post_request),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RecoveryGroupsGroupIdPlansPost201ResponseFromJSON(jsonValue));
    }

    /**
     * 설명추가
     * 재해복구계획 수정
     */
    async recoveryGroupsGroupIdPlansPlanIdPatch(requestParameters: RecoveryGroupsGroupIdPlansPlanIdPatchRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdPlansPost201Response> {
        const response = await this.recoveryGroupsGroupIdPlansPlanIdPatchRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 설명추가
     * 재해복구계획 등록
     */
    async recoveryGroupsGroupIdPlansPostRaw(requestParameters: RecoveryGroupsGroupIdPlansPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RecoveryGroupsGroupIdPlansPost201Response>> {
        if (requestParameters.group_id === null || requestParameters.group_id === undefined) {
            throw new runtime.RequiredError('group_id','Required parameter requestParameters.group_id was null or undefined when calling recoveryGroupsGroupIdPlansPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/recovery/groups/{group_id}/plans`.replace(`{${"group_id"}}`, encodeURIComponent(String(requestParameters.group_id))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RecoveryGroupsGroupIdPlansPostRequestToJSON(requestParameters.recovery_groups_group_id_plans_post_request),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RecoveryGroupsGroupIdPlansPost201ResponseFromJSON(jsonValue));
    }

    /**
     * 설명추가
     * 재해복구계획 등록
     */
    async recoveryGroupsGroupIdPlansPost(requestParameters: RecoveryGroupsGroupIdPlansPostOperationRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RecoveryGroupsGroupIdPlansPost201Response> {
        const response = await this.recoveryGroupsGroupIdPlansPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}