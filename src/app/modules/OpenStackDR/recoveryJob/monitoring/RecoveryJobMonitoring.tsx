/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';
import { useQuery } from '@tanstack/react-query';
import { Box, CardContent, Typography } from '@mui/material';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { useForm } from 'react-hook-form';

import { recoveryJobKeys } from '../../../../../libs/utils/queryKeys';
import WorkFlowTab from './WorkFlowTab';
import CustomCardHeader from '../../../../component/common/CardHeader/CustomCardHeader';
import DefaultChip from '../../../../component/common/Chip/DefaultChip';
import JobSummary from './JobSummary';
import DialogText from '../../../../component/common/Dialog/DialogText';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import JobMonitoringHeader from './JobMonitoringHeader';
import JobActions from './JobActions';
import { PATHNAME } from '../../../../../constant/pathname';
import MonitoringData from './monitoringTabs/MonitoringData';
import { findLastWord } from '../../../../../libs/utils/commonFunction';
import MonitoringButton from './monitoringTabs/MonitoringButton';
import { LoginUser } from '../../../../../recoil/atom/LoginUser';
import {
    useCancelRecoveryJob,
    useConfirmRecoveryJob,
    useExtendPauseTime,
    useExtendRollbackTime,
    useIgnoreRollbackRecoveryJob,
    usePauseRecoveryJob,
    useResumeRecoveryJob,
    useRetryRollbackRecoveryJob,
    useRollbackMigrationRecoveryJob,
    useRollbackSimulationRecoveryJob,
} from '../common/hook';
import { _getRecoveryJobDetail } from '@/api/dr/recoveryJob';
import FormTextField from '@/app/component/common/TextField/FormTextField';
import { edgesAtom, nodesAtom } from '@/recoil/atom/OpenShiftRecoveryPlanAtom';
import useDrawer from '@/hooks/useDrawer';

type TabValue =
    | 'floating_ip'
    | 'instance_spec'
    | 'instance'
    | 'network'
    | 'router'
    | 'security_group'
    | 'subnet'
    | 'tenant'
    | 'keypair'
    | 'volume';

