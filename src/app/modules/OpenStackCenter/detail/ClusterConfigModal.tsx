import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormGroup } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';

import useGetClusterConfig from '../../../../hooks/useGetClusterConfig';
import { _modifyClusterConfig } from '../../../../api/center/cluster';
import DefaultSkeleton from '../../../component/common/Skeleton/DefaultSkeleton';
import ActionButton from '../../../component/common/Button/ActionButton';
import DefaultDialog from '../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../component/common/Dialog/DialogText';
import { clusterConfigKeys } from '../../../../libs/utils/queryKeys';
import { OpenStackCluster } from '../../../../@types/Cluster';
import FormTextField from '../../../component/common/TextField/FormTextField';

interface IForm {
    timestamp_interval: number;
    reserved_sync_interval: number;
}

interface ClusterConfigModalProps {
    open: boolean;
    data: OpenStackCluster;
    handleClose: () => void;
}

/**
 * 클러스터 서비스 갱신 주기를 조회, 수정하는 컴포넌트
 */
const ClusterConfigModal = ({ open, data, handleClose }: ClusterConfigModalProps) => {
    const { t } = useTranslation();
    const [editModal, setEditModal] = useState(false);

    const clusterID = data.id;

    const { configLoading, clusterConfig } = useGetClusterConfig(clusterID);

    const { handleSubmit, control, resetField, setValue, getValues } = useForm<IForm>({
        defaultValues: {
            timestamp_interval: clusterConfig?.timestamp_interval ?? 5,
            reserved_sync_interval: clusterConfig?.reserved_sync_interval ?? 1,
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<IForm> = data => {
        setValue('timestamp_interval', Number(data.timestamp_interval));
        setValue('reserved_sync_interval', Number(data.reserved_sync_interval));
        setEditModal(true);
    };
    const queryClient = useQueryClient();

    // 클러스터 config를 수정하는 함수
    const { isLoading: editLoading, mutate: editClusterConfig } = useMutation(
        () => _modifyClusterConfig(clusterID, getValues()),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    toast.success('클러스터 서비스 갱신 주기가 수정되었습니다.');
                    queryClient.invalidateQueries(clusterConfigKeys.detail(clusterID));
                }
                setEditModal(false);
                setTimeout(() => {
                    handleClose();
                }, 50);
            },
        },
    );

    return (
        <>
            <Dialog open={open} maxWidth={'xs'} fullWidth>
                <DialogTitle>클러스터 서비스 갱신 주기 설정</DialogTitle>
                <Divider />
                {configLoading ? (
                    <>
                        <DefaultSkeleton />
                        <DefaultSkeleton />
                        <DefaultSkeleton />
                    </>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogContent>
                            <FormGroup>
                                <FormTextField<IForm>
                                    label={'클러스터 서비스 상태 정보 동기화 주기(분)'}
                                    required={true}
                                    name="timestamp_interval"
                                    type="number"
                                    resetField={resetField}
                                    control={control}
                                    customOnChangeRegExp={/^[\d]{0,2}$/}
                                    rules={{
                                        required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                        max: {
                                            value: 10,
                                            message: '최댓값은 10입니다.',
                                        },
                                        min: {
                                            value: 1,
                                            message: '최솟값은 10입니다.',
                                        },
                                    }}
                                    hint={'1 ~ 10'}
                                />
                            </FormGroup>
                            <FormGroup>
                                <FormTextField<IForm>
                                    label={'클러스터 자원 동기화 주기(분)'}
                                    required={true}
                                    name="reserved_sync_interval"
                                    type="number"
                                    resetField={resetField}
                                    control={control}
                                    customOnChangeRegExp={/^[\d]{0,1}$/}
                                    hint={'1 ~ 3'}
                                    rules={{
                                        required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                        max: {
                                            value: 3,
                                            message: '최댓값은 3입니다.',
                                        },
                                        min: {
                                            value: 1,
                                            message: '최솟값은 10입니다.',
                                        },
                                    }}
                                />
                            </FormGroup>
                            <Divider />
                        </DialogContent>
                        <DialogActions>
                            <ActionButton buttonType="cancel" onClick={handleClose} />
                            <ActionButton buttonType="edit" type="submit" />
                        </DialogActions>
                    </form>
                )}
            </Dialog>
            {editModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={editModal}
                    title={'클러스터 서비스 갱신 주기 수정'}
                    onClose={() => {
                        setEditModal(false);
                    }}
                    onConfirm={editClusterConfig}
                    isLoading={editLoading}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    <DialogText title={data.name} body={'클러스터 서비스 갱신 주기를 수정하시겠습니까?'} />
                </DefaultDialog>
            )}
        </>
    );
};

export default ClusterConfigModal;
