import { Box, FormGroup, FormLabel, Slider } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Control, Controller, useController, UseFormGetValues, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { OptionType, RPOs, SnapShotIntervals } from '../../../../../../@types';
import { findLastWord, sliderMarks } from '../../../../../../libs/utils/commonFunction';
import { sliderStyle } from '../../../../../../styles/SliderStyle';
import CustomDivider from '../../../../../component/common/Divider/CustomDivider';
import DefaultSelect from '../../../../../component/common/Select/DefaultSelect';
import FormTextField from '../../../../../component/common/TextField/FormTextField';

const intervalType = {
    'snapshot.interval.type.minutely': {
        min: 10,
        max: 59,
    },
    'snapshot.interval.type.hourly': {
        min: 1,
        max: 23,
    },
    'snapshot.interval.type.daily': {
        min: 1,
        max: 30,
    },
    'recovery.point.objective.type.minute': {
        min: 10,
        max: 59,
    },
    'recovery.point.objective.type.hour': {
        min: 1,
        max: 23,
    },
    'recovery.point.objective.type.day': {
        min: 1,
        max: 30,
    },
};

interface IForm {
    id: number;
    protection_cluster: {
        id: number;
    };
    name: string;
    remarks?: string;
    recovery_point_objective_type: RPOs;
    recovery_point_objective: number;
    recovery_time_objective: number;
    snapshot_interval_type: SnapShotIntervals;
    snapshot_interval: number;
    instances: any[];
}

interface ProtectionGroupSliderProps {
    control: Control<IForm, any>;
    trigger: UseFormTrigger<IForm>;
    getValues: UseFormGetValues<IForm>;
    setValue: UseFormSetValue<IForm>;
}

/**
 * 보호그룹 수정 RPO, 스냅샷 생성주기, RTO 설정하는 컴포넌트
 */
