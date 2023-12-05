import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Box, FormGroup, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { SubmitHandler, useForm } from 'react-hook-form';

import { _putClusterHypervisorInfo } from '../../../../../api/center/cluster';
import { clusterHypervisorKeys } from '../../../../../libs/utils/queryKeys';
import ActionButton from '../../../../component/common/Button/ActionButton';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../component/common/Dialog/DialogText';
import { OpenStackHyperviser } from '../../../../../@types/Cluster/clusterService';
import { OpenStackCluster } from '../../../../../@types/Cluster';
import { findLastWord } from '../../../../../libs/utils/commonFunction';
import FormTextField from '../../../../component/common/TextField/FormTextField';
import DisabledFormTextField from '../../../../component/common/TextField/DisabledFormTextField';

interface ModifyNodeInfoFormProps {
    hypervisorDetail: OpenStackHyperviser;
    clusterID: number;
    cluster: OpenStackCluster;
}

interface IForm {
    ssh_port: number;
    ssh_account: string;
    ssh_password: string;
    agent_port: number;
    agent_version: string;
    agent_installed_at: number;
    agent_last_upgraded_at: number;
}

/**
 * 클러스터 노드 추가 정보를 수정하는 컴포넌트
 */
const ModifyNodeInfoForm = ({ hypervisorDetail, clusterID, cluster }: ModifyNodeInfoFormProps) => {
    const { t } = useTranslation();
    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const { handleSubmit, control, resetField, setValue, getValues } = useForm<IForm>({
        defaultValues: {
            ssh_port: hypervisorDetail?.ssh_port ?? 0,
            ssh_account: hypervisorDetail?.ssh_account ?? '',
            ssh_password: hypervisorDetail?.ssh_password ?? '',
            agent_port: hypervisorDetail?.agent_port ?? 0,
            agent_version: hypervisorDetail?.agent_version ?? '',
            agent_installed_at: hypervisorDetail?.agent_installed_at ?? 0,
            agent_last_upgraded_at: hypervisorDetail?.agent_last_upgraded_at ?? 0,
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<IForm> = () => {
        setValue('agent_last_upgraded_at', Math.floor(Date.now() / 1000));
        if (!hypervisorDetail.agent_installed_at) {
            setValue('agent_installed_at', Math.floor(Date.now() / 1000));
        }
        setIsModalOpen(true);
    };

    // 클러스터 hypervisor 추가 정보를 수정하는 함수
    const { isLoading: modifyLoading, mutate: modifyHypervisorInfo } = useMutation(
        () =>
            _putClusterHypervisorInfo(clusterID, hypervisorDetail.id, {
                id: hypervisorDetail.id,
                ...getValues(),
            }),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    toast.success('클러스터 노드 추가 정보가 수정되었습니다.');
                    queryClient.invalidateQueries(clusterHypervisorKeys.details());
                }
                setIsModalOpen(false);
            },
        },
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={findLastWord(cluster?.state_code) === 'inactive'}>
                <FormGrid>
                    <FormItem>
                        <Typography variant="h6">SSH {t('DR.INFO')}</Typography>
                        <Box sx={{ padding: '0.25rem' }}>
                            <StyledFormGroup>
                                <FormTextField<IForm>
                                    label={t('DR.PORT')}
                                    required={true}
                                    name="ssh_port"
                                    resetField={resetField}
                                    control={control}
                                    rules={{
                                        required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                        pattern: {
                                            value: /[0-9]/g,
                                            message: '숫자만 입력가능합니다.',
                                        },
                                    }}
                                />
                            </StyledFormGroup>
                            <StyledFormGroup>
                                <FormTextField<IForm>
                                    label={t('DR.ACCOUNT')}
                                    required={true}
                                    name="ssh_account"
                                    resetField={resetField}
                                    control={control}
                                    rules={{
                                        required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                    }}
                                />
                            </StyledFormGroup>
                            <StyledFormGroup>
                                <FormTextField<IForm>
                                    label={t('DR.PASSWORD')}
                                    required={true}
                                    name="ssh_password"
                                    type="password"
                                    resetField={resetField}
                                    control={control}
                                    rules={{
                                        required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                    }}
                                />
                            </StyledFormGroup>
                        </Box>
                    </FormItem>
                    <FormItem>
                        <Typography variant="h6">Agent {t('DR.INFO')}</Typography>
                        <Box sx={{ padding: '0.25rem' }}>
                            <StyledFormGroup>
                                <FormTextField<IForm>
                                    label={t('DR.PORT')}
                                    required={true}
                                    name="agent_port"
                                    resetField={resetField}
                                    control={control}
                                    rules={{
                                        required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                        pattern: {
                                            value: /[0-9]/g,
                                            message: '숫자만 입력가능합니다.',
                                        },
                                    }}
                                />
                            </StyledFormGroup>
                            <FormGroup>
                                <FormTextField<IForm>
                                    label={t('DR.VERSION')}
                                    required={true}
                                    name="agent_version"
                                    resetField={resetField}
                                    control={control}
                                    rules={{
                                        required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                    }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <DisabledFormTextField
                                    name="agent_last_upgraded_at"
                                    label={t('DR.UPGRADED_AT')}
                                    value={
                                        hypervisorDetail.agent_last_upgraded_at
                                            ? dayjs
                                                  .unix(hypervisorDetail.agent_last_upgraded_at)
                                                  .format('YYYY-MM-DD HH:mm:ss')
                                            : 0
                                    }
                                />
                            </FormGroup>
                        </Box>
                    </FormItem>
                </FormGrid>
                <Box sx={{ textAlign: 'right' }}>
                    <ActionButton buttonType={'edit'} type={'submit'} />
                </Box>
            </fieldset>

            {isModalOpen && (
                <DefaultDialog
                    maxWidth="xs"
                    open={isModalOpen}
                    title={t('DR.MODIFY_NODE_INFO')}
                    onClose={() => {
                        setIsModalOpen(false);
                    }}
                    onConfirm={modifyHypervisorInfo}
                    isLoading={modifyLoading}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    <DialogText title={hypervisorDetail.hostname} body={t('DR.DESCRIPTION_MODIFY_NODE_INFO')} />
                </DefaultDialog>
            )}
        </form>
    );
};

export default ModifyNodeInfoForm;

const FormGrid = styled(Grid2).attrs({ container: true, spacing: 4 })``;

const FormItem = styled(Grid2).attrs({ md: 6, xs: 12 })``;

const StyledFormGroup = styled(FormGroup)`
    display: flex;
    flex-direction: column;
`;
