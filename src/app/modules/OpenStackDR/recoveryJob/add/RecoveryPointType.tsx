import { Box, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Control, Controller } from 'react-hook-form';

import { IFormRecoveryJob } from '../common/type';
import DefaultRadioGroup from '@/app/component/common/RadioButton/DefaultRadioGroup';
import { RecoveryPointTypeOptions } from '@/constant/selectOptions';

interface protectionGroupSnapShotList {
    setIsAvailableHypervisorResource: React.Dispatch<React.SetStateAction<boolean>>;
    control: Control<IFormRecoveryJob, any>;
}
/**
 * 복구 데이터 시점을 선택
 */
const RecoveryPointType = ({ setIsAvailableHypervisorResource, control }: protectionGroupSnapShotList) => {
    const { t } = useTranslation();

    return (
        <Wrapper>
            <Title>{t('DR.RECOVERY_DATA_POINT_OF_TIME')}</Title>
            <FormWrapper>
                <RecoveryTypeWrapper>
                    <Controller
                        control={control}
                        name="recovery_point_type_code"
                        render={({ field }) => {
                            return (
                                <DefaultRadioGroup
                                    {...field}
                                    onChange={e => {
                                        if (e.currentTarget.value === 'dr.recovery.recovery_point.type.latest') {
                                            setIsAvailableHypervisorResource(true);
                                        }
                                        field.onChange(e.currentTarget.value);
                                    }}
                                    options={RecoveryPointTypeOptions}
                                />
                            );
                        }}
                    />
                </RecoveryTypeWrapper>
            </FormWrapper>
        </Wrapper>
    );
};

export default RecoveryPointType;

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

const RecoveryTypeWrapper = styled(Grid2).attrs({ xs: 4 })``;
