import { Box, FormGroup, FormLabel, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import TableChip from '../../../../component/common/Chip/TableChip';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import ActionButton from '../../../../component/common/Button/ActionButton';
import DialogText from '../../../../component/common/Dialog/DialogText';
import { findLastWord } from '../../../../../libs/utils/commonFunction';
import DialogAlert from '../../../../component/common/Alert/DialogAlert';
import DisabledFormTextField from '@/app/component/common/TextField/DisabledFormTextField';
import CustomDivider from '@/app/component/common/Divider/CustomDivider';

interface JobInfoProps {
    recoveryJob: any;
}
/**
 * 클러스터, 보호그룹, 복구계획
 */
const JobInfo = ({ recoveryJob }: JobInfoProps) => {
    const { t } = useTranslation();
    const [showAbnormalState, setShowAbnormalState] = useState(false);

    console.log(recoveryJob);
    return (
        <>
            <Wrapper>
                <Title>{t('DR.RECOVERY_JOB_INFO')}</Title>
                <FormWrapper>
                    <Info>
                        <FormGroup>
                            <DisabledFormTextField
                                label={t('DR.PROTECTION_GROUP')}
                                name="protectionGroup"
                                value={recoveryJob?.group?.name}
                            />
                        </FormGroup>
                    </Info>
                </FormWrapper>
                <FormWrapper>
                    <Info>
                        <FormGroup>
                            <DisabledFormTextField
                                label={t('DR.RECOVERY_PLAN')}
                                name="recoveryPlan"
                                value={recoveryJob?.plan?.name}
                            />
                        </FormGroup>
                    </Info>
                    <StateInfo>
                        <FormGroup sx={{ width: 'fit-content' }}>
                            <Label>{t('DR.STATE')}</Label>
                            <TableChip
                                label={recoveryJob?.plan?.state_code ?? 'none'}
                                color={recoveryJob?.plan?.state_code ?? 'none'}
                                action={() => setShowAbnormalState(true)}
                            />
                        </FormGroup>
                    </StateInfo>
                    <StateInfo>
                        <FormGroup sx={{ width: 'fit-content' }}>
                            <Label>미러링 {t('DR.STATE')}</Label>
                            <TableChip
                                label={findLastWord(recoveryJob?.plan?.mirror_state_code) ?? 'none'}
                                color={findLastWord(recoveryJob?.plan?.mirror_state_code) ?? 'none'}
                                action={() => setShowAbnormalState(true)}
                            />
                        </FormGroup>
                    </StateInfo>
                </FormWrapper>
                <FormWrapper>
                    <Info>
                        <FormGroup>
                            <DisabledFormTextField
                                label={
                                    findLastWord(recoveryJob?.plan?.protection_cluster?.state_code) === 'inactive' ? (
                                        <div style={{ display: 'flex' }}>
                                            {t('DR.ORI_CLUSTER')}
                                            <span className="error-text">(클러스터 확인이 필요합니다.)</span>
                                        </div>
                                    ) : (
                                        t('DR.ORI_CLUSTER')
                                    )
                                }
                                name="protection_cluster"
                                value={recoveryJob?.plan?.protection_cluster?.name}
                                state={recoveryJob?.plan?.protection_cluster?.state_code}
                            />
                        </FormGroup>
                    </Info>
                    <Info>
                        <FormGroup>
                            <DisabledFormTextField
                                label={t('DR.TYPE')}
                                name="protection_cluster_type"
                                value={
                                    recoveryJob?.plan &&
                                    recoveryJob?.plan?.protection_cluster.type_code.split('.')[2].toUpperCase()
                                }
                            />
                        </FormGroup>
                    </Info>
                    <Info>
                        <FormGroup>
                            <DisabledFormTextField
                                label={t('DR.OWNER_GROUP')}
                                name="protection_cluster_ownergroup"
                                value={recoveryJob?.plan && recoveryJob?.plan?.protection_cluster.owner_group.name}
                            />
                        </FormGroup>
                    </Info>
                </FormWrapper>
                <FormWrapper>
                    <Info>
                        <FormGroup>
                            <DisabledFormTextField
                                label={
                                    findLastWord(recoveryJob?.plan?.recovery_cluster.state_code) === 'inactive' ? (
                                        <div style={{ display: 'flex' }}>
                                            {t('DR.RECOVERY_TARGET_CLUSTER')}
                                            <span className="error-text">(클러스터 확인이 필요합니다.)</span>
                                        </div>
                                    ) : (
                                        t('DR.RECOVERY_TARGET_CLUSTER')
                                    )
                                }
                                name="recovery_cluster"
                                value={recoveryJob?.plan?.recovery_cluster.name}
                                state={recoveryJob?.plan?.recovery_cluster.state_code}
                            />
                        </FormGroup>
                    </Info>
                    <Info>
                        <FormGroup>
                            <DisabledFormTextField
                                label={t('DR.TYPE')}
                                name="recoveryClusterType"
                                value={recoveryJob?.plan?.recovery_cluster.type_code.split('.')[2].toUpperCase()}
                            />
                        </FormGroup>
                    </Info>
                    <Info>
                        <FormGroup>
                            <DisabledFormTextField
                                label={t('DR.OWNER_GROUP')}
                                name="recoveryClusterOwnerGroup"
                                value={recoveryJob?.plan?.recovery_cluster.owner_group.name}
                            />
                        </FormGroup>
                    </Info>
                </FormWrapper>
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
                        <DialogText title={recoveryJob?.plan?.name} />
                        <ul>
                            {Object.keys(recoveryJob?.plan?.abnormal_state_reasons).map(v => {
                                return recoveryJob?.plan?.abnormal_state_reasons[v].map((message: any, i: number) => {
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
