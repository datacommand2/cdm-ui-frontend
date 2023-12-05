import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import { _getClusterRecoveryPlan } from '../../../../../api/dr/recoveryPlan';
import AddButton from '../../../../component/common/Button/AddButton';
import { recoveryPlanKeys } from '../../../../../libs/utils/queryKeys';
import ListTableForm from '../../../../component/common/ListTableForm/ListTableForm';
import NewTypeFormatter from '../../../../component/common/Table/formatter/NewTypeFormatter';
import IsActiveFormatter from '../../../../component/common/Table/formatter/IsActiveFormatter';
import NewDateFormatter from '../../../../component/common/Table/formatter/NewDateFormatter';
import TableChip from '../../../../component/common/Chip/TableChip';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../component/common/ListToolBar/ListToolBar';
import ActionsFormatter from '../../../../component/common/Table/formatter/ActionsFormatter';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../component/common/Dialog/DialogText';
import ActionButton from '../../../../component/common/Button/ActionButton';
import DialogAlert from '../../../../component/common/Alert/DialogAlert';
import { findLastWord } from '../../../../../libs/utils/commonFunction';
import TableHeader from '../../../../component/common/Table/TableHeader';
import ListTable from '../../../../component/common/Table/ListTable';
import { PATHNAME } from '../../../../../constant/pathname';
import { LoginUser } from '../../../../../recoil/atom/LoginUser';
import { useTreeState } from '@/recoil/atom/Global';

const columnHelper = createColumnHelper<any>();

/**
 * 보호그룹 id를 받아와서 해당하는 보호그룹에 대한 복구계획 목록을 출력하는 컴포넌트
 */
