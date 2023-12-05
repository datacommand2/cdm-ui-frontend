import i18n from '../libs/i18n/I18nConfig';

const t = i18n.t;
const StaleTime: number = 5 * (60 * 1000); // 5 mins

const RPOOptions = [
    { value: 'recovery.point.objective.type.minute', label: '분' },
    { value: 'recovery.point.objective.type.hour', label: '시간' },
    { value: 'recovery.point.objective.type.day', label: '일' },
];

interface RecoveryTypeOption {
    label: string;
    value: string;
}

const RecoveryTypeOptions: RecoveryTypeOption[] = [
    {
        label: t('DR.SIMULATION'),
        value: 'dr.recovery.type.simulation',
    },
    {
        label: t('DR.DISASTER_RECOVERY'),
        value: 'dr.recovery.type.migration',
    },
];

interface ExecutionTypeOption {
    label: string;
    value: string;
}
const ExecutionTypeOptions: ExecutionTypeOption[] = [
    { value: 'immediately', label: t('DR.IMMEDIATELY') },
    { value: 'specific_date', label: t('DR.SPECIFIC_DATE') },
    { value: 'schedule', label: t('DR.SCHEDULE_DATE') },
];

interface ScheduleTypeOption {
    label: string;
    value: string;
}

const ScheduleTypeOptions: ScheduleTypeOption[] = [
    {
        label: '시간',
        value: 'schedule.type.hourly',
    },
    { label: t('DR.DAILY'), value: 'schedule.type.daily' },
    { label: t('DR.WEEKLY'), value: 'schedule.type.weekly' },
    {
        label: t('DR.MONTHLY(WEEK)'),
        value: 'schedule.type.week-of-monthly',
    },
    {
        label: t('DR.MONTHLY(DAY)'),
        value: 'schedule.type.day-of-monthly',
    },
];
interface SnapShotScheduleTypeOption {
    label: string;
    value: string;
}

const SnapShotScheduleTypeOptions: SnapShotScheduleTypeOption[] = [
    {
        label: '분',
        value: 'schedule.type.minutely',
    },
    {
        label: '시간',
        value: 'schedule.type.hourly',
    },
    {
        label: '일',
        value: 'schedule.type.daily',
    },
    {
        label: '주',
        value: 'schedule.type.weekly',
    },
    {
        label: '월',
        value: 'schedule.type.monthly',
    },
    {
        label: '년',
        value: 'schedule.type.yearly',
    },
];

interface ScheduleIntervalDayOption {
    label: number;
    value: number;
}
/**
 * 스케쥴 일간 범위
 */
const ScheduleIntervalDayOptions: ScheduleIntervalDayOption[] = Array.from({ length: 15 }, (v, index) => ({
    label: index + 1,
    value: index + 1,
}));

interface ScheduleIntervalWeekOption {
    label: number;
    value: number;
}

/**
 * 스케쥴 주간 범위
 */
const ScheduleIntervalWeekOptions: ScheduleIntervalWeekOption[] = Array.from({ length: 4 }, (v, index) => ({
    label: index + 1,
    value: index + 1,
}));

interface ScheduleWeekOfMonthOption {
    label: string;
    value: string;
}
/**
 * 몇 번째 주 범위
 */
const ScheduleWeekOfMonthOptions: ScheduleWeekOfMonthOption[] = [
    { label: '첫 번째', value: '#1' },
    { label: '두 번째', value: '#2' },
    { label: '세 번째', value: '#3' },
    { label: '네 번째', value: '#4' },
    { label: '마지막', value: 'L' },
];

interface ScheduleIntervalMonthOption {
    label: number;
    value: number;
}
/**
 * 스케쥴 월간 범위
 */
const ScheduleIntervalMonthOptions: ScheduleIntervalMonthOption[] = [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 6, value: 6 },
    { label: 12, value: 12 },
];

interface ScheduleDayOfMonthOption {
    label: number | string;
    value: number | string;
}
/**
 * 몇 일
 */
const ScheduleDayOfMonthOptions: ScheduleDayOfMonthOption[] = ([] as ScheduleDayOfMonthOption[]).concat(
    ...Array.from({ length: 31 }, (_, index) => ({
        label: index + 1,
        value: index + 1,
    })),
    { label: '마지막', value: 'L' },
);

interface ScheduleDayOfWeekOption {
    label: string;
    value: string;
}

// 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'
/**
 * 요일 범위
 */
const ScheduleDayOfWeekOptions: ScheduleDayOfWeekOption[] = [
    {
        label: '일요일',
        value: 'sun',
    },
    {
        label: '월요일',
        value: 'mon',
    },
    {
        label: '화요일',
        value: 'tue',
    },
    {
        label: '수요일',
        value: 'wed',
    },
    {
        label: '목요일',
        value: 'thu',
    },
    {
        label: '금요일',
        value: 'fri',
    },
    {
        label: '토요일',
        value: 'sat',
    },
];

interface ScheduleTimeOption {
    label: number;
    value: number;
}

/**
 * 시간 스케쥴 범위
 */
const ScheduleIntervalHourOptions: ScheduleTimeOption[] = Array.from({ length: 23 }, (v, index) => ({
    label: index + 1,
    value: index + 1,
}));

/**
 * 스케쥴 시간 범위
 */
const ScheduleHourOptions: ScheduleTimeOption[] = Array.from({ length: 24 }, (v, index) => ({
    label: index,
    value: index,
}));

/**
 * 스케쥴 분 범위
 */
const ScheduleMinuteOptions: ScheduleTimeOption[] = Array.from({ length: 60 }, (v, index) => ({
    label: index,
    value: index,
}));

