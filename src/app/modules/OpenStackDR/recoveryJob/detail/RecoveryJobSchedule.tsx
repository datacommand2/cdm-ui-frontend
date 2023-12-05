import React from 'react';

import { findLastWord } from '../../../../../libs/utils/commonFunction';
import { Detail } from '../../../../component/common/Detail/Detail';
import { TEXT } from '../../../../../constant/text';
import { ScheduleWeekOfMonthOptions } from '../../../../../constant/selectOptions';

interface RecoveryJobScheduleProps {
    schedule: any;
}
/**
 * 스케쥴 관련 정보를 보여주는 컴포넌트
 */
const RecoveryJobSchedule = ({ schedule }: RecoveryJobScheduleProps) => {
    if (findLastWord(schedule.type) === 'specified') {
        // 특정 일시
        return <></>;
    }
    if (findLastWord(schedule.type) === 'hourly') {
        // 시간 스케쥴
        return (
            <>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text="실행 주기" />
                        <Detail.ContentBody>{schedule.interval_hour} 시</Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text="" />
                        <Detail.ContentBody>{}</Detail.ContentBody>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
            </>
        );
    }
    if (findLastWord(schedule.type) === 'daily') {
        // 일간 스케쥴
        return (
            <>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text="실행 주기" />
                        <Detail.ContentBody>
                            {schedule.interval_day}일 {schedule?.hour ?? 0}시 {schedule?.minute ?? 0}분
                        </Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text="" />
                        <Detail.ContentBody>{}</Detail.ContentBody>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
            </>
        );
    }
    if (findLastWord(schedule.type) === 'weekly') {
        // 주간 스케쥴
        return (
            <>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text="실행 주기" />
                        <Detail.ContentBody>
                            {`${schedule.interval_week}주 ${TEXT[schedule.day_of_week]}요일 ${schedule?.hour ?? 0}시 ${
                                schedule?.minute ?? 0
                            }분`}
                        </Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text="" />
                        <Detail.ContentBody>{}</Detail.ContentBody>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
            </>
        );
    }
    if (findLastWord(schedule.type) === 'day-of-monthly') {
        // 월간(일) 스케쥴
        return (
            <>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text="실행 주기" />
                        <Detail.ContentBody>
                            {`${schedule.interval_month}달 ${schedule.day_of_month}일 ${schedule?.hour ?? 0}시 ${
                                schedule?.minute ?? 0
                            }분`}
                        </Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text="" />
                        <Detail.ContentBody>{}</Detail.ContentBody>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
            </>
        );
    }
    if (findLastWord(schedule.type) === 'week-of-monthly') {
        // 월간(요일) 스케쥴
        return (
            <>
                <Detail.ContentWrapper>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text="실행 주기" />
                        <Detail.ContentBody>
                            {`${schedule.interval_month}달 ${
                                ScheduleWeekOfMonthOptions.filter(option => option.value === schedule.week_of_month)[0]
                                    .label
                            }주 ${TEXT[schedule.day_of_week]}요일 ${schedule?.hour ?? 0}시 ${schedule?.minute ?? 0}분`}
                        </Detail.ContentBody>
                    </Detail.ContentCell>
                    <Detail.ContentCell>
                        <Detail.ContentTitle text="" />
                        <Detail.ContentBody>{}</Detail.ContentBody>
                    </Detail.ContentCell>
                </Detail.ContentWrapper>
            </>
        );
    }
    return null;
};

export default RecoveryJobSchedule;
