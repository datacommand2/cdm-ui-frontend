import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { CardActions, CardContent, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';

import { recoveryJobKeys } from '../../../../../libs/utils/queryKeys';
import { _getRecoveryJobDetail, _modifyRecoveryJob } from '../../../../../api/dr/recoveryJob';
import ActionButton from '../../../../component/common/Button/ActionButton';
import JobInfo from './JobInfo';
import ExecutionType from './ExecutionType';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../component/common/Dialog/DialogText';
import { isAddableJob } from '../../../../../libs/utils/commonFunction';
import DialogAlert from '../../../../component/common/Alert/DialogAlert';
import { PATHNAME } from '../../../../../constant/pathname';
import { IFormEditRecoveryJob } from '../common/type';
import RecoveryType from './RecoveryType';
import RecoveryPointType from './RecoveryPointType';
import { createEditRequest } from '../common/utils';

/**
 * 복구작업을 수정하는 컴포넌트
 */
const EditRecoveryJob = () => {
    const { t } = useTranslation();
    // 선택한 복구작업의 상세 정보
    const location = useLocation();
    const navigate = useNavigate();
    const protectionGroupID = location?.state?.GroupID;
    const recoveryJobID = location?.state?.JobID;

    const [editModal, setEditModal] = useState(false);
    const queryClient = useQueryClient();

    const { data: recoveryJob } = useQuery(
        recoveryJobKeys.detail(protectionGroupID, recoveryJobID),
        () => _getRecoveryJobDetail(protectionGroupID, recoveryJobID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.job;
                } else throw new Error();
            },
            suspense: true,
        },
    );

    const { control, handleSubmit, watch, getValues } = useForm<IFormEditRecoveryJob>({
        defaultValues: {
            id: recoveryJob.id,
            plan: {
                id: recoveryJob.plan.id,
            },
            type_code: recoveryJob.type_code,
            recovery_point_type_code: recoveryJob.recovery_point_type_code,
            schedule: recoveryJob?.schedule,
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<IFormEditRecoveryJob> = data => {
        // 복구계획의 상태 체크
        if (
            recoveryJob.plan.state_code === 'dr.recovery.plan.state.warning' ||
            recoveryJob.plan.state_code === 'dr.recovery.plan.state.critical'
        ) {
            toast.error(
                `복구계획의 상태가
              ${recoveryJob.plan.state_code.split('.')[4]} 입니다.`,
            );
            return;
        }

        // 현재시간보다 작으면
        // 특정 일시 + 현재 시간보다 작으면
        // 현재 시간보다 작은 경우
        if (recoveryJob?.schedule.type === 'specific_date' || recoveryJob?.schedule.type === 'schedule.type.hourly') {
            if (data.schedule?.start_at && data.schedule?.start_at <= dayjs().unix()) {
                toast.warning(t('DR.JOB_SCHEDULE_TIME_WARINING'));
                return;
            }
        }

        setEditModal(true);
    };

    // 복구작업을 수정하는 함수
    const { isLoading: modifyLoading, mutate: modifyRecoveryJob } = useMutation(
        () => _modifyRecoveryJob(protectionGroupID, recoveryJobID, createEditRequest(getValues())),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    navigate(PATHNAME.OPENSTACK_JOB);
                    queryClient.removeQueries(recoveryJobKeys.all);
                    toast.success(t('DR.RP.JOB_EDIT_STORY'));
                }
                setEditModal(false);
            },
        },
    );

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                    <JobInfo recoveryJob={recoveryJob} />
                    <RecoveryType control={control} />
                    <ExecutionType control={control} watch={watch} />
                    <RecoveryPointType control={control} />
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
                    <ActionButton buttonType="edit" type="submit" />
                </CardActions>
                {editModal && (
                    <DefaultDialog
                        title={'복구작업 수정'}
                        maxWidth="xs"
                        open={editModal}
                        onClose={() => {
                            setEditModal(false);
                        }}
                        onConfirm={modifyRecoveryJob}
                        isLoading={modifyLoading}
                        actionType="confirm"
                        buttonColor="primary"
                        isCustomActions={
                            isAddableJob(
                                recoveryJob?.plan?.recovery_cluster.state_code,
                                recoveryJob?.plan?.state_code,
                                recoveryJob?.plan?.mirror_state_code,
                            )
                                ? false
                                : true
                        }
                        customActions={
                            <ActionButton
                                buttonType="close"
                                onClick={() => {
                                    setEditModal(false);
                                }}
                            />
                        }
                    >
                        <DialogText
                            title={recoveryJob?.plan.name}
                            body={
                                <>
                                    {isAddableJob(
                                        recoveryJob?.plan?.recovery_cluster.state_code,
                                        recoveryJob?.plan?.state_code,
                                        recoveryJob?.plan?.mirror_state_code,
                                    )
                                        ? t('DR.RP.WANNA_EDIT_JOB')
                                        : '복구작업을 수정할 수 없습니다.'}
                                    <ul>
                                        {Object.keys(recoveryJob?.plan.abnormal_state_reasons).length > 0
                                            ? Object.keys(recoveryJob?.plan.abnormal_state_reasons).map(v => {
                                                  return recoveryJob?.plan.abnormal_state_reasons[v].map(
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
                    </DefaultDialog>
                )}
            </form>
        </>
    );
};

export default EditRecoveryJob;
