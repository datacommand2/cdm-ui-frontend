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
import type { ClusterStorage } from './ClusterStorage';
import {
    ClusterStorageFromJSON,
    ClusterStorageFromJSONTyped,
    ClusterStorageToJSON,
} from './ClusterStorage';
import type { ClusterVolume } from './ClusterVolume';
import {
    ClusterVolumeFromJSON,
    ClusterVolumeFromJSONTyped,
    ClusterVolumeToJSON,
} from './ClusterVolume';

/**
 * 클러스터 인스턴스의 볼륨
 * @export
 * @interface ClusterInstanceVolume
 */
export interface ClusterInstanceVolume {
    /**
     * 
     * @type {ClusterStorage}
     * @memberof ClusterInstanceVolume
     */
    storage?: ClusterStorage;
    /**
     * 
     * @type {ClusterVolume}
     * @memberof ClusterInstanceVolume
     */
    volume?: ClusterVolume;
    /**
     * 디바이스 경로
     * @type {string}
     * @memberof ClusterInstanceVolume
     */
    device_path?: string;
    /**
     * 부팅 순서
     * @type {number}
     * @memberof ClusterInstanceVolume
     */
    boot_index?: number;
}

/**
 * Check if a given object implements the ClusterInstanceVolume interface.
 */
export function instanceOfClusterInstanceVolume(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ClusterInstanceVolumeFromJSON(json: any): ClusterInstanceVolume {
    return ClusterInstanceVolumeFromJSONTyped(json, false);
}

export function ClusterInstanceVolumeFromJSONTyped(json: any, ignoreDiscriminator: boolean): ClusterInstanceVolume {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'storage': !exists(json, 'storage') ? undefined : ClusterStorageFromJSON(json['storage']),
        'volume': !exists(json, 'volume') ? undefined : ClusterVolumeFromJSON(json['volume']),
        'device_path': !exists(json, 'device_path') ? undefined : json['device_path'],
        'boot_index': !exists(json, 'boot_index') ? undefined : json['boot_index'],
    };
}

export function ClusterInstanceVolumeToJSON(value?: ClusterInstanceVolume | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'storage': ClusterStorageToJSON(value.storage),
        'volume': ClusterVolumeToJSON(value.volume),
        'device_path': value.device_path,
        'boot_index': value.boot_index,
    };
}

