import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box, FormGroup, FormLabel, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useTranslation } from 'react-i18next';
import { UseFormSetValue } from 'react-hook-form';

import DefaultSelect from '../../../../component/common/Select/DefaultSelect';
import TableChip from '../../../../component/common/Chip/TableChip';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import ActionButton from '../../../../component/common/Button/ActionButton';
import DialogText from '../../../../component/common/Dialog/DialogText';
import DialogAlert from '../../../../component/common/Alert/DialogAlert';
import { findLastWord } from '../../../../../libs/utils/commonFunction';
import { useGetOpenStackRecoveryPlans } from '../common/hook';
import DisabledFormTextField from '@/app/component/common/TextField/DisabledFormTextField';
import DefaultSpinner from '@/app/component/common/Skeleton/DefaultSpinner';
import CustomDivider from '@/app/component/common/Divider/CustomDivider';
import { useGetOpenStackProtectionGroups } from '../../common/hook';

interface JobInfoProps {
    selectedProtectionGroupID: number;
    setSelectedProtectionGroupID: React.Dispatch<React.SetStateAction<number>>;
    setValue: UseFormSetValue<any>;
}
/**
 * 클러스터, 보호그룹, 복구계획 정보
 */
const JobInfo = ({ selectedProtectionGroupID, setSelectedProtectionGroupID, setValue }: JobInfoProps) => {
    const { t } = useTranslation();
    const [showAbnormalState, setShowAbnormalState] = useState(false);

    // 보호그룹 목록 조회
    const { data: protectionGroupList } = useGetOpenStackProtectionGroups();

    // 보호그룹 리스트
    const protectionGroupOptions = useMemo(
        () =>
            protectionGroupList?.map((group: any) => {
                return { value: group.id, label: group.name };
            }),
        [protectionGroupList],
    );

    const { data: recoveryPlanList, isLoading: recoveryPlanLoading } =
        useGetOpenStackRecoveryPlans(selectedProtectionGroupID);

    const recoveryPlan = recoveryPlanList?.[0];

    useEffect(() => {
        if (recoveryPlan) {
            setValue('plan.id', recoveryPlan.id);
        } else {
            setValue('plan.id', 0);
        }
    }, [recoveryPlan, setValue]);

    return (
        <>
            <Wrapper>
                <Title>{t('DR.RECOVERY_JOB_INFO')}</Title>
                <FormWrapper>
                    <Info>
                        <FormGroup>
                            <DefaultSelect
                                name="protectionGroup"
                                options={protectionGroupOptions}
                                label={t('DR.PROTECTION_GROUP')}
                                onChange={(e: any) => {
                                    setSelectedProtectionGroupID(e.value);
                                }}
                                value={
                                    protectionGroupOptions?.filter((option: any) => {
                                        return Number(option.value) === Number(selectedProtectionGroupID);
                                    })[0]
                                }
                            />
                        </FormGroup>
                    </Info>
                </FormWrapper>
                {recoveryPlanLoading ? (
                    <DefaultSpinner />
                ) : (
                    <>
                        <FormWrapper>
                            <Info>
                                <FormGroup>
                                    <DisabledFormTextField
                                        name="plan"
                                        label={t('DR.RECOVERY_PLAN')}
                                        value={recoveryPlan?.name ?? '복구계획이 존재하지 않습니다.'}
                                    />
                                </FormGroup>
                            </Info>
                            <StateInfo>
                                <FormGroup sx={{ width: 'fit-content' }}>
                                    <Label>{t('DR.STATE')}</Label>
                                    <TableChip
                                        label={recoveryPlan?.state_code ?? 'none'}
                                        color={recoveryPlan?.state_code ?? 'none'}
                                        action={() => setShowAbnormalState(true)}
                                    />
                                </FormGroup>
                            </StateInfo>
                            <StateInfo>
                                <FormGroup sx={{ width: 'fit-content' }}>
                                    <Label>미러링 {t('DR.STATE')}</Label>
                                    <TableChip
                                        label={findLastWord(recoveryPlan?.mirror_state_code) ?? 'none'}
                                        color={findLastWord(recoveryPlan?.mirror_state_code) ?? 'none'}
                                        action={() => setShowAbnormalState(true)}
                                    />
                                </FormGroup>
                            </StateInfo>
                        </FormWrapper>
                        <FormWrapper>
                            <Info>
                                <FormGroup>
                                    <DisabledFormTextField
                                        name="protection_cluster"
                                        label={t('DR.ORI_CLUSTER')}
                                        value={recoveryPlan?.protection_cluster?.name ?? ''}
                                        state={recoveryPlan?.protection_cluster?.state_code}
                                    />
                                </FormGroup>
                            </Info>
                            <Info>
                                <FormGroup>
                                    <DisabledFormTextField
                                        label={t('DR.TYPE')}
                                        name="type"
                                        value={
                                            recoveryPlan
                                                ? recoveryPlan?.protection_cluster?.type_code.split('.')[2]
                                                : ''
                                        }
                                    />
                                </FormGroup>
                            </Info>
                            <Info>
                                <FormGroup>
                                    <DisabledFormTextField
                                        label={t('DR.OWNER_GROUP')}
                                        name="ownerGroup"
                                        value={recoveryPlan ? recoveryPlan?.protection_cluster?.owner_group.name : ''}
                                    />
                                </FormGroup>
                            </Info>
                        </FormWrapper>
                        <FormWrapper>
                            <Info>
                                <FormGroup>
                                    <DisabledFormTextField
                                        name="recovery_cluster"
                                        label={t('DR.RECOVERY_TARGET_CLUSTER')}
                                        value={recoveryPlan?.recovery_cluster?.name ?? ''}
                                        state={recoveryPlan?.recovery_cluster?.state_code}
                                    />
                                </FormGroup>
                            </Info>
                            <Info>
                                <FormGroup>
                                    <DisabledFormTextField
                                        label={t('DR.TYPE')}
                                        name="type"
                                        value={
                                            recoveryPlan ? recoveryPlan?.recovery_cluster?.type_code.split('.')[2] : ''
                                        }
                                    />
                                </FormGroup>
                            </Info>
                            <Info>
                                <FormGroup>
                                    <DisabledFormTextField
                                        label={t('DR.OWNER_GROUP')}
                                        name="ownerGroup"
                                        value={recoveryPlan ? recoveryPlan?.recovery_cluster?.owner_group.name : ''}
                                    />
                                </FormGroup>
                            </Info>
                        </FormWrapper>
                    </>
                )}
                {showAbnormalState && (
                    <DefaultDialog
                        maxWidth="xs"
                        open={showAbnormalState}
                        title={t('DR.RP.STATE_INFO')}
                        customActions={
                            <ActionButton
                                buttonType="close"
                                onClick={() => {
                                    setShowAbnormalState(false);
                                }}
                            />
                        }
                        isCustomActions={true}
                    >
                        <DialogText title={recoveryPlan.name} />
                        <ul>
                            {Object.keys(recoveryPlan.abnormal_state_reasons).map(v => {
                                return recoveryPlan.abnormal_state_reasons[v].map((message: any, i: number) => {
                                    return (
                                        <li key={`${v}-${message.code}-${i}`}>
                                            <DialogAlert type={v} message={message.code} />
                                        </li>
                                    );
                                });
                            })}
                        </ul>
                    </DefaultDialog>
                )}
            </Wrapper>
            <CustomDivider />
        </>
    );
};

export default JobInfo;

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

const Info = styled(Grid2).attrs({ xs: 12, md: 4 })``;

const StateInfo = styled(Grid2).attrs({ xs: 12, md: 1 })`
    display: flex;

    & .MuiChip-root {
        width: fit-content;
    }
`;

const Label = styled(FormLabel)`
    font-weight: 700;
    padding-bottom: 5px;
`;
