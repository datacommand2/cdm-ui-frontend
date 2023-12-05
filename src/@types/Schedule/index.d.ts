/**
 * 스케쥴 관련 타입 정의
 */

/**
 * 스케쥴 타입
 */
type ScheduleTypeCode =
    | 'schedule.type.specified'
    | 'schedule.type.daily'
    | 'schedule.type.hourly'
    | 'schedule.type.weekly'
    | 'schedule.type.day-of-monthly'
    | 'schedule.type.week-of-monthly';

/**
 * 스케쥴 요일 타입
 */
type ScheduleDayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

/**
 * 스케쥴 몇번째 주 타입
 */
type ScheduleWeekOfMonth = '#1' | '#2' | '#3' | '#4' | 'L';

/**
 * 스케쥴 Interval Month 타입
 */
type ScheduleIntervalMonth = 1 | 2 | 3 | 4 | 6 | 12;

/**
 * 스케쥴 DayOfMonth 타입
 */
type ScheduleDayOfMonth =
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
    | 31
    | 'L';

/**
 * 스케쥴 타입 요일 Map
 */
export const ScheduleDayOfWeekMap: Record<ScheduleDayOfWeek, string> = {
    mon: '월요일',
    tue: '화요일',
    wed: '수요일',
    thu: '목요일',
    fri: '금요일',
    sat: '토요일',
    sun: '일요일',
};

/**
 * 스케쥴 몇 번쨰 주 Map
 */
export const ScheduleWeekOfMonthMap: Record<ScheduleWeekOfMonth, string> = {
    '#1': '첫 번째',
    '#2': '두 번째',
    '#3': '세 번째',
    '#4': '네 번째',
    L: '마지막',
};
