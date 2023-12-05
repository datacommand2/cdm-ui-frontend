import { ScheduleDayOfMonth, ScheduleDayOfWeek, ScheduleIntervalMonth, ScheduleWeekOfMonth } from '../Schedule';

type Snapshot = {
    id: number;
    created_at: number;
};

export type ScheduleType = {
    activation_flag?: boolean;
    start_at: number;
    end_at?: number;
    type: ScheduleTypeCode;
    interval_day: number;
    interval_week: number;
    interval_hour?: number;
    interval_month: ScheduleIntervalMonth;
    week_of_month: ScheduleWeekOfMonth;
    day_of_month: ScheduleDayOfMonth;
    day_of_week: ScheduleDayOfWeek;
    hour: number;
    minute: number;
    timezone: string;
};