const RecoveryJobMonitoring = () => {
    const resetNodes = useResetRecoilState(nodesAtom);
    const resetEdges = useResetRecoilState(edgesAtom);
    const { t } = useTranslation();

    const [value, setValue] = useState<TabValue>('instance');

    const selectTab = (e: any) => {
        setValue(e.currentTarget.value);
    };
    const socketUrl =
        process.env.NODE_ENV === 'development'
            ? 'http://192.168.2.151:8080/monitoring'
            : window.location.host + '/monitoring';
    const location = useLocation();
    const navigate = useNavigate();

    // modal 관련 상태
    const [pauseModal, setPauseModal] = useState(false);
    // action 관련 모달
    const [resumeModal, setResumeModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [simulationRollbackModal, setSimulationRollbackModal] = useState(false);
    const [migrationRollbackModal, setMigrationRollbackModal] = useState(false);
    const [retryRollbackModal, setRetryRollbackModal] = useState(false);
    const [ignoreRollbackModal, setIgnoreRollbackModal] = useState(false);
    const [confirmJobModal, setConfirmJobModal] = useState(false);

    const [extendModal, setExtendModal] = useState(false);
    const [extendRollbackModal, setExtendRollbackModal] = useState(false);

    const [extendTime, setExtendTime] = useState(60);
    const [rollbackTime, setRollbackTime] = useState(60);

    const [invalidExtendTime, setInvalidExtendTime] = useState(false);

    const [jobMonitor, setJobMonitor] = useState<any>();

    const loginUser = useRecoilValue(LoginUser);
    const role = loginUser?.roles ? loginUser.roles[0]?.role : 'user';

    let jobMonitorSocket = useRef<Socket | null>(null);

    const groupID = location?.state?.GroupID;
    const jobID = location?.state?.JobID;
    const typeCode = location?.state?.typeCode;

    const { openDrawer } = useDrawer();

    useEffect(() => {
        if (jobMonitor?.status?.state_code === 'dr.recovery.job.state.waiting') {
            toast.success('작업이 종료되었습니다.');
            navigate(PATHNAME['OPENSTACK_JOB']);
        }
    }, [jobMonitor?.status?.state_code, navigate]);

    const JOB_TYPE = typeCode === 'dr.recovery.type.migration' ? 'DISASTER_RECOVERY' : 'SIMULATION_TRAINING';

    useLayoutEffect(() => {
        if (!jobMonitorSocket.current) {
            jobMonitorSocket.current = io(socketUrl, {
                transports: ['websocket'],
                path: '/socket.io',
            });
        }
        return () => {
            if (jobMonitorSocket.current) {
                jobMonitorSocket.current.emit('monitoringEnd');
            }
        };
    }, [socketUrl]);

    useLayoutEffect(() => {
        if (jobMonitorSocket.current) {
            jobMonitorSocket.current.on('connect', () => {
                jobMonitorSocket.current!.emit('recoveryJobMonitor', {
                    session: localStorage.getItem('session'),
                    groupID: groupID,
                    jobID: jobID,
                    tenant: 1,
                    interval: 5,
                    socketID: jobMonitorSocket.current!.id,
                });
            });

            jobMonitorSocket.current.on('recoveryJobMonitor', (data: any) => {
                setJobMonitor(data);
            });

            jobMonitorSocket.current.on('connect_error', () => {
                setTimeout(() => {
                    jobMonitorSocket.current?.connect();
                }, 1500);
            });
        }
    }, [groupID, jobID]);
    useEffect(() => {
        return () => {
            resetNodes();
            resetEdges();
        };
    }, [resetEdges, resetNodes]);

    // 재해복구작업을 조회하는 함수
    const { data: recoveryJobDetail } = useQuery(
        recoveryJobKeys.detail(groupID, jobID),
        () => _getRecoveryJobDetail(groupID, jobID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.job;
                }
            },
            enabled: !!jobID && !!groupID,
            suspense: true,
        },
    );

    const handleClick = useCallback(() => {
        openDrawer(
            <JobSummary
                jobDetail={recoveryJobDetail}
                jobStatus={jobMonitor?.status}
                instances={jobMonitor?.instances}
                volumes={jobMonitor?.volumes}
            />,
        );
    }, [jobMonitor?.instances, jobMonitor?.status, jobMonitor?.volumes, openDrawer, recoveryJobDetail]);

    // 재해복구작업을 일시정지하는 함수
    const { mutate: pauseRecoveryJob, isLoading: pauseLoading } = usePauseRecoveryJob(groupID, jobID, () => {
        setPauseModal(false);
        toast.success(t('DR.SUCCESS_PAUSE'));
    });

    // 재해복구작업을 재개하는 함수
    const { mutate: resumeRecoveryJob, isLoading: resumeLoading } = useResumeRecoveryJob(groupID, jobID, () => {
        setResumeModal(false);
        toast.success(t('DR.SUCCESS_RESUME'));
    });

    // 재해복구작업을 롤백하는 함수 @@모의훈련
    const { mutate: rollbackSimulationJob, isLoading: simulationRollbackLoading } = useRollbackSimulationRecoveryJob(
        groupID,
        jobID,
        () => {
            setSimulationRollbackModal(false);
            toast.success(t('DR.SUCCESS_ROLLBACK'));
        },
    );

    // 재해복구작업을 롤백하는 함수 @@모의훈련
    const { mutate: rollbackMigrationJob, isLoading: migrationRollbackLoading } = useRollbackMigrationRecoveryJob(
        groupID,
        jobID,
        () => {
            setMigrationRollbackModal(false);
            toast.success(t('DR.SUCCESS_ROLLBACK'));
        },
    );

    // 재해복구작업을 취소하는 함수
    const { mutate: cancelRecoveryJob, isLoading: cancelJobLoading } = useCancelRecoveryJob(groupID, jobID, () => {
        setCancelModal(false);
        toast.success(t('DR.SUCCESS_CANCEL'));
    });

    // 재해복구작업을 확정하는 함수
    const { mutate: confirmRecoveryJob, isLoading: confirmLoading } = useConfirmRecoveryJob(groupID, jobID, () => {
        setConfirmJobModal(false);
        toast.success(t('DR.SUCCESS_CONFIRM'));
    });

    // 재해복구작업 롤백 재시도하는 함수
    const { mutate: retryRollbackRecoveryJob, isLoading: rollbackRetryLoading } = useRetryRollbackRecoveryJob(
        groupID,
        jobID,
        () => {
            setRetryRollbackModal(false);
            toast.success(t('DR.SUCCESS_RETRY_ROLLBACK'));
        },
    );

    // 재해복구작업 롤백 무시하는 함수
    const { mutate: ignoreRollbackRecoveryJob, isLoading: ignoreRollbackLoading } = useIgnoreRollbackRecoveryJob(
        groupID,
        jobID,
        () => {
            setRetryRollbackModal(false);
            toast.success(t('DR.SUCCESS_RETRY_ROLLBACK'));
        },
    );

    // 재해복구작업 일시중지 시간을 연장하는 함수
    const { mutate: extendPauseTime, isLoading: extendPauseLoading } = useExtendPauseTime(
        groupID,
        jobID,
        rollbackTime,
        () => {
            setExtendModal(false);
            toast.success(t('DR.SUCCESS_EXTEND'));
        },
    );

    // 재해복구작업 롤백 대기 시간을 연장하는 함수
    const { mutate: extendRollbackTime, isLoading: extendRollbackLoading } = useExtendRollbackTime(
        groupID,
        jobID,
        rollbackTime,
        () => {
            setExtendRollbackModal(false);
            toast.success(t('DR.SUCCESS_EXTEND_ROLLBACK'));
        },
    );

    /**
     * 현재 완료된 태스크의 개수를 계산하는 함수
     * state code 가 done, success, failed 일 때 result code 가 결과 값이 된다.
     */
    const ProgressCount = (data: any) => {
        let DoneCount;
        if (data) {
            if (data[0]?.state_code) {
                DoneCount = data.filter(
                    (v: any) =>
                        findLastWord(v.state_code) === 'done' ||
                        findLastWord(v.state_code) === 'success' ||
                        findLastWord(v.state_code) === 'failed',
                ).length;
            } else {
                DoneCount = 0;
            }
            const DataCount = data.length;

            return `${DoneCount} / ${DataCount}`;
        } else {
            return 0;
        }
    };

    /**
     * 태스크의 상태를 구하는 함수
     * waiting, runnung, done, failed
     */
    const CurrentResult = (data: any) => {
        // 복구작업 진행상황
        if (!jobMonitor?.status) {
            return 'job_init';
        }
        if (jobMonitor.status?.operation_code === 'run') {
            if (!data) {
                return 'job_init';
            }
            // 재해복구 진행중
            const finishedData = data.filter(
                (v: any) =>
                    findLastWord(v.state_code) === 'done' ||
                    findLastWord(v.state_code) === 'success' ||
                    findLastWord(v.state_code) === 'failed',
            );

            if (finishedData.length === 0) {
                return 'job_init';
            } else {
                const failedData = finishedData.filter((v: any) => findLastWord(v.result_code) === 'failed');
                const resultData = finishedData.filter((v: any) => findLastWord(v.result_code));

                if (failedData.length > 0) {
                    // 실패한 태스크가 하나라도 존재하면 해당 태스크는 실패
                    return 'failed';
                } else {
                    // result code 가 존재하면 해당 태스크는 완료됨
                    if (resultData.length === data.length) {
                        return 'job_success';
                    } else {
                        // 실패한 태스크가 없으면 runnung 중
                        // 몇개가 running 중 ?
                        return `job_running_${Math.round(((resultData.length / data.length) * 100) / 10) * 10}`;
                    }
                }
            }
        } else {
            if (!data) {
                return 'rollback_init';
            }
            // 롤백 진행상황
            // 재해복구 진행중
            const finishedData = data.filter(
                (v: any) =>
                    findLastWord(v.state_code) === 'done' ||
                    findLastWord(v.state_code) === 'success' ||
                    findLastWord(v.state_code) === 'failed',
            );

            if (finishedData.length === 0) {
                return 'rollback_init';
            } else {
                const failedData = finishedData.filter((v: any) => findLastWord(v.result_code) === 'failed');
                const resultData = finishedData.filter((v: any) => findLastWord(v.result_code));

                if (failedData.length > 0) {
                    // 실패한 태스크가 하나라도 존재하면 해당 태스크는 실패
                    return 'failed';
                } else {
                    // result code 가 존재하면 해당 태스크는 완료됨
                    if (resultData.length === data.length) {
                        return 'rollback_success';
                    } else {
                        // 실패한 태스크가 없으면 runnung 중
                        return `rollback_running${Math.round(((resultData.length / data.length) * 100) / 10) * 10}`;
                    }
                }
            }
        }
    };

    return (
        <>
            <CustomCardHeader
                title={t(`DR.RP.${JOB_TYPE}_PROGRESS`)}
                subheader={
                    <JobMonitoringHeader
                        jobStatus={jobMonitor?.status}
                        jobType={typeCode}
                        role={role}
                        setExtendRollbackModal={setExtendRollbackModal}
                    />
                }
                headerAction={
                    <JobActionWrapper>
                        <JobActions
                            jobStatus={jobMonitor?.status}
                            jobType={typeCode}
                            role={role}
                            setResumeModal={setResumeModal}
                            setCancelModal={setCancelModal}
                            setSimulationRollbackModal={setSimulationRollbackModal}
                            setMigrationRollbackModal={setMigrationRollbackModal}
                            setRetryRollbackModal={setRetryRollbackModal}
                            setIgnoreRollbackModal={setIgnoreRollbackModal}
                            setConfirmJobModal={setConfirmJobModal}
                        />
                        {recoveryJobDetail?.type_code && jobMonitor?.status?.state_code && (
                            <div>
                                <DefaultChip onClick={handleClick} color={'success'} label={t('TABLE.DETAILS')} />
                            </div>
                        )}
                    </JobActionWrapper>
                }
            />

            <CardContent>
                <div style={{ minHeight: '75vh' }}>
                    <WorkFlowTab jobDetail={recoveryJobDetail} jobMonitor={jobMonitor} />
                </div>
                <Grid sx={{ paddingTop: '2rem' }}>
                    <GridItem>
                        <MonitoringButton
                            operation={jobMonitor?.status?.operation_code}
                            onClick={selectTab}
                            state={CurrentResult(jobMonitor?.tenants)}
                            value="tenant"
                            idleText={
                                <>
                                    <TaskTitle>테넌트</TaskTitle>
                                    <TaskProgress>{ProgressCount(jobMonitor?.tenants)}</TaskProgress>
                                </>
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <MonitoringButton
                            operation={jobMonitor?.status?.operation_code}
                            onClick={selectTab}
                            state={CurrentResult(jobMonitor?.security_groups)}
                            value="security_group"
                            idleText={
                                <>
                                    <TaskTitle>보안그룹</TaskTitle>
                                    <TaskProgress>{ProgressCount(jobMonitor?.security_groups)}</TaskProgress>
                                </>
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <MonitoringButton
                            operation={jobMonitor?.status?.operation_code}
                            onClick={selectTab}
                            state={CurrentResult(jobMonitor?.networks)}
                            value="network"
                            idleText={
                                <>
                                    <TaskTitle>네트워크</TaskTitle>
                                    <TaskProgress>{ProgressCount(jobMonitor?.networks)}</TaskProgress>
                                </>
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <MonitoringButton
                            operation={jobMonitor?.status?.operation_code}
                            onClick={selectTab}
                            state={
                                jobMonitor?.status?.operation_code?.includes?.('rollback')
                                    ? CurrentResult(jobMonitor?.networks)
                                    : CurrentResult(jobMonitor?.subnets)
                            }
                            value="subnet"
                            idleText={
                                <>
                                    <TaskTitle>서브넷</TaskTitle>
                                    <TaskProgress>
                                        {jobMonitor?.status?.operation_code?.includes?.('rollback')
                                            ? ProgressCount(jobMonitor?.networks)
                                            : ProgressCount(jobMonitor?.subnets)}
                                    </TaskProgress>
                                </>
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <MonitoringButton
                            operation={jobMonitor?.status?.operation_code}
                            onClick={selectTab}
                            state={CurrentResult(jobMonitor?.floating_ip)}
                            value="floating_ip"
                            idleText={
                                <>
                                    <TaskTitle>플로팅 아이피</TaskTitle>
                                    <TaskProgress>{ProgressCount(jobMonitor?.floating_ip)}</TaskProgress>
                                </>
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <MonitoringButton
                            operation={jobMonitor?.status?.operation_code}
                            onClick={selectTab}
                            state={CurrentResult(jobMonitor?.routers)}
                            value="router"
                            idleText={
                                <>
                                    <TaskTitle>라우터</TaskTitle>
                                    <TaskProgress>{ProgressCount(jobMonitor?.routers)}</TaskProgress>
                                </>
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <MonitoringButton
                            operation={jobMonitor?.status?.operation_code}
                            onClick={selectTab}
                            state={CurrentResult(jobMonitor?.volumes)}
                            value="volume"
                            idleText={
                                <>
                                    <TaskTitle>볼륨</TaskTitle>
                                    <TaskProgress>{ProgressCount(jobMonitor?.volumes)}</TaskProgress>
                                </>
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <MonitoringButton
                            operation={jobMonitor?.status?.operation_code}
                            onClick={selectTab}
                            state={CurrentResult(jobMonitor?.keypair)}
                            value="keypair"
                            idleText={
                                <>
                                    <TaskTitle>키페어</TaskTitle>
                                    <TaskProgress>{ProgressCount(jobMonitor?.keypair)}</TaskProgress>
                                </>
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <MonitoringButton
                            operation={jobMonitor?.status?.operation_code}
                            onClick={selectTab}
                            state={CurrentResult(jobMonitor?.instance_specs)}
                            value="instance_spec"
                            idleText={
                                <>
                                    <TaskTitle>인스턴스 스펙</TaskTitle>
                                    <TaskProgress>{ProgressCount(jobMonitor?.instance_specs)}</TaskProgress>
                                </>
                            }
                        />
                    </GridItem>
                    <GridItem>
                        <MonitoringButton
                            operation={jobMonitor?.status?.operation_code}
                            onClick={selectTab}
                            state={CurrentResult(jobMonitor?.instances)}
                            value="instance"
                            idleText={
                                <>
                                    <TaskTitle>인스턴스</TaskTitle>
                                    <TaskProgress>{ProgressCount(jobMonitor?.instances)}</TaskProgress>
                                </>
                            }
                        />
                    </GridItem>
                </Grid>
                <ItemWrapper>
                    {value === 'tenant' && <MonitoringData data={jobMonitor?.tenants ?? []} type={'tenant'} />}
                    {value === 'security_group' && (
                        <MonitoringData data={jobMonitor?.security_groups ?? []} type={'security_group'} />
                    )}
                    {value === 'network' && <MonitoringData data={jobMonitor?.networks ?? []} type={'network'} />}
                    {value === 'subnet' && <MonitoringData data={jobMonitor?.subnets ?? []} type={'subnet'} />}
                    {value === 'floating_ip' && (
                        <MonitoringData data={jobMonitor?.floating_ip ?? []} type={'floating_ip'} />
                    )}
                    {value === 'router' && <MonitoringData data={jobMonitor?.routers ?? []} type={'router'} />}
                    {value === 'volume' && <MonitoringData data={jobMonitor?.volumes ?? []} type={'volume'} />}
                    {value === 'keypair' && <MonitoringData data={jobMonitor?.keypair ?? []} type={'keypair'} />}
                    {value === 'instance_spec' && (
                        <MonitoringData data={jobMonitor?.instance_specs ?? []} type={'instance_spec'} />
                    )}
                    {value === 'instance' && <MonitoringData data={jobMonitor?.instances ?? []} type={'instance'} />}
                </ItemWrapper>
                {/* 재해복구작업 재개 */}
                {resumeModal && (
                    <DefaultDialog
                        maxWidth="xs"
                        open={resumeModal}
                        title={t(`DR.${JOB_TYPE}_RESUME_JOB`)}
                        onClose={() => {
                            setResumeModal(false);
                        }}
                        onConfirm={resumeRecoveryJob}
                        isLoading={resumeLoading}
                        actionType="confirm"
                        buttonColor="success"
                    >
                        <DialogText body={t(`DR.${JOB_TYPE}_RESUME_JOB_STORY`)} />
                    </DefaultDialog>
                )}
                {/* 재해복구작업 일지중지 */}
                {pauseModal && (
                    <DefaultDialog
                        maxWidth="xs"
                        open={pauseModal}
                        title={t(`DR.${JOB_TYPE}_PAUSE_JOB`)}
                        onClose={() => {
                            setPauseModal(false);
                        }}
                        onConfirm={pauseRecoveryJob}
                        isLoading={pauseLoading}
                        actionType="confirm"
                        buttonColor="success"
                    >
                        <DialogText body={t(`DR.${JOB_TYPE}_PAUSE_JOB_STORY`)} />
                    </DefaultDialog>
                )}
                {/* 재해복구작업 취소 */}
                {cancelModal && (
                    <DefaultDialog
                        maxWidth="xs"
                        open={cancelModal}
                        title={t(`DR.${JOB_TYPE}_CANCEL_JOB`)}
                        onClose={() => {
                            setCancelModal(false);
                        }}
                        onConfirm={cancelRecoveryJob}
                        isLoading={cancelJobLoading}
                        actionType="confirm"
                        buttonColor="success"
                    >
                        <DialogText body={t(`DR.${JOB_TYPE}_CANCEL_JOB_STORY`)} />
                    </DefaultDialog>
                )}
                {/* 재해복구작업 롤백(재해복구) */}
                {migrationRollbackModal && (
                    <DefaultDialog
                        maxWidth="xs"
                        open={migrationRollbackModal}
                        title={t(`DR.${JOB_TYPE}_ROLLBACK_JOB`)}
                        onClose={() => {
                            setMigrationRollbackModal(false);
                        }}
                        onConfirm={rollbackMigrationJob}
                        isLoading={migrationRollbackLoading}
                        actionType="confirm"
                        buttonColor="success"
                    >
                        <DialogText
                            title={t(`DR.${JOB_TYPE}_ROLLBACK_JOB_STORY`)}
                            body={t(`DR.${JOB_TYPE}_ROLLBACK_JOB_STORY_BODY`)}
                        />
                    </DefaultDialog>
                )}
                {/* 재해복구작업 확정 */}
                {confirmJobModal && (
                    <DefaultDialog
                        maxWidth="xs"
                        open={confirmJobModal}
                        title={t('DR.CONFIRM_JOB')}
                        onClose={() => {
                            setConfirmJobModal(false);
                        }}
                        onConfirm={confirmRecoveryJob}
                        isLoading={confirmLoading}
                        actionType="confirm"
                        buttonColor="success"
                    >
                        <DialogText title={t('DR.CONFIRM_JOB_STORY')} body={t('DR.CONFIRM_JOB_STORY_BODY')} />
                    </DefaultDialog>
                )}
                {/* 재해복구작업 롤백 재시도 */}
                {retryRollbackModal && (
                    <DefaultDialog
                        maxWidth="xs"
                        open={retryRollbackModal}
                        title={t('DR.ROLLBACK_RETRY_JOB')}
                        onClose={() => {
                            setRetryRollbackModal(false);
                        }}
                        onConfirm={retryRollbackRecoveryJob}
                        isLoading={rollbackRetryLoading}
                        actionType="confirm"
                        buttonColor="success"
                    >
                        <DialogText title={t('DR.ROLLBACK_RETRY_JOB_STORY')} />
                    </DefaultDialog>
                )}
                {/* 재해복구작업 롤백 무시 */}
                {ignoreRollbackModal && (
                    <DefaultDialog
                        maxWidth="xs"
                        open={ignoreRollbackModal}
                        title={t('DR.ROLLBACK_IGNORE_JOB')}
                        onClose={() => {
                            setIgnoreRollbackModal(false);
                        }}
                        onConfirm={ignoreRollbackRecoveryJob}
                        isLoading={ignoreRollbackLoading}
                        actionType="confirm"
                        buttonColor="error"
                    >
                        <DialogText
                            title={t('DR.ROLLBACK_IGNORE_JOB_STORY')}
                            body={t('DR.ROLLBACK_IGNORE_JOB_STORY_BODY')}
                        />
                    </DefaultDialog>
                )}
                {/* 재해복구작업 롤백(모의훈련) */}
                {simulationRollbackModal && (
                    <DefaultDialog
                        maxWidth="xs"
                        open={simulationRollbackModal}
                        title={t(`DR.${JOB_TYPE}_ROLLBACK_JOB`)}
                        onClose={() => {
                            setSimulationRollbackModal(false);
                        }}
                        onConfirm={rollbackSimulationJob}
                        isLoading={simulationRollbackLoading}
                        actionType="confirm"
                        buttonColor="success"
                    >
                        <DialogText
                            title={t(`DR.${JOB_TYPE}_ROLLBACK_JOB_STORY`)}
                            body={t(`DR.${JOB_TYPE}_ROLLBACK_JOB_STORY_BODY`)}
                        />
                    </DefaultDialog>
                )}
                {/* 일시중지 시간연장 */}
                {extendModal && (
                    <DefaultDialog
                        maxWidth="xs"
                        open={extendModal}
                        title={t(`DR.${JOB_TYPE}_EXTEND_PAUSE_TIME`)}
                        onClose={() => {
                            setExtendTime(60);
                            setInvalidExtendTime(false);
                            setExtendModal(false);
                        }}
                        onConfirm={!invalidExtendTime ? extendPauseTime : () => {}}
                        isLoading={extendPauseLoading}
                        actionType="confirm"
                        buttonColor="priary"
                    >
                        <DialogText title={t(`DR.${JOB_TYPE}_EXTEND_PAUSE_TIME_STORY`)} />

                        <ExtendModalContent jobStatus={jobMonitor?.status} value={extendTime} type={'resume_at'} />
                    </DefaultDialog>
                )}
                {/* 롤백 대기시간 연장 */}
                {extendRollbackModal && (
                    <DefaultDialog
                        maxWidth="xs"
                        open={extendRollbackModal}
                        title={t(`DR.${JOB_TYPE}_EXTEND_ROLLBACK_PAUSE_TIME`)}
                        onClose={() => {
                            setRollbackTime(60);
                            setInvalidExtendTime(false);
                            setExtendRollbackModal(false);
                        }}
                        onConfirm={!invalidExtendTime ? extendRollbackTime : () => {}}
                        isLoading={extendRollbackLoading}
                        actionType="confirm"
                        buttonColor="primary"
                    >
                        <DialogText title={t(`DR.${JOB_TYPE}_EXTEND_ROLLBACK_PAUSE_TIME_STORY`)} />
                        <ExtendModalContent jobStatus={jobMonitor?.status} value={rollbackTime} type={'rollback_at'} />
                    </DefaultDialog>
                )}
                {/* TODO: 재해복구작업 재시도 */}
            </CardContent>
        </>
    );
};
export default RecoveryJobMonitoring;

interface IForm {
    extendTime: number;
}

interface ExtendModalContentProps {
    jobStatus: any;
    onChange?: any;
    value: any;
    errorFlag?: boolean;
    errorMsg?: string;
    type: 'rollback_at' | 'resume_at';
    onReset?: any;
}
const ExtendModalContent = ({ jobStatus, value, type }: ExtendModalContentProps) => {
    const { t } = useTranslation();

    const { control, resetField } = useForm<IForm>({
        defaultValues: {
            extendTime: value,
        },
        mode: 'all',
    });

    return (
        <Wrapper>
            <Typography sx={{ textAlign: 'center' }}>
                {t('DR.ESTIMATED_RESTART_TIME')} : {dayjs.unix(jobStatus[type]).format('YYYY.MM.DD HH:mm:ss')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <FormTextField<IForm>
                    control={control}
                    name="extendTime"
                    resetField={resetField}
                    hint={'30 ~ 180'}
                    type="number"
                    customOnChangeRegExp={/^[\d]{0,3}$/}
                    rules={{
                        required: {
                            value: true,
                            message: '입력값은 필수입니다.',
                        },
                        min: {
                            value: 30,
                            message: '최솟값은 30입니다.',
                        },
                        max: {
                            value: 180,
                            message: '최댓값은 30입니다.',
                        },
                    }}
                />
                <Typography sx={{ marginLeft: '0.3rem', marginBottom: '0.2rem', marginTop: '0.5rem' }}>
                    분 추가합니다.
                </Typography>
            </Box>
        </Wrapper>
    );
};

const Wrapper = styled(Box)`
    display: flex;
    flex-direction: column;
`;

const JobActionWrapper = styled(Box)`
    flex-wrap: wrap;
    row-gap: 10px;
    display: flex;
`;

const Grid = styled(Box)`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10%, auto));
    ${({ theme }) => theme.breakpoints.down.xl} {
        grid-template-columns: repeat(auto-fill, minmax(25%, auto));
    }
    ${({ theme }) => theme.breakpoints.down.lg} {
        grid-template-columns: repeat(auto-fill, minmax(25%, auto));
    }
    ${({ theme }) => theme.breakpoints.down.md} {
        grid-template-columns: repeat(auto-fill, minmax(30%, auto));
    }
    ${({ theme }) => theme.breakpoints.down.sm} {
        grid-template-columns: repeat(auto-fill, minmax(35%, auto));
    }
`;

const GridItem = styled(Box)`
    border-radius: 3px;
    border: 1px solid transparent;
`;

const ItemWrapper = styled(Box)`
    margin-top: 1rem;
`;

const TaskTitle = styled(Typography)`
    width: 100%;
    text-align: left;
    font-size: 1.1rem;
`;

const TaskProgress = styled(Typography)`
    width: 100%;
    text-align: right;
`;
