import React from 'react';
import { Dialog, DialogContent, DialogTitle, Divider } from '@mui/material';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSignal } from '@preact/signals-react';

import { ServiceConfig, ServiceConfigKey } from '@/@types/Cloud/config';
import { serviceConfigKeys } from '@libs/utils/queryKeys';

import { useServiceConfigMutation } from './common/hooks';
import { defaultValues, getSubmitHandler, periodValidate } from './common/utils';
import { EditServiceConfigProps } from './common/types';
import { ServiceConfigDialog, ServiceConfigDialogActions, ServiceConfigFormGroup } from './common/components';

/**
 * 서비스 설정 수정 컴포넌트
 */
const EditServiceConfig = ({ open, onClose, services, type, title }: EditServiceConfigProps) => {
    const queryClient = useQueryClient();
    const editData = useSignal<ServiceConfig<ServiceConfigKey>[]>([]);
    const editModal = useSignal(false);

    /**
     * 서비스 설정 수정
     */
    const { isLoading: updateLoading, mutate: updateServiceConfig } = useServiceConfigMutation({
        data: editData.value,
        successCallback: () => {
            toast.success(`서비스 설정이 수정되었습니다.`);
            queryClient.invalidateQueries(serviceConfigKeys.all);
            onClose();
        },
        failureCallback: () => {
            onClose();
        },
    });

    const { control, handleSubmit } = useForm({
        defaultValues: defaultValues,
        mode: 'onChange',
    });

    return (
        <>
            <Dialog open={open} maxWidth={'xs'} fullWidth>
                <DialogTitle>{title} 수정</DialogTitle>
                <Divider />
                <form onSubmit={handleSubmit(getSubmitHandler(type, editData, services, editModal))}>
                    <DialogContent>
                        <ServiceConfigFormGroup
                            type={type}
                            isLoading={updateLoading}
                            control={control}
                            periodValidate={periodValidate}
                            onLogLevelChange={params => {
                                params.field.onChange(params.option.value);
                            }}
                            onLogTypeChange={params => {
                                params.field.onChange(params.option.value);
                            }}
                        />
                    </DialogContent>
                    <Divider />
                    <ServiceConfigDialogActions buttonType="edit" onClick={onClose} />
                </form>
            </Dialog>
            <ServiceConfigDialog
                title={`${title} 수정`}
                textTitle={`선택한 서비스의 ${title}을 수정하시겠습니까?`}
                body={type === 'service_log_level' ? '수정된 로그 레벨 설정은 서비스가 재시작되어야만 적용됩니다.' : ''}
                open={editModal.value}
                isLoading={updateLoading}
                onConfirm={updateServiceConfig}
                onClose={() => {
                    editModal.value = false;
                }}
            />
        </>
    );
};

export default EditServiceConfig;