const RecoveryPlanList = () => {
    const [treeState] = useTreeState();
    const protectionGroupID = treeState.protectionGroupID;

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [abnormalStateReasons, setAbnormalStateReasons] = useState<any>({});
    // table row 클릭시 플랜 정보 저장
    const [selectedPlan, setSelectedPlan] = useState<any>({});
    // 검색 inputData
    const [searchData, setSearchData] = useState('');
    // 재해복구계획 목록 쿼리
    const [queryData, setQueryData] = useState({
        inputData: '',
        limit: 10,
        offset: 0,
    });

    const loginUser = useRecoilValue(LoginUser);
    const role = loginUser?.roles ? loginUser.roles[0]?.role : 'user';

    // 보호그룹 id를 받아와서 복구계획 목록을 조회하는 함수
    // 클릭한 그룹 id로 복구계획 리스트를 불러오는 함수
    const {
        data: planData,
        isFetching: planFetching,
        isLoading: planLoading,
        refetch: planListRefresh,
    } = useQuery(
        recoveryPlanKeys.list({
            protectionGroupID,
            limit: queryData.limit,
            offset: queryData.offset,
            inputData: queryData.inputData,
        }),
        () => _getClusterRecoveryPlan(protectionGroupID, queryData.limit, queryData.offset, queryData.inputData),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return {
                        plans: data.plans,
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        plans: [],
                        pagination: {},
                        status,
                    };
                }
            },
            enabled: protectionGroupID !== 0,
            keepPreviousData: true,
        },
    );

    /**
     * 복구작업 추가 눌렀을 때
     */
    const addRecoveryJob = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const id = e.currentTarget.id;
            navigate(PATHNAME.OPENSTACK_JOB_ADD, {
                state: { GroupID: protectionGroupID, RowID: id },
            });
        },
        [navigate, protectionGroupID],
    );

    // 수정 버튼을 눌렀을 때
    const editRecoveryPlan = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const id = e.currentTarget.id;
            const plan = planData?.plans.filter((group: any) => group.id === id);

            navigate(`${PATHNAME.OPENSTACK_PLAN_EDIT}/${id}`, {
                state: {
                    planID: id,
                    updatable: plan[0]?.updatable === true ? true : false,
                    groupID: protectionGroupID,
                },
            });
        },
        [navigate, planData, protectionGroupID],
    );

    // 상세보기
    const viewDetail = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const id = e.currentTarget.id;

            navigate(`${PATHNAME.OPENSTACK_PLAN_DETAIL}/${id}`, { state: { GroupID: protectionGroupID, PlanID: id } });
        },
        [navigate, protectionGroupID],
    );

    // 검색 inputChange
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchData(e.target.value);
    };

    // 검색
    const inputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setQueryData(prev => ({
            ...prev,
            offest: 0,
            inputData: searchData,
        }));
    };

    // 페이지 당 보여주는 데이터 수를 변경했을 때
    const changePageSize = (value: number) => {
        setQueryData(prev => ({
            ...prev,
            limit: value,
        }));
    };

    // 페이지가 바뀔 때
    const changePage = (value: number) => {
        setQueryData(prev => ({
            ...prev,
            offset: value,
        }));
    };

    const setReasons = useCallback(
        (id: number) => {
            const selectedPlan = planData?.plans.filter((plan: any) => id === plan.id)[0];
            setSelectedPlan(selectedPlan);
            setAbnormalStateReasons(selectedPlan.abnormal_state_reasons);
        },
        [planData],
    );

    const columns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('protection_clustertype_code', {
                header: () => <TableHeader text={'타입'} />,
                cell: props => <NewTypeFormatter data={props.row.original?.protection_cluster.type_code} />,
            }),
            columnHelper.accessor('protection_cluster.name', {
                header: () => <TableHeader text={'원본 클러스터'} />,
                cell: props => <IsActiveFormatter cluster={props.row.original?.protection_cluster} />,
            }),
            columnHelper.accessor('recovery_cluster.name', {
                header: () => <TableHeader text={'복구 클러스터'} />,
                cell: props => <IsActiveFormatter cluster={props.row.original?.recovery_cluster} />,
            }),
            columnHelper.accessor('created_at', {
                header: () => <TableHeader text={'등록일'} />,
                cell: props => <NewDateFormatter data={props} type={'created_at'} />,
            }),
            columnHelper.accessor('updated_at', {
                header: () => <TableHeader text={'수정일'} />,
                cell: props => <NewDateFormatter data={props} type={'updated_at'} />,
            }),
            columnHelper.accessor('state_code', {
                header: () => <TableHeader text={'상태'} />,
                cell: props => (
                    <TableChip
                        color={props?.row.original?.state_code}
                        label={props?.row.original?.state_code}
                        action={() => setReasons(props.row.original.id)}
                    />
                ),
            }),
            columnHelper.accessor('mirror_state_code', {
                header: () => <TableHeader text={'미러링 상태'} />,
                cell: props => (
                    <TableChip
                        color={findLastWord(props?.row.original?.mirror_state_code)}
                        label={findLastWord(props?.row.original?.mirror_state_code)}
                        action={() => setReasons(props.row.original.id)}
                    />
                ),
            }),
            columnHelper.display({
                id: 'actions',
                header: () => <TableHeader text={'동작'} />,
                cell: props => (
                    <ActionsFormatter
                        data={props?.row?.original}
                        addEvent={addRecoveryJob}
                        editEvent={editRecoveryPlan}
                        isLoading={planFetching}
                        role={role}
                        type={'openstack-recovery-plan'}
                        title={'복구계획'}
                        treeId={protectionGroupID}
                        setQueryData={setQueryData}
                        list={planData?.plans ?? []}
                        detailEvent={viewDetail}
                        monitoringEvent={() => {}}
                    />
                ),
            }),
        ],
        [
            setReasons,
            addRecoveryJob,
            editRecoveryPlan,
            planFetching,
            role,
            protectionGroupID,
            planData?.plans,
            viewDetail,
        ],
    );

    return (
        <>
            <ListToolBarWrapper>
                <ListToolBar>
                    <ListButtonWrapper>
                        <AddButton
                            loading={!protectionGroupID}
                            url={{
                                pathname: PATHNAME.OPENSTACK_PLAN_ADD,
                                state: {
                                    groupID: protectionGroupID,
                                },
                            }}
                        />
                    </ListButtonWrapper>
                    <ListSearchBarWrapper>
                        <ListTableForm inputSubmit={inputSubmit}>
                            <ListTableForm.Search
                                placeholder={t('DR.RECOVERY_PLAN_NAME')}
                                onChange={handleChange}
                                value={searchData}
                                disabled={(protectionGroupID && planFetching) === null}
                            ></ListTableForm.Search>
                            <ListTableForm.RefreshButton
                                refreshFn={planListRefresh}
                                isLoading={protectionGroupID === null || planFetching}
                            />
                        </ListTableForm>
                    </ListSearchBarWrapper>
                </ListToolBar>
            </ListToolBarWrapper>

            <ListTable
                data={planData?.plans ?? []}
                columns={columns}
                pagination={planData?.pagination ?? {}}
                limit={queryData.limit}
                offset={queryData.offset}
                onChangeLimit={changePageSize}
                onChangePage={changePage}
                isFetching={planFetching}
                isLoading={planLoading}
                statusCode={planData?.status}
                treeID={protectionGroupID}
                type={'openstack-recovery-plan'}
            />
            {/* TODO: abnormal 어떻게 넘어오는지 테스트 후 공통 컴포넌트로 추출 가능 */}
            {selectedPlan && abnormalStateReasons !== undefined && Object.keys(abnormalStateReasons).length > 0 && (
                <DefaultDialog
                    maxWidth="xs"
                    open={
                        selectedPlan &&
                        abnormalStateReasons !== undefined &&
                        Object.keys(abnormalStateReasons).length > 0
                    }
                    title={t('DR.RP.STATE_INFO')}
                    customActions={
                        <ActionButton
                            buttonType="close"
                            onClick={() => {
                                setAbnormalStateReasons({});
                            }}
                        />
                    }
                    isCustomActions={true}
                >
                    <DialogText title={`${selectedPlan && selectedPlan.name}`} />
                    <ul>
                        {Object.keys(abnormalStateReasons).map(v => {
                            return abnormalStateReasons[v].map((message: any, i: number) => {
                                return (
                                    <li key={`${v}-${message.code}-${i}`}>
                                        <DialogAlert type={v} message={message.code} />
                                    </li>
                                );
                            });
                        })}
                    </ul>
                </DefaultDialog>
            )}
        </>
    );
};

export default RecoveryPlanList;
