import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { IFormRecoveryJob } from '../common/type';
import DefaultRadioGroup from '@/app/component/common/RadioButton/DefaultRadioGroup';
import CustomDivider from '@/app/component/common/Divider/CustomDivider';

const CustomExecutionTypeOptions = [{ value: 'immediately', label: '즉시' }];

interface ExecutionTypeProps {
    control: Control<IFormRecoveryJob, any>;
    watch: UseFormWatch<IFormRecoveryJob>;
}
/**
 * 실행 정보를 변경하는 컴포넌트
 *  재해복구 - 즉시 - 최신데이터
 */
const ExecutionType = ({ control, watch }: ExecutionTypeProps) => {
    const { t } = useTranslation();

    return (
        <>
            <Wrapper>
                <Title>{t('실행정보')}</Title>
                <FormWrapper>
                    <RecoveryTypeWrapper>
                        <Controller
                            control={control}
                            name="schedule_type"
                            render={({ field }) => {
                                return (
                                    <DefaultRadioGroup
                                        {...field}
                                        onChange={e => {
                                            field.onChange(e);
                                        }}
                                        options={CustomExecutionTypeOptions}
                                    />
                                );
                            }}
                        />
                    </RecoveryTypeWrapper>
                </FormWrapper>
            </Wrapper>
            {watch('schedule_type') === 'immediately' && null}
            <CustomDivider />
        </>
    );
};

export default ExecutionType;

const Title = styled(Typography).attrs({ variant: 'h6' })`
    font-weight: 700;
    margin-bottom: 2rem;
`;

const Wrapper = styled(Box)`
    display: flex;
    flex-direction: column;
`;

const FormWrapper = styled(Grid2).attrs({ container: true, columnSpacing: 6 })`
    padding-left: 1rem;
    padding-right: 1rem;
`;

const RecoveryTypeWrapper = styled(Grid2).attrs({ xs: 12, md: 4 })``;