const ProtectionGroupSlider = ({ control, trigger, getValues, setValue }: ProtectionGroupSliderProps) => {
    const { t } = useTranslation();
    const { field: rpoTypeField } = useController({ control, name: 'recovery_point_objective_type' });
    const { field: snapShotIntervalField } = useController({ control, name: 'snapshot_interval_type' });

    /**
     * rpo Options
     */
    const RPOOptions = useMemo(
        () => [
            { value: 'recovery.point.objective.type.minute', label: '분' },
            { value: 'recovery.point.objective.type.hour', label: '시간' },
            { value: 'recovery.point.objective.type.day', label: '일' },
        ],
        [],
    );

    const getRPORules = useCallback(() => {
        if (findLastWord(rpoTypeField.value) === 'minute') {
            return {
                required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                max: {
                    value: intervalType[rpoTypeField.value].max,
                    message: t('FORM.VALIDATION.INTERVAL_MITUTE_MAX'),
                },
                min: {
                    value: intervalType[rpoTypeField.value].min,
                    message: t('FORM.VALIDATION.INTERVAL_MITUTE_MAX'),
                },
            };
        } else if (findLastWord(rpoTypeField.value) === 'hour') {
            return {
                required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                max: {
                    value: intervalType[rpoTypeField.value].max,
                    message: t('FORM.VALIDATION.INTERVAL_HOUR_MAX'),
                },
                min: {
                    value: intervalType[rpoTypeField.value].min,
                    message: t('FORM.VALIDATION.INTERVAL_HOUR_MIN'),
                },
            };
        } else {
            return {
                required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                max: {
                    value: intervalType[rpoTypeField.value].max,
                    message: t('FORM.VALIDATION.INTERVAL_DAY_MAX'),
                },
                min: {
                    value: intervalType[rpoTypeField.value].min,
                    message: t('FORM.VALIDATION.INTERVAL_DAY_MIN'),
                },
            };
        }
    }, [rpoTypeField.value, t]);

    const getSnapShotIntervalRules = useCallback(() => {
        if (findLastWord(snapShotIntervalField.value) === 'minutely') {
            return {
                required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                max: {
                    value: intervalType[snapShotIntervalField.value].max,
                    message: t('FORM.VALIDATION.INTERVAL_MITUTE_MAX'),
                },
                min: {
                    value: intervalType[snapShotIntervalField.value].min,
                    message: t('FORM.VALIDATION.INTERVAL_MITUTE_MAX'),
                },
            };
        } else if (findLastWord(snapShotIntervalField.value) === 'hourly') {
            return {
                required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                max: {
                    value: intervalType[snapShotIntervalField.value].max,
                    message: t('FORM.VALIDATION.INTERVAL_HOUR_MAX'),
                },
                min: {
                    value: intervalType[snapShotIntervalField.value].min,
                    message: t('FORM.VALIDATION.INTERVAL_HOUR_MIN'),
                },
            };
        } else {
            return {
                required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                max: {
                    value: intervalType[snapShotIntervalField.value].max,
                    message: t('FORM.VALIDATION.INTERVAL_DAY_MAX'),
                },
                min: {
                    value: intervalType[snapShotIntervalField.value].min,
                    message: t('FORM.VALIDATION.INTERVAL_DAY_MIN'),
                },
            };
        }
    }, [snapShotIntervalField.value, t]);
    /**
     * 스냅샷 생성주기 Options
     * RPO 가 분, 시간, 일 인지에 따라서 Option 목록이 달라진다.
     */
    const snapshotIntervalOptions = useMemo(() => {
        if (findLastWord(getValues('recovery_point_objective_type')) === 'minute') {
            return [{ value: 'snapshot.interval.type.minutely', label: '분' }];
        } else if (findLastWord(getValues('recovery_point_objective_type')) === 'hour') {
            return [
                { value: 'snapshot.interval.type.minutely', label: '분' },
                { value: 'snapshot.interval.type.hourly', label: '시간' },
            ];
        } else {
            return [
                { value: 'snapshot.interval.type.minutely', label: '분' },
                { value: 'snapshot.interval.type.hourly', label: '시간' },
                { value: 'snapshot.interval.type.daily', label: '일' },
            ];
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getValues, rpoTypeField.value]);

    useEffect(() => {
        trigger('recovery_point_objective');
        trigger('snapshot_interval');
    }, [trigger, rpoTypeField.value]);

    return (
        <FormWrapper>
            <SliderFormWrapper>
                <SliderWrapper>
                    <FormGroup>
                        <Label required>{t('DR.RPO')}</Label>
                        <SliderForm>
                            <DefaultSelect
                                name={rpoTypeField.name}
                                options={RPOOptions}
                                onChange={(option: OptionType) => {
                                    if (
                                        (findLastWord(snapShotIntervalField.value) === 'hourly' &&
                                            findLastWord(option.value) === 'minute') ||
                                        (findLastWord(snapShotIntervalField.value) === 'daily' &&
                                            findLastWord(option.value) === 'minute') ||
                                        (findLastWord(snapShotIntervalField.value) === 'daily' &&
                                            findLastWord(option.value) === 'hour')
                                    ) {
                                        setValue('snapshot_interval_type', 'snapshot.interval.type.minutely');
                                        setValue('snapshot_interval', 15);
                                    } else {
                                        rpoTypeField.onChange(option.value);
                                    }
                                }}
                                value={
                                    RPOOptions.filter(option => {
                                        return option.value === rpoTypeField.value;
                                    })[0]
                                }
                            />
                            <FormTextField<IForm>
                                label=""
                                name="recovery_point_objective"
                                control={control}
                                type="number"
                                hint={`${intervalType[rpoTypeField.value].min} ~ ${
                                    intervalType[rpoTypeField.value].max
                                }`}
                                customOnChangeRegExp={/^[\d]{0,2}$/}
                                rules={getRPORules()}
                            />
                        </SliderForm>
                        <Controller
                            control={control}
                            name="recovery_point_objective"
                            render={({ field }) => {
                                return (
                                    <Slider
                                        {...field}
                                        sx={sliderStyle}
                                        valueLabelDisplay="auto"
                                        aria-labelledby="discrete-slider"
                                        min={intervalType[rpoTypeField.value].min}
                                        max={intervalType[rpoTypeField.value].max}
                                        marks={sliderMarks(
                                            intervalType[rpoTypeField.value].min,
                                            intervalType[rpoTypeField.value].min,
                                            intervalType[rpoTypeField.value].max,
                                            intervalType[rpoTypeField.value].max,
                                        )}
                                    />
                                );
                            }}
                        />
                    </FormGroup>
                </SliderWrapper>
                <SliderWrapper>
                    <FormGroup>
                        <Label required>{t('DR.SNAPSHOT_INTERVAL')}</Label>
                        <SliderForm>
                            <DefaultSelect
                                name="snapShotIntervalField"
                                options={snapshotIntervalOptions}
                                onChange={(option: OptionType) => {
                                    snapShotIntervalField.onChange(option.value);
                                }}
                                value={
                                    snapshotIntervalOptions.filter(option => {
                                        return option.value === snapShotIntervalField.value;
                                    })[0]
                                }
                            />
                            <FormTextField<IForm>
                                label=""
                                name="snapshot_interval"
                                control={control}
                                type="number"
                                hint={`${intervalType[snapShotIntervalField.value].min} ~ ${
                                    intervalType[snapShotIntervalField.value].max
                                }`}
                                customOnChangeRegExp={/^[\d]{0,2}$/}
                                rules={getSnapShotIntervalRules()}
                            />
                        </SliderForm>
                        <Controller
                            control={control}
                            name="snapshot_interval"
                            render={({ field }) => {
                                return (
                                    <Slider
                                        {...field}
                                        sx={sliderStyle}
                                        valueLabelDisplay="auto"
                                        name="snapshotInterval"
                                        aria-labelledby="discrete-slider"
                                        min={intervalType[snapShotIntervalField.value].min}
                                        max={intervalType[snapShotIntervalField.value].max}
                                        marks={sliderMarks(
                                            intervalType[snapShotIntervalField.value].min,
                                            intervalType[snapShotIntervalField.value].min,
                                            intervalType[snapShotIntervalField.value].max,
                                            intervalType[snapShotIntervalField.value].max,
                                        )}
                                    />
                                );
                            }}
                        />
                    </FormGroup>
                </SliderWrapper>
                <SliderWrapper>
                    <FormGroup>
                        <SliderForm>
                            <FormTextField<IForm>
                                required={true}
                                label={t('DR.RTO(분)')}
                                name="recovery_time_objective"
                                control={control}
                                customOnChangeRegExp={/^[\d]{0,2}$/}
                                hint={'15~60'}
                                rules={{
                                    required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                    max: {
                                        value: 60,
                                        message: t('FORM.VALIDATION.RTO_MAX'),
                                    },
                                    min: {
                                        value: 15,
                                        message: t('FORM.VALIDATION.RTO_MIN'),
                                    },
                                }}
                            />
                        </SliderForm>
                        <Controller
                            control={control}
                            name="recovery_time_objective"
                            render={({ field }) => {
                                return (
                                    <Slider
                                        {...field}
                                        valueLabelDisplay="auto"
                                        aria-labelledby="discrete-slider"
                                        min={15}
                                        max={60}
                                        marks={sliderMarks(15, 15, 60, 60)}
                                    />
                                );
                            }}
                        />
                    </FormGroup>
                </SliderWrapper>
            </SliderFormWrapper>
            <CustomDivider />
        </FormWrapper>
    );
};

export default ProtectionGroupSlider;

const FormWrapper = styled(Box)`
    padding-left: 2rem;
    padding-right: 2rem;
`;

const SliderFormWrapper = styled(Grid2).attrs({ container: true, columnSpacing: 4 })`
    display: flex;
`;

const SliderWrapper = styled(Grid2).attrs({ xs: 12, sm: 6, lg: 4 })``;

const SliderForm = styled.div`
    display: flex;
    column-gap: 5px;
    .MuiFormControl-root {
        &:first-child {
            width: 50%;
        }
        &:last-child {
            width: 50%;
        }
    }
`;

const Label = styled(FormLabel)`
    font-weight: 700;
    padding-bottom: 5px;
`;
