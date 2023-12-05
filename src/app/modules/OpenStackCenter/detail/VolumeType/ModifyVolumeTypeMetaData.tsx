import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { Box, FormGroup } from '@mui/material';
import styled from 'styled-components';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';

import { _modifyVolumeTypeMetaData } from '../../../../../api/center/cluster';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import ActionButton from '../../../../component/common/Button/ActionButton';
import DialogText from '../../../../component/common/Dialog/DialogText';
import { OpenStackCluster } from '../../../../../@types/Cluster';
import { OpenSatckStorage } from '../../../../../@types/Cluster/clusterService';
import FormTextField from '../../../../component/common/TextField/FormTextField';

interface ModifyVolumeTypeMetaDataProps {
    cluster: OpenStackCluster;
    volumeTypeDetail: OpenSatckStorage;
}

interface IForm {
    admin_client: string;
    admin_keyring: string;
}

/**
 * 클러스터 볼륨타입 메타데이터를 수정하는 컴포넌트
 */
const ModifyVolumeTypeMetaData = ({ cluster, volumeTypeDetail }: ModifyVolumeTypeMetaDataProps) => {
    const { t } = useTranslation();
    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { control, handleSubmit, resetField, getValues } = useForm<IForm>({
        defaultValues: {
            admin_client: '',
            admin_keyring: '',
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<IForm> = () => {
        setIsModalOpen(true);
    };

    // 클러스터 볼륨타입 메타데이터를 수정하는 함수
    const { isLoading: modifyLoading, mutate: modifyVolumeTypeMetaData } = useMutation(
        () => _modifyVolumeTypeMetaData(cluster.id, volumeTypeDetail.id, getValues()),
        {
            onSuccess: ([, , status]) => {
                if (status === 200) {
                    toast.success('클러스터 볼륨타입 메타데이터가 수정되었습니다.');
                }
                setIsModalOpen(false);
            },
        },
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={cluster.state_code === 'cluster.state.inactive'}>
                <FormGrid>
                    <FormItem>
                        <FormGroup>
                            <FormTextField<IForm>
                                label={'Client'}
                                required={true}
                                name="admin_client"
                                resetField={resetField}
                                control={control}
                                rules={{
                                    required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                }}
                            />
                        </FormGroup>
                    </FormItem>
                    <FormItem>
                        <FormGroup>
                            <FormTextField<IForm>
                                label={'Keyring'}
                                required={true}
                                name="admin_keyring"
                                resetField={resetField}
                                control={control}
                                rules={{
                                    required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                }}
                            />
                        </FormGroup>
                    </FormItem>
                </FormGrid>
                <Box sx={{ textAlign: 'right' }}>
                    <ActionButton buttonType="edit" type="submit" />
                </Box>
                {isModalOpen && (
                    <DefaultDialog
                        maxWidth="xs"
                        open={isModalOpen}
                        title={t('DR.CLUSTER_VOLUME_TYPE_METADATA')}
                        onClose={() => {
                            setIsModalOpen(false);
                        }}
                        onConfirm={modifyVolumeTypeMetaData}
                        isLoading={modifyLoading}
                        actionType="confirm"
                        buttonColor="primary"
                    >
                        <DialogText title={volumeTypeDetail.name} body={t('DR.DESCRIPTION_MODIFY_VOLUME_TYPE')} />
                    </DefaultDialog>
                )}
            </fieldset>
        </form>
    );
};

export default ModifyVolumeTypeMetaData;

const FormGrid = styled(Grid2).attrs({ container: true, columnSpacing: 4, rowSpacing: 1 })``;

const FormItem = styled(Grid2).attrs({ md: 6, xs: 12 })``;
