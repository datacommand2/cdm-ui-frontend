export type ServiceConfigKey = 'service_log_level' | 'service_log_store_period' | 'service_log_type';

export type ServiceConfigName =
    | 'cdm-cloud-api-gateway'
    | 'cdm-cloud-identity'
    | 'cdm-cloud-license'
    | 'cdm-cloud-notification'
    | 'cdm-cloud-scheduler'
    | 'cdm-cluster-manager'
    | 'cdm-dr-manager'
    | 'cdm-target-snapshot'
    | 'cdm-dr-migratord'
    | 'cdm-dr-mirrord'
    | 'cdm-openstack-request'
    | 'service_node';

export type ServiceNode = 'single' | 'multiple';
export type ServiceConfigLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type ServiceConfigStorePeriod =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | '11'
    | '12'
    | '13'
    | '14'
    | '15'
    | '16'
    | '17'
    | '18'
    | '19'
    | '20'
    | '21'
    | '22'
    | '23'
    | '24'
    | '25'
    | '26'
    | '27'
    | '28'
    | '29'
    | '30';

type ServiceConfigValue<T extends ServiceConfigKey> = T extends 'service_log_level'
    ? ServiceConfigLevel
    : T extends 'service_log_store_period'
    ? ServiceConfigStorePeriod
    : T extends 'service_log_type'
    ? ServiceNode
    : never;

/**
 * Service Config 인터페이스
 */
export interface ServiceConfig<T extends ServiceConfigKey = ServiceConfigKey> {
    key: T;
    name: ServiceConfigName;
    value: ServiceConfigValue<T>;
}
