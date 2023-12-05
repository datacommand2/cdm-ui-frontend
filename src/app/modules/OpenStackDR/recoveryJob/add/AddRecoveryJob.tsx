import React, { useEffect, useState } from 'react';
import JobInfo from './JobInfo';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { CardActions, CardContent, DialogTitle, Divider, Typography, useTheme } from '@mui/material';
import { toast } from 'react-toastify';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import RecoveryType from './RecoveryType';
import ExecutionType from './ExecutionType';
import ActionButton from '../../../../component/common/Button/ActionButton';
import HypervisorResourceCheck from './HypervisorResourceCheck';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import HypervisorResource from './HypervisorResource';
import { _addRecoveryJob } from '../../../../../api/dr/recoveryJob';
import DialogText from '../../../../component/common/Dialog/DialogText';
import DialogAlert from '../../../../component/common/Alert/DialogAlert';
import { isAddableJob } from '../../../../../libs/utils/commonFunction';
import { PATHNAME } from '../../../../../constant/pathname';
import { useGetOpenStackRecoveryPlans } from '../common/hook';
import { IFormRecoveryJob } from '../common/type';
import RecoveryPointType from './RecoveryPointType';
import { createAddRequest } from '../common/utils';

/**
 * 복구작업을 추가하는 컴포넌트
 */
