import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { CardActions, CardContent, Typography } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import { _getProtectionGroupDetail, _modifyProtectionGroup } from '../../../../../../api/dr/protectionGroup';
import ActionButton from '../../../../../component/common/Button/ActionButton';
import { protectionGroupKeys, unprotectedInstanceKeys } from '../../../../../../libs/utils/queryKeys';
import ProtectionGroupInfo from './ProtectionGroupInfo';
import DefaultDialog from '../../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../../component/common/Dialog/DialogText';
import { PATHNAME } from '../../../../../../constant/pathname';
import { LoginUser } from '../../../../../../recoil/atom/LoginUser';
import { RPOs, SnapShotIntervals } from '../../../../../../@types';
import ProtectionGroupInstances from './ProtectionGroupInstances';
import { findLastWord } from '../../../../../../libs/utils/commonFunction';

interface IForm {
    id: number;
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
 * useParams로 id를 받아와서 보호그룹 수정 페이지를 보여주는 컴포넌트
 */
export function ProtectionGroupEdit() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    const loginUser = useRecoilValue(LoginUser);
    const role = loginUser?.roles ? loginUser.roles[0]?.role : 'user';
    const groupID = Number(location.state.groupID);

    const [editModal, setEditModal] = useState(false);
    const [initTenant, setInitTenant] = useState('');
    const [initInstances, setInitInstances] = useState([]);

    // 첫 렌더링 시 보호그룹 정보를 받아온다
    useEffect(() => {
        if (location.state?.updatable === false) {
            toast.warn('해당 보호그룹으로 생성된 복구작업이 실행 중입니다.');
        }
    }, [location]);

    // 해당하는 id의 보호그룹 정보를 받아오는 함수
    const { data: protectionGroupDetail } = useQuery(
        protectionGroupKeys.detail(groupID),
        () => _getProtectionGroupDetail(groupID),
        {
            select: ([data, ,]) => {
                return data.group;
            },
            suspense: true,
        },
    );

    useEffect(() => {
        if (protectionGroupDetail) {
            setInitTenant(protectionGroupDetail?.instances?.[0].tenant.id ?? 'all');
            setInitInstances(protectionGroupDetail?.instances ?? []);
        }
    }, [protectionGroupDetail]);

    const { control, getValues, handleSubmit, resetField, setValue, watch } = useForm<IForm>({
        defaultValues: {
            id: protectionGroupDetail.id,
            protection_cluster: {
                id: protectionGroupDetail.protection_cluster.id,
            },
            name: protectionGroupDetail.name,
            remarks: protectionGroupDetail?.remarks ?? '',
            recovery_point_objective_type: protectionGroupDetail.recovery_point_objective_type,
            recovery_point_objective: protectionGroupDetail.recovery_point_objective,
            recovery_time_objective: protectionGroupDetail.recovery_time_objective,
            snapshot_interval_type: protectionGroupDetail.snapshot_interval_type,
            snapshot_interval: protectionGroupDetail.snapshot_interval,
            instances: protectionGroupDetail?.instances ? protectionGroupDetail.instances : [],
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<IForm> = data => {
        if (!location.state.updatable) {
            toast.error('실행 중인 복구작업이 존재하기 때문에 수정이 불가능합니다.');
            return;
        }
        if (findLastWord(protectionGroupDetail.protection_cluster.state_code) === 'inactive') {
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
                setEditModal(true);
            }
        } else {
            setEditModal(true);
        }
    };

    // 보호그룹 수정하는 함수
    const { isLoading: modifyLoading, mutate: modifyProtectionGroup } = useMutation(
        () =>
            _modifyProtectionGroup(protectionGroupDetail.id, {
                ...getValues(),
                instances: getValues('instances').map(instance => {
                    return { id: Number(instance.id), uuid: instance.uuid };
                }),
            }),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    queryClient.removeQueries(unprotectedInstanceKeys.all);
                    queryClient.removeQueries(protectionGroupKeys.all);
                    navigate(PATHNAME.OPENSTACK_GROUP);
                    toast.success(t('DR.RP.PROTECTION_MODIFIED'));
                }
                setEditModal(false);
            },
        },
    );

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset disabled={role !== 'admin' && role !== 'manager'}>
                    <CardContent>
                        <DetailTitle>{t('DR.PROTECTION_GROUP_INFO')}</DetailTitle>
                        <ProtectionGroupInfo
                            protectionGroupDetail={protectionGroupDetail}
                            control={control}
                            resetField={resetField}
                        />
                        <ProtectionGroupInstances
                            watch={watch}
                            setValue={setValue}
                            getValues={getValues}
                            protectionGroupDetail={protectionGroupDetail}
                            initTenant={initTenant}
                            initInstances={initInstances}
                        />
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <ActionButton
                            buttonType="cancel"
                            onClick={() => {
                                navigate(PATHNAME.OPENSTACK_GROUP);
                            }}
                        />
                        <ActionButton buttonType="edit" type="submit" />
                    </CardActions>
                    {editModal && (
                        <DefaultDialog
                            maxWidth="xs"
                            open={editModal}
                            title={t('DR.RP.EDIT_PROTECTION')}
                            onClose={() => {
                                setEditModal(false);
                            }}
                            onConfirm={modifyProtectionGroup}
                            isLoading={modifyLoading}
                            actionType="confirm"
                            buttonColor="primary"
                        >
                            <DialogText title={getValues('name')} body={t('DR.RP.WANNA_EDIT_PROTECTION')} />
                        </DefaultDialog>
                    )}
                </fieldset>
            </form>
        </>
    );
}

const DetailTitle = styled(Typography).attrs({ variant: 'h6' })`
    font-weight: 700;
    margin-bottom: 1rem;
`;
