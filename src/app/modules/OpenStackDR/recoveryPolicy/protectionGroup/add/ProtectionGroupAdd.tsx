import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { CardActions, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';

import { _getClusterList } from '../../../../../../api/center/cluster';
import { _addProtectionGroup } from '../../../../../../api/dr/protectionGroup';
import ActionButton from '../../../../../component/common/Button/ActionButton';
import { clusterKeys, protectionGroupKeys } from '../../../../../../libs/utils/queryKeys';
import ProtectionGroupInstances from './ProtectionGroupInstances';
import ProtectionGroupInfo from './ProtectionGroupInfo';
import DefaultSpinner from '../../../../../component/common/Skeleton/DefaultSpinner';
import DefaultDialog from '../../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../../component/common/Dialog/DialogText';
import { PATHNAME } from '../../../../../../constant/pathname';
import { RPOs, SnapShotIntervals } from '../../../../../../@types';
import { OpenStackCluster } from '../../../../../../@types/Cluster/index';
import { findLastWord } from '../../../../../../libs/utils/commonFunction';

interface IForm {
    protection_cluster: {
        id: number;
    };
    name: string;
    remarks?: string;
    recovery_point_objective_type: RPOs;
    recovery_point_objective: number;
    recovery_time_objective: number;
    snapshot_interval_type: SnapShotIntervals;
    snapshot_interval: number;
    instances: any[];
}

/**
 * 오픈스택 보호그룹 추가 컴포넌트
 */
export function ProtectionGroupAdd() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    // 선택한 클러스터의 정보(type, owner group 등 정보가 들어있음)
    const [selectedCluster, setSelectedCluster] = useState<OpenStackCluster | null>(null);

    // 생성 모달, 경고 모달을 open, close 하기위한 상태값
    const [addModal, setAddModal] = useState(false);

    const queryClient = useQueryClient();

    // 클러스터에 대한 정보를 불러오는 함수
    const { data: clusterList } = useQuery(clusterKeys.lists(), () => _getClusterList(), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                return data?.clusters;
            }
        },
    });

    // 보호그룹 등록하는 함수
    const { isLoading: addLoading, mutate: addProtectionGroup } = useMutation(
        () =>
            _addProtectionGroup({
                ...getValues(),
                instances: getValues('instances').map(instance => {
                    return { id: Number(instance.id), uuid: instance.uuid };
                }),
            }),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    navigate(PATHNAME.OPENSTACK_GROUP);
                    toast.success(t('DR.RP.PROTECTION_ADDED'));
                    queryClient.invalidateQueries(protectionGroupKeys.all);
                }
                setAddModal(false);
            },
        },
    );

    const { control, resetField, handleSubmit, getValues, setValue, watch } = useForm<IForm>({
        defaultValues: {
            protection_cluster: {
                id: 0,
            },
            name: '',
            remarks: '',
            recovery_point_objective_type: 'recovery.point.objective.type.minute',
            recovery_point_objective: 30,
            recovery_time_objective: 30,
            snapshot_interval_type: 'snapshot.interval.type.minutely',
            snapshot_interval: 15,
            instances: [],
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<IForm> = data => {
        // if(data.protection_cluster)
        const selectedCluster = clusterList?.filter(cluster => cluster.id === data.protection_cluster.id)[0];
        if (findLastWord(selectedCluster?.state_code) === 'inactive') {
            toast.error('클러스터의 상태가 inactive 상태입니다.');
            return;
        }
        const tenantSet = new Set(data.instances.map(instance => instance.tenant.name));
        const tenantArray = [...tenantSet];

        // 다른 테넌트의 인스턴스로 보호그룹을 구성함
        if (tenantArray.length > 1) {
            toast.warn('다른 프로젝트의 인스턴스들로 보호그룹을 생성할 수 없습니다.');
            return;
        }

        setValue('recovery_point_objective', Number(data.recovery_point_objective));
        setValue('recovery_time_objective', Number(data.recovery_time_objective));
        setValue('snapshot_interval', Number(data.snapshot_interval));

        if (
            (findLastWord(data.recovery_point_objective_type) === 'minute' &&
                findLastWord(data.snapshot_interval_type) === 'minutely') ||
            (findLastWord(data.recovery_point_objective_type) === 'hour' &&
                findLastWord(data.snapshot_interval_type) === 'hourly') ||
            (findLastWord(data.recovery_point_objective_type) === 'day' &&
                findLastWord(data.snapshot_interval_type) === 'daily')
        ) {
            if (data.snapshot_interval > data.recovery_point_objective) {
                toast.warn(t('DR.SNAPSHOT_INTERVAL.LESS_RPO'));
                return;
            } else {
                setAddModal(true);
            }
        } else {
            setAddModal(true);
            //
        }
    };

    /**
     * 클러스터 리스트가 존재하면 선택된 클러스터를 지정한다.
     */
    useEffect(() => {
        if (clusterList) {
            if (location.state?.clusterID) {
                const selected = clusterList.filter(cluster => cluster.id === location.state.clusterID)[0];
                setValue('protection_cluster.id', selected.id);
                setSelectedCluster(selected);
            } else {
                setSelectedCluster(clusterList[0]);
                setValue('protection_cluster.id', clusterList[0].id);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clusterList, location]);

    return (
        <>
            {!clusterList || !selectedCluster ? (
                <DefaultSpinner />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        <DetailTitle>{t('DR.PROTECTION_GROUP_INFO')}</DetailTitle>
                        <ProtectionGroupInfo
                            control={control}
                            resetField={resetField}
                            clusterList={clusterList}
                            getValues={getValues}
                            setValue={setValue}
                        />
                        <ProtectionGroupInstances watch={watch} setValue={setValue} getValues={getValues} />
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <ActionButton
                            buttonType="cancel"
                            onClick={() => {
                                navigate(-1);
                            }}
                            type="submit"
                        />
                        <ActionButton buttonType="add" type="submit" />
                    </CardActions>
                    {addModal && (
                        <DefaultDialog
                            maxWidth="xs"
                            open={addModal}
                            title={t('DR.RP.ADD_PROTECTION')}
                            onClose={() => {
                                setAddModal(false);
                            }}
                            onConfirm={addProtectionGroup}
                            isLoading={addLoading}
                            actionType="confirm"
                            buttonColor="primary"
                        >
                            <DialogText title={getValues('name')} body={t('DR.RP.WANNA_ADD_PROTECTION')} />
                        </DefaultDialog>
                    )}
                </form>
            )}
        </>
    );
}

const DetailTitle = styled(Typography).attrs({ variant: 'h6' })`
    font-weight: 700;
    margin-bottom: 1rem;
`;
