import { Box, FormGroup } from '@mui/material';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useTranslation } from 'react-i18next';
import { Control, UseFormResetField } from 'react-hook-form';

import DefaultSelect from '../../../../../component/common/Select/DefaultSelect';
import CustomDivider from '../../../../../component/common/Divider/CustomDivider';
import { RPOs, SnapShotIntervals } from '../../../../../../@types';
import FormTextField from '../../../../../component/common/TextField/FormTextField';
import DisabledFormTextField from '../../../../../component/common/TextField/DisabledFormTextField';

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

interface ProtectionGroupInfoProps {
    control: Control<IForm, any>;
    resetField: UseFormResetField<IForm>;
    protectionGroupDetail: any;
}

/**
 * 보호그룹의 기본 정보(이름, 설명, RPO, RTO.. 등)를 설정하는 컴포넌트
 */
const ProtectionGroupInfo = ({ control, resetField, protectionGroupDetail }: ProtectionGroupInfoProps) => {
    const { t } = useTranslation();
    const clusterOptions = useMemo(
        () => [
            {
                value: protectionGroupDetail.protection_cluster.id,
                label: protectionGroupDetail.protection_cluster.name,
                cluster_state: protectionGroupDetail.protection_cluster.state_code,
            },
        ],
        [protectionGroupDetail],
    );

    return (
        <FormWrapper>
            <NameWrapper>
                <Name>
                    <FormGroup>
                        <FormTextField<IForm>
                            label={t('DR.NAME')}
                            required={true}
                            name="name"
                            resetField={resetField}
                            control={control}
                            rules={{
                                required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                maxLength: { value: 50, message: t('DR.PROTECTION_GROUP_REQ') },
                            }}
                        />
                    </FormGroup>
                </Name>
            </NameWrapper>
            <InfoWrapper>
                <Info>
                    <FormGroup>
                        <DefaultSelect
                            name="cluster"
                            options={clusterOptions}
                            label={t('DR.CLUSTER')}
                            disabled={true}
                        />
                    </FormGroup>
                </Info>
                <Info>
                    <FormGroup>
                        <DisabledFormTextField
                            label={t('DR.TYPE')}
                            name="type"
                            value={protectionGroupDetail.protection_cluster.type_code.split('.')[2].toUpperCase()}
                        />
                    </FormGroup>
                </Info>
                <Info>
                    <FormGroup>
                        <DisabledFormTextField
                            label={t('DR.OWNER_GROUP')}
                            name="group"
                            value={protectionGroupDetail.owner_group.name}
                        />
                    </FormGroup>
                </Info>
            </InfoWrapper>

            <FormGroup>
                <FormTextField<IForm>
                    label="비고"
                    name="remarks"
                    multiline
                    rows={4}
                    control={control}
                    resetField={resetField}
                    rules={{
                        maxLength: { value: 300, message: t('DR.RP.ENTER_300') },
                    }}
                />
            </FormGroup>
            <CustomDivider />
        </FormWrapper>
    );
};

export default ProtectionGroupInfo;

const FormWrapper = styled(Box)`
    padding-left: 2rem;
    padding-right: 2rem;
`;

const InfoWrapper = styled(Grid2).attrs({ container: true, columnSpacing: 4 })`
    display: flex;
`;
const Info = styled(Grid2).attrs({ xs: 12, sm: 6, lg: 4 })``;

const NameWrapper = styled(Grid2).attrs({ container: true, columnSpacing: 4 })`
    display: flex;
`;

const Name = styled(Grid2).attrs({ xs: 12, sm: 6 })``;
