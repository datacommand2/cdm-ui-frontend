import React from 'react';
import { Box, FormGroup } from '@mui/material';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Control, Controller, UseFormGetValues, UseFormResetField, UseFormSetValue } from 'react-hook-form';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import DefaultSelect from '../../../../../component/common/Select/DefaultSelect';
import CustomDivider from '../../../../../component/common/Divider/CustomDivider';
import { OptionType, RPOs, SnapShotIntervals } from '../../../../../../@types';
import { OpenStackClusters } from '../../../../../../@types/Cluster';
import FormTextField from '../../../../../component/common/TextField/FormTextField';
import DisabledFormTextField from '../../../../../component/common/TextField/DisabledFormTextField';
import { findLastWord } from '../../../../../../libs/utils/commonFunction';

interface IForm {
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
    clusterList: OpenStackClusters[];
    setValue: UseFormSetValue<IForm>;
    getValues: UseFormGetValues<IForm>;
}

/**
 * 보호그룹의 기본 정보(이름, 설명, RPO, RTO.. 등)를 설정하는 컴포넌트
 */
const ProtectionGroupInfo = ({ control, resetField, clusterList, getValues, setValue }: ProtectionGroupInfoProps) => {
    const { t } = useTranslation();

    const clusters = clusterList.map(cluster => {
        return { value: cluster.id, label: cluster.name, cluster_state: cluster.state_code };
    });

    const selectedCluster = clusterList.filter(cluster => cluster.id === getValues('protection_cluster.id'))[0];

    return (
        <FormWrapper>
            {/* 이름 */}
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
                {/* 클러스터 */}
                <Info>
                    <FormGroup>
                        <Controller
                            control={control}
                            name="protection_cluster.id"
                            render={({ field }) => {
                                return (
                                    <DefaultSelect
                                        {...field}
                                        options={clusters}
                                        onChange={(option: OptionType) => {
                                            field.onChange(option.value);
                                            setValue('instances', []);
                                        }}
                                        label={t('DR.CLUSTER')}
                                        value={
                                            clusters.filter(cluster => {
                                                return cluster.value === field.value;
                                            })[0]
                                        }
                                    />
                                );
                            }}
                        />
                    </FormGroup>
                </Info>
                {/* 클러스터 유형 */}
                <Info>
                    <DisabledFormTextField
                        name="cluster_type"
                        label={t('DR.TYPE')}
                        value={findLastWord(selectedCluster?.type_code).toUpperCase()}
                    />
                </Info>
                {/* 소유자 그룹 */}
                <Info>
                    <DisabledFormTextField
                        name="cluster_owner_group"
                        label={t('DR.OWNER_GROUP')}
                        value={selectedCluster?.owner_group?.name}
                    />
                </Info>
            </InfoWrapper>
            {/* 비고 */}
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