interface RecoveryPointTypeOption {
    label: string;
    value: string;
}
/**
 * 복구데이터 시점 옵션
 */
const RecoveryPointTypeOptions: RecoveryPointTypeOption[] = [
    // { label: '최신 스냅샷', value: 'dr.recovery.recovery_point.type.latest_snapshot' },
    // { label: '특정 스냅샷', value: 'dr.recovery.recovery_point.type.snapshot' },
    { label: '최신 데이터', value: 'dr.recovery.recovery_point.type.latest' },
];

interface ServiceConfigOption {
    label: string;
    value: string;
    isDisabled?: boolean;
}

/**
 * 서비스 설정 CDM-cloud 옵션
 */
const ServiceConfigCloudOptions: ServiceConfigOption[] = [
    {
        label: 'API Gateway',
        value: 'cdm-cloud-api-gateway',
    },
    {
        label: 'Identity',
        value: 'cdm-cloud-identity',
    },
    {
        label: 'License',
        value: 'cdm-cloud-license',
    },
    {
        label: 'Notification',
        value: 'cdm-cloud-notification',
    },
    {
        label: 'Scheduler',
        value: 'cdm-cloud-scheduler',
    },
];

/**
 * 서비스 설정 CDM-center 옵션
 */
const ServiceConfigCenterOptions: ServiceConfigOption[] = [
    {
        label: 'Cluster Manager',
        value: 'cdm-cluster-manager',
    },
];

/**
 * 서비스 설정 CDM-disasterrecovery 옵션
 */
const ServiceConfigDisasterRecoveryOptions: ServiceConfigOption[] = [
    {
        label: 'Disaster Recovery Manager',
        value: 'cdm-dr-manager',
    },
    {
        label: 'Disaster Recovery Snapshot',
        value: 'cdm-target-snapshot',
    },
    {
        label: 'Daemon Migrator',
        value: 'cdm-dr-migrator',
    },
    {
        label: 'Daemon Mirror',
        value: 'cdm-dr-mirrord',
    },
];

/**
 * 서비스 설정 Openstack 옵션
 */
const ServiceConfigOpenStackOptions: ServiceConfigOption[] = [
    {
        label: 'Openstack Request',
        value: 'cdm-openstack-request',
    },
];

/**
 * 서비스 설정 ServiceNode 옵션
 */
const ServiceConfigServiceNodeOptions: ServiceConfigOption[] = [
    {
        label: 'Service Node',
        value: 'service_node',
    },
];

/**
 * 서비스 설정 key 옵션
 */
const ServiceConfigKeyOptions: ServiceConfigOption[] = [
    {
        label: '옵션',
        value: 'none',
        isDisabled: true,
    },
    {
        label: 'Log Level',
        value: 'service_log_level',
    },
    {
        label: 'Log Store Period(days)',
        value: 'service_log_store_period',
    },
];

/**
 * service_node 일 경우 옵션
 */
const ServiceConfigServiceNodeKeyOptions: ServiceConfigOption[] = [
    {
        label: '옵션',
        value: 'none',
        isDisabled: true,
    },
    {
        label: 'Type',
        value: 'service_log_type',
    },
];

/**
 * 서비스 설정 key level 옵션
 */
const ServiceConfigKeyLevelOptions: ServiceConfigOption[] = [
    {
        label: 'Level',
        value: '',
        isDisabled: true,
    },
    {
        label: 'Trace',
        value: 'trace',
    },
    {
        label: 'Debug',
        value: 'debug',
    },
    {
        label: 'Info',
        value: 'info',
    },
    {
        label: 'Warn',
        value: 'warn',
    },
    {
        label: 'Error',
        value: 'error',
    },
    {
        label: 'Fatal',
        value: 'fatal',
    },
];

/**
 * service_node 일 경우 type 옵션
 */
const ServiceConfigServiceNodeKeyTypeOptions: ServiceConfigOption[] = [
    {
        label: 'LogType',
        value: '',
        isDisabled: true,
    },
    {
        label: 'Single',
        value: 'single',
    },
    {
        label: 'Multiple',
        value: 'multiple',
    },
];

/**
 * 이벤트 레벨 옵션
 */
const EventLevelOptions = [
    {
        value: '',
        label: 'level',
        isDisabled: true,
    },
    {
        value: 'all',
        label: 'all',
    },
    {
        value: 'fatal',
        label: 'fatal',
    },
    {
        value: 'error',
        label: 'error',
    },
    {
        value: 'warn',
        label: 'warn',
    },
    {
        value: 'info',
        label: 'info',
    },
    {
        value: 'trace',
        label: 'trace',
    },
];
export {
    StaleTime,
    RecoveryTypeOptions,
    ExecutionTypeOptions,
    ScheduleTypeOptions,
    ScheduleIntervalDayOptions,
    ScheduleHourOptions,
    ScheduleIntervalHourOptions,
    ScheduleMinuteOptions,
    ScheduleIntervalWeekOptions,
    ScheduleIntervalMonthOptions,
    ScheduleDayOfWeekOptions,
    ScheduleWeekOfMonthOptions,
    RecoveryPointTypeOptions,
    ScheduleDayOfMonthOptions,
    ServiceConfigKeyOptions,
    ServiceConfigKeyLevelOptions,
    ServiceConfigCloudOptions,
    ServiceConfigCenterOptions,
    ServiceConfigDisasterRecoveryOptions,
    ServiceConfigServiceNodeOptions,
    ServiceConfigOpenStackOptions,
    ServiceConfigServiceNodeKeyOptions,
    ServiceConfigServiceNodeKeyTypeOptions,
    RPOOptions,
    EventLevelOptions,
    SnapShotScheduleTypeOptions,
};
