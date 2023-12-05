import {
    ScheduleDayOfMonth,
    ScheduleDayOfWeek,
    ScheduleIntervalMonth,
    ScheduleTypeCode,
    ScheduleWeekOfMonth,
} from '@/@types/Schedule';

export interface IFormRecoveryJob {
    plan: {
        id: number;
    };
    type_code: 'dr.recovery.type.migration';
    recovery_point_type_code: 'dr.recovery.recovery_point.type.latest';
    schedule?: {
        activation_flag: boolean;
        start_at: number;
        type: ScheduleTypeCode;
        timezone: 'Asia/Seoul';
        interval_hour?: number;
        interval_day?: number;
        interval_week?: number;
        interval_month?: ScheduleIntervalMonth;
        week_of_month?: ScheduleWeekOfMonth;
        day_of_month?: ScheduleDayOfMonth;
        day_of_week?: ScheduleDayOfWeek;
        hour?: number;
        minute?: number;
        end_at?: number;
        message?: string;
        topic?: string;
        id?: string;
    };
    force: boolean;
    recovery_point_snapshot?: {
        id: number;
    };
    schedule_type: 'immediately' | 'specific_date' | 'schedule';
}
export interface IFormEditRecoveryJob extends IFormRecoveryJob {
    id: number;
}