const AddRecoveryJob = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const { t } = useTranslation();
    const [addType, setAddType] = useState('default');
    const navigate = useNavigate();
    const location = useLocation();
    // 보호그룹의 ID
    const groupID = location.state.GroupID ?? 0;

    const [addModal, setAddModal] = useState(false);
    // 선택된 보호그룹 ID
    const [selectedProtectionGroupID, setSelectedProtectionGroupID] = useState<number>(groupID);

    // 하이퍼바이저 리소스 정보
    const [hypervisorResource, setHypervisorResource] = useState<any>(null);
    // 실행 타입이 "즉시" 인 경우 하이퍼바이저 리소스 확인 후 작업 생성 가능
    const [isAvailableHypervisorResource, setIsAvailableHypervisorResource] = useState(false);
    const [resourceModal, setResourceModal] = useState(false);

    useEffect(() => {
        setIsAvailableHypervisorResource(false);
        setHypervisorResource(null);
    }, [selectedProtectionGroupID]);

    // 복구계획 변경 함수

    const { data: recoveryPlanList } = useGetOpenStackRecoveryPlans(selectedProtectionGroupID);

    const { control, handleSubmit, setValue, watch, getValues } = useForm<IFormRecoveryJob>({
        defaultValues: {
            schedule_type: 'immediately',
            plan: {
                id: 0,
            },
            type_code: 'dr.recovery.type.migration',
            recovery_point_type_code: 'dr.recovery.recovery_point.type.latest',
            force: true,
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<IFormRecoveryJob> = data => {
        // 생성된 복구계획이 없는 경우
        if (data.plan.id === 0) {
            toast.warning(t('DR.RP.NO_PLAN'));
            return;
        }

        setAddModal(true);
    };

    // 복구작업을 추가하는 함수
    const { isLoading: addLoading, mutate: addRecoveryjob } = useMutation(
        () => _addRecoveryJob(selectedProtectionGroupID, createAddRequest(getValues())),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    toast.success(t('DR.RP.JOB_ADD_STORY'));
                    if (addType === 'custom') {
                        console.log('1');
                    } else {
                        navigate(PATHNAME.OPENSTACK_JOB);
                    }
                }
                setAddModal(false);
                setAddType('default');
            },
        },
    );

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                    <JobInfo
                        setValue={setValue}
                        selectedProtectionGroupID={selectedProtectionGroupID}
                        setSelectedProtectionGroupID={setSelectedProtectionGroupID}
                    />
                    <RecoveryType control={control} />
                    <ExecutionType watch={watch} control={control} />
                    <RecoveryPointType
                        setIsAvailableHypervisorResource={setIsAvailableHypervisorResource}
                        control={control}
                    />
                    {watch('schedule_type') === 'immediately' &&
                        watch('recovery_point_type_code') !== 'dr.recovery.recovery_point.type.latest' && (
                            <HypervisorResourceCheck
                                hypervisorResource={hypervisorResource}
                                setResourceModal={setResourceModal}
                                setIsAvailableHypervisorResource={setIsAvailableHypervisorResource}
                                watch={watch}
                            />
                        )}
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <ActionButton
                        buttonType="cancel"
                        type="cancle"
                        onClick={() => {
                            navigate(PATHNAME.OPENSTACK_JOB);
                        }}
                    />
                    <ActionButton
                        buttonType="add"
                        type="submit"
                        disabled={
                            watch('plan.id') === 0 ||
                            (watch('schedule_type') === 'immediately' && !isAvailableHypervisorResource)
                        }
                    />
                </CardActions>
                {resourceModal && (
                    <DefaultDialog
                        maxWidth="sm"
                        title={'하이퍼바이저 리소스 정보'}
                        open={resourceModal}
                        customDialogTitle={
                            <DialogTitle sx={{ display: 'flex' }}>
                                하이퍼바이저 리소스 정보
                                {hypervisorResource &&
                                    (hypervisorResource?.usable ? (
                                        <span className={`${mode}-success`}> (여유)</span>
                                    ) : (
                                        <span className={`${mode}-error`}> (부족)</span>
                                    ))}
                            </DialogTitle>
                        }
                        customActions={
                            <ActionButton
                                buttonType="confirm"
                                onClick={() => {
                                    setResourceModal(false);
                                }}
                            />
                        }
                        isCustomActions={true}
                    >
                        <HypervisorResource
                            groupID={selectedProtectionGroupID}
                            planID={getValues('plan.id')}
                            type={getValues('recovery_point_type_code')}
                            snapshotID={getValues('recovery_point_snapshot.id')}
                            setHypervisorResource={setHypervisorResource}
                        />
                    </DefaultDialog>
                )}
            </form>
            {addModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={addModal}
                    title={t('DR.RP.JOB_ADD')}
                    onClose={() => {
                        setAddModal(false);
                    }}
                    onConfirm={() => addRecoveryjob()}
                    isLoading={addLoading}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    {hypervisorResource && !hypervisorResource?.usable ? (
                        <DialogText
                            body={
                                <>
                                    <Typography>경고를 무시하고 작업을 추가하시겠습니까?</Typography>
                                    <DialogAlert type="warning" message={'하이퍼바이저 리소스가 부족합니다.'} />
                                </>
                            }
                        />
                    ) : (
                        <DialogText
                            body={
                                <>
                                    {isAddableJob(
                                        recoveryPlanList[0]?.recovery_cluster.state_code,
                                        recoveryPlanList[0]?.state_code,
                                        recoveryPlanList[0]?.mirror_state_code,
                                    )
                                        ? t('DR.RP.WANNA_ADD_JOB')
                                        : '복구작업을 추가할 수 없습니다.'}
                                    <ul>
                                        {Object.keys(recoveryPlanList?.[0].abnormal_state_reasons).length > 0
                                            ? Object.keys(recoveryPlanList?.[0].abnormal_state_reasons).map(v => {
                                                  return recoveryPlanList?.[0].abnormal_state_reasons[v].map(
                                                      (message: any, i: number) => {
                                                          return (
                                                              <li key={`${v}-${message.code}-${i}`}>
                                                                  <DialogAlert type={v} message={message.code} />
                                                              </li>
                                                          );
                                                      },
                                                  );
                                              })
                                            : null}
                                    </ul>
                                </>
                            }
                        />
                    )}
                </DefaultDialog>
            )}
        </>
    );
};

export default AddRecoveryJob;
