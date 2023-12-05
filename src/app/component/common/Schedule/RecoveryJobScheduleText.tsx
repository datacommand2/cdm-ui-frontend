import { ScheduleDayOfWeekMap, ScheduleWeekOfMonthMap } from '@/@types/Schedule';
import { Typography } from '@mui/material';
import React from 'react';
import { ScheduleType } from '../../../../@types/RecoveryJob';
import { findLastWord } from '../../../../libs/utils/commonFunction';

interface RecoveryJobScheduleProps {
    schedule: ScheduleType;
}
/**
 * 스케쥴 관련 정보를 보여주는 컴포넌트
 */
const RecoveryJobScheduleText = ({ schedule }: RecoveryJobScheduleProps) => {
    if (findLastWord(schedule.type) === 'specified') {
        // 특정 일시
        return <></>;
    }
    if (findLastWord(schedule.type) === 'hourly') {
        // 시간 스케쥴
        return <Typography>{schedule.interval_hour} 시</Typography>;
    }
    if (findLastWord(schedule.type) === 'daily') {
        // 일간 스케쥴
        return (
            <Typography>
                {schedule.interval_day}일 {schedule?.hour ?? 0}시 {schedule?.minute ?? 0}분
            </Typography>
        );
    }
    if (findLastWord(schedule.type) === 'weekly') {
        // 주간 스케쥴
        return (
            <Typography>{`${schedule.interval_week}주 ${ScheduleDayOfWeekMap[schedule.day_of_week]}요일 ${
                schedule?.hour ?? 0
            }시 ${schedule?.minute ?? 0}분`}</Typography>
        );
    }
    if (findLastWord(schedule.type) === 'day-of-monthly') {
        // 월간(일) 스케쥴
        return (
            <Typography>{`${schedule.interval_month}개월 ${schedule.day_of_month}일 ${schedule?.hour ?? 0}시 ${
                schedule?.minute ?? 0
            }분`}</Typography>
        );
    }
    if (findLastWord(schedule.type) === 'week-of-monthly') {
        // 월간(요일) 스케쥴
        return (
            <Typography>
                {`${schedule.interval_month}개월 ${ScheduleWeekOfMonthMap[schedule.week_of_month]}주 ${
                    ScheduleDayOfWeekMap[schedule.day_of_week]
                } ${schedule?.hour ?? 0}시 ${schedule?.minute ?? 0}분`}
            </Typography>
        );
    }
    return <></>;
};

export default RecoveryJobScheduleText;
