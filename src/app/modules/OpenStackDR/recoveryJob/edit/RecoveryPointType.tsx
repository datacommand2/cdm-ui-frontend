import React from 'react';
import { FormGroup, Typography } from '@mui/material';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Control, Controller } from 'react-hook-form';

import { RecoveryPointTypeOptions } from '@/constant/selectOptions';
import { IFormEditRecoveryJob } from '../common/type';
import DefaultRadioGroup from '@/app/component/common/RadioButton/DefaultRadioGroup';

interface RecoveryPointType {
    control: Control<IFormEditRecoveryJob, any>;
}

/**
 * 복구데이터 시점 컴포넌트
 */
const RecoveryPointType = ({ control }: RecoveryPointType) => {
    const { t } = useTranslation();
    return (
        <>
            <Title>{t('DR.RECOVERY_DATA_POINT_OF_TIME')}</Title>
            <FormWrapper>
                <RecoveryTypeWrapper>
                    <FormGroup>
                        <Controller
                            control={control}
                            name={'recovery_point_type_code'}
                            render={({ field }) => (
                                <DefaultRadioGroup {...field} disabled options={RecoveryPointTypeOptions} />
                            )}
                        />
                    </FormGroup>
                </RecoveryTypeWrapper>
            </FormWrapper>
        </>
    );
};

export default RecoveryPointType;

const Title = styled(Typography).attrs({ variant: 'h6' })`
    font-weight: 700;
    margin-bottom: 2rem;
`;

const FormWrapper = styled(Grid2).attrs({ container: true, columnSpacing: 6 })`
    padding-left: 1rem;
    padding-right: 1rem;
`;

const RecoveryTypeWrapper = styled(Grid2).attrs({ xs: 12, md: 4 })``;
