import { OptionType } from '@/@types';
import CustomDateTimePicker from '@/app/component/common/DateTimePicker/CustomDateTimePicker';
import DefaultSelect from '@/app/component/common/Select/DefaultSelect';
import {
    ScheduleDayOfMonthOptions,
    ScheduleDayOfWeekOptions,
    ScheduleHourOptions,
    ScheduleIntervalDayOptions,
    ScheduleIntervalHourOptions,
    ScheduleIntervalMonthOptions,
    ScheduleIntervalWeekOptions,
    ScheduleMinuteOptions,
    ScheduleWeekOfMonthOptions,
} from '@/constant/selectOptions';
import { FormGroup, FormLabel } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import dayjs from 'dayjs';
import { Control, Controller, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import styled from 'styled-components';
import { getI18n } from 'react-i18next';

interface ScheduleSpecificDateProps {
    watch: UseFormWatch<any>;
    setValue: UseFormSetValue<any>;
}

interface ScheduleProps {
    control: Control<any>;
    watch: UseFormWatch<any>;
}

/**
 * 복구작업에서 사용되는 특정 일시 캘린더
 */
export const ScheduleSpecificDate = ({ watch, setValue }: ScheduleSpecificDateProps) => {
    return (
        <ScheduleInfo>
            <FormGroup>
                <DateButtonWrapper>
                    <Label>실행 날짜</Label>
                    <CustomDateTimePicker
                        onChange={newValue => {
                            if (newValue) {
                                setValue('schedule.start_at', newValue.unix());
                            }
                        }}
                        value={dayjs.unix(watch('schedule.start_at'))}
                        disablePast={true}
                    />
                </DateButtonWrapper>
            </FormGroup>
        </ScheduleInfo>
    );
};

/**
 * 복구작업 interval_hour 컴포넌트
 */
export const IntervalHour = ({ control, watch }: ScheduleProps) => {
    return (
        <ScheduleInfo>
            <FormGroup>
                <Controller
                    control={control}
                    name="schedule.interval_hour"
                    render={({ field }) => {
                        return (
                            <DefaultSelect
                                {...field}
                                menuPlacement="top"
                                onChange={(e: OptionType) => {
                                    field.onChange(e.value);
                                }}
                                label="시간 마다"
                                options={ScheduleIntervalHourOptions}
                                value={
                                    ScheduleIntervalHourOptions.filter(option => {
                                        return option.value === watch('schedule.interval_hour');
                                    })[0]
                                }
                            />
                        );
                    }}
                />
            </FormGroup>
        </ScheduleInfo>
    );
};

/**
 * 복구작업 interval_day 컴포넌트
 */
export const IntervalDay = ({ control, watch }: ScheduleProps) => {
    return (
        <ScheduleInfo>
            <FormGroup>
                <Controller
                    control={control}
                    name="schedule.interval_day"
                    render={({ field }) => {
                        return (
                            <DefaultSelect
                                {...field}
                                menuPlacement="top"
                                onChange={(e: OptionType) => {
                                    field.onChange(e.value);
                                }}
                                label={getI18n().t('DR.DAYS')}
                                options={ScheduleIntervalDayOptions}
                                value={
                                    ScheduleIntervalDayOptions.filter(option => {
                                        return option.value === watch('schedule.interval_day');
                                    })[0]
                                }
                            />
                        );
                    }}
                />
            </FormGroup>
        </ScheduleInfo>
    );
};

/**
 * 복구작업 시 (hour) 컴포넌트
 */
export const Hour = ({ control, watch }: ScheduleProps) => {
    return (
        <ScheduleInfo>
            <FormGroup>
                <Controller
                    control={control}
                    name="schedule.hour"
                    render={({ field }) => {
                        return (
                            <DefaultSelect
                                {...field}
                                menuPlacement="top"
                                options={ScheduleHourOptions}
                                label={getI18n().t('DR.HOURS')}
                                onChange={(e: OptionType) => {
                                    field.onChange(e.value);
                                }}
                                value={
                                    ScheduleHourOptions.filter(option => {
                                        return option.value === watch('schedule.hour');
                                    })[0]
                                }
                            />
                        );
                    }}
                />
            </FormGroup>
        </ScheduleInfo>
    );
};

/**
 * 복구작업 분 (minute) 컴포넌트
 */
export const Minute = ({ control, watch }: ScheduleProps) => {
    return (
        <ScheduleInfo>
            <FormGroup>
                <Controller
                    control={control}
                    name="schedule.minute"
                    render={({ field }) => {
                        return (
                            <DefaultSelect
                                {...field}
                                menuPlacement="top"
                                options={ScheduleMinuteOptions}
                                label={getI18n().t('DR.MINUTES')}
                                onChange={(e: OptionType) => {
                                    field.onChange(e.value);
                                }}
                                value={
                                    ScheduleMinuteOptions.filter(option => {
                                        return option.value === watch('schedule.minute');
                                    })[0]
                                }
                            />
                        );
                    }}
                />
            </FormGroup>
        </ScheduleInfo>
    );
};

/**
 * 복구작업 interval_week 컴포넌트
 */
export const IntervalWeek = ({ control, watch }: ScheduleProps) => {
    return (
        <ScheduleInfo>
            <FormGroup>
                <Controller
                    control={control}
                    name="schedule.interval_week"
                    render={({ field }) => {
                        return (
                            <DefaultSelect
                                {...field}
                                menuPlacement="top"
                                label={getI18n().t('DR.WEEKS')}
                                options={ScheduleIntervalWeekOptions}
                                onChange={(e: OptionType) => {
                                    field.onChange(e.value);
                                }}
                                value={
                                    ScheduleIntervalWeekOptions.filter(option => {
                                        return option.value === watch('schedule.interval_week');
                                    })[0]
                                }
                            />
                        );
                    }}
                />
            </FormGroup>
        </ScheduleInfo>
    );
};

/**
 * 복구작업 요일(day_of_week) 컴포넌트
 */
export const DayOfWeek = ({ control, watch }: ScheduleProps) => {
    return (
        <ScheduleInfo>
            <FormGroup>
                <Controller
                    control={control}
                    name="schedule.day_of_week"
                    render={({ field }) => {
                        return (
                            <DefaultSelect
                                {...field}
                                menuPlacement="top"
                                options={ScheduleDayOfWeekOptions}
                                label={getI18n().t('DR.DAY_OF_WEEK')}
                                onChange={(e: OptionType) => {
                                    field.onChange(e.value);
                                }}
                                value={
                                    ScheduleDayOfWeekOptions.filter(option => {
                                        return option.value === watch('schedule.day_of_week');
                                    })[0]
                                }
                            />
                        );
                    }}
                />
            </FormGroup>
        </ScheduleInfo>
    );
};

/**
 * 복구작업 interval_month 컴포넌트
 */
export const IntervalMonth = ({ control, watch }: ScheduleProps) => {
    return (
        <ScheduleInfo>
            <FormGroup>
                <Controller
                    control={control}
                    name="schedule.interval_month"
                    render={({ field }) => {
                        return (
                            <DefaultSelect
                                {...field}
                                menuPlacement="top"
                                options={ScheduleIntervalMonthOptions}
                                label={getI18n().t('DR.MONTHS')}
                                onChange={(e: OptionType) => {
                                    field.onChange(e.value);
                                }}
                                value={
                                    ScheduleIntervalMonthOptions.filter(option => {
                                        return option.value === watch('schedule.interval_month');
                                    })[0]
                                }
                            />
                        );
                    }}
                />
            </FormGroup>
        </ScheduleInfo>
    );
};

/**
 * 복구작업 몇 번째 주(week_of_month) 컴포넌트
 */
export const WeekOfMonth = ({ control, watch }: ScheduleProps) => {
    return (
        <ScheduleInfo>
            <FormGroup>
                <Controller
                    control={control}
                    name="schedule.week_of_month"
                    render={({ field }) => {
                        return (
                            <DefaultSelect
                                {...field}
                                label={'주'}
                                menuPlacement="top"
                                options={ScheduleWeekOfMonthOptions}
                                onChange={(e: OptionType) => {
                                    field.onChange(e.value);
                                }}
                                value={
                                    ScheduleWeekOfMonthOptions.filter(option => {
                                        return option.value === watch('schedule.week_of_month');
                                    })[0]
                                }
                            />
                        );
                    }}
                />
            </FormGroup>
        </ScheduleInfo>
    );
};

/**
 * 복구작업 몇 일(day_of_month) 컴포넌트
 */
export const DayOfMonth = ({ control, watch }: ScheduleProps) => {
    return (
        <ScheduleInfo>
            <FormGroup>
                <Controller
                    control={control}
                    name="schedule.day_of_month"
                    render={({ field }) => {
                        return (
                            <DefaultSelect
                                {...field}
                                menuPlacement="top"
                                options={ScheduleDayOfMonthOptions}
                                label={getI18n().t('DR.DAY_OF_MONTH')}
                                onChange={(e: OptionType) => {
                                    field.onChange(e.value);
                                }}
                                value={
                                    ScheduleDayOfMonthOptions.filter(option => {
                                        return option.value === watch('schedule.day_of_month');
                                    })[0]
                                }
                            />
                        );
                    }}
                />
            </FormGroup>
        </ScheduleInfo>
    );
};

const DateButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    flex-direction: column;
    align-items: flex-start;

    & .MuiFormControl-root {
        width: 100%;
    }

    & .MuiInputBase-input {
        padding: 8px 14px;
    }
`;

const Label = styled(FormLabel)`
    font-weight: 700;
    padding-bottom: 5px;
`;

const ScheduleInfo = styled(Grid2).attrs({ xs: 12, md: 3 })`
    display: flex;
    flex-direction: column;
`;
