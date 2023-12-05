import { Box, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Control, Controller } from 'react-hook-form';

import DefaultRadioGroup from '@/app/component/common/RadioButton/DefaultRadioGroup';
import { IFormRecoveryJob } from '../common/type';
import CustomDivider from '@/app/component/common/Divider/CustomDivider';

const options = [{ value: 'dr.recovery.type.migration', label: '재해복구' }];

interface RecoveryTypeProps {
    control: Control<IFormRecoveryJob, any>;
}
/**
 * 복구유형을 변경
 */
const RecoveryType = ({ control }: RecoveryTypeProps) => {
    const { t } = useTranslation();
    return (
        <>
            <Wrapper>
                <Title>{t('DR.RECOVERY_TYPE')}</Title>
                <FormWrapper>
                    <RecoveryTypeWrapper>
                        <Controller
                            control={control}
                            name={'type_code'}
                            render={({ field }) => (
                                <DefaultRadioGroup
                                    {...field}
                                    onChange={e => {
                                        field.onChange(e.currentTarget.value);
                                    }}
                                    options={options}
                                />
                            )}
                        />
                    </RecoveryTypeWrapper>
                </FormWrapper>
            </Wrapper>
            <CustomDivider />
        </>
    );
};

export default RecoveryType;

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
