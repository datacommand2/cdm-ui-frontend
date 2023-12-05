import { CardActions, CardContent, Divider } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { _modifyRecoveryPlan } from '../../../../../api/dr/recoveryPlan';
import { PATHNAME } from '../../../../../constant/pathname';
import { recoveryPlanKeys } from '../../../../../libs/utils/queryKeys';
import { openStackRecoveryPlanEditAtom } from '../../../../../recoil/atom/OpenShiftRecoveryPlanAtom';
import ActionButton from '../../../../component/common/Button/ActionButton';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../component/common/Dialog/DialogText';
import { Hypervisor } from '../common/components';

interface InstanceMappingProps {
    setStep: any;
}

interface IForm {
    recovery_cluster: {
        id: number;
    };
    detail: {
        tenants: any[];
        availability_zones: any[];
        external_networks: any[];
        storages: any[];
        instances: any[];
    };
}

/**
 * 컴퓨트 노드 매핑하는 컴포넌트
 */
const EditInstanceMapping = ({ setStep }: InstanceMappingProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const location = useLocation();
    const groupID = location.state?.groupID;
    const planID = location.state?.planID;

    const recoveryPlanEdit = useRecoilValue(openStackRecoveryPlanEditAtom);
    const setRecoveryPlanEdit = useSetRecoilState(openStackRecoveryPlanEditAtom);

    const [editModal, setEditModal] = useState(false);

    /**
     * 복구계획을 수정하는 함수
     */
    const { isLoading: editLoading, mutate: editRecoveryPlan } = useMutation(
        () =>
            _modifyRecoveryPlan(groupID, planID, {
                plan: recoveryPlanEdit,
            }),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    queryClient.removeQueries(recoveryPlanKeys.all);
                    toast.success(t('DR.RP.SUCCESS_EDIT_PLAN'));
                    navigate(PATHNAME.OPENSTACK_PLAN);
                }
                setEditModal(false);
            },
        },
    );

    const { control, handleSubmit, getValues } = useForm<IForm>({
        defaultValues: {
            detail: recoveryPlanEdit.detail,
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<IForm> = () => {
        setEditModal(true);
    };

    const storeHypervisorResource = (values: IForm) => {
        setRecoveryPlanEdit({
            ...recoveryPlanEdit,
            detail: {
                ...recoveryPlanEdit.detail,
                instances: values.detail.instances,
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
                <Hypervisor control={control} type="edit" />
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <ActionButton
                    buttonType="cancel"
                    onClick={() => {
                        navigate(PATHNAME.OPENSTACK_PLAN);
                    }}
                />
                <ActionButton
                    buttonType="prev"
                    onClick={() => {
                        storeHypervisorResource(getValues());
                        setStep(3);
                    }}
                />
                <ActionButton buttonType="edit" type="submit" />
            </CardActions>
            {editModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={editModal}
                    title={t('DR.RP.PLAN_EDIT')}
                    onClose={() => {
                        setEditModal(false);
                    }}
                    onConfirm={editRecoveryPlan}
                    isLoading={editLoading}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    <DialogText title={recoveryPlanEdit.name} body={t('DR.RP.WANNA_EDIT')} />
                </DefaultDialog>
            )}
        </form>
    );
};

export default EditInstanceMapping;
