import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import { _getRecoveryJob } from '../../../../../api/dr/recoveryJob';
import AddButton from '../../../../component/common/Button/AddButton';
import { recoveryJobKeys } from '../../../../../libs/utils/queryKeys';
import ListTableForm from '../../../../component/common/ListTableForm/ListTableForm';
import IsActiveFormatter from '../../../../component/common/Table/formatter/IsActiveFormatter';
import NewDateFormatter from '../../../../component/common/Table/formatter/NewDateFormatter';
import TableChip from '../../../../component/common/Chip/TableChip';
import JobTypeFormatter from '../../../../component/common/Table/formatter/JobTypeFormatter';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../component/common/ListToolBar/ListToolBar';
import ActionsFormatter from '../../../../component/common/Table/formatter/ActionsFormatter';
import ExecutionTypeFormatter from '../../../../component/common/Table/formatter/ExecutionTypeFormatter';
import TableHeader from '../../../../component/common/Table/TableHeader';
import ListTable from '../../../../component/common/Table/ListTable';
import { PATHNAME } from '../../../../../constant/pathname';
import { LoginUser } from '../../../../../recoil/atom/LoginUser';
import { OptionType } from '@/@types';
import { useTreeState } from '@/recoil/atom/Global';

const columnHelper = createColumnHelper<any>();

/**
 * 보호그룹 id를 받아와서 해당하는 보호그룹에 대한 복구작업 목록을 출력하는 컴포넌트
 */
const RecoveryJobList = () => {
    const [treeState] = useTreeState();
    const protectionGroupID = treeState.protectionGroupID;
    const { t } = useTranslation();
    const navigate = useNavigate();

    // 검색 inputData
    const [searchData, setSearchData] = useState('');
    // 재해복구작업 목록 쿼리
    const [queryData, setQueryData] = useState({
        inputData: '',
        limit: 10,
        offset: 0,
        type: '',
    });

    const loginUser = useRecoilValue(LoginUser);
    const role = loginUser?.roles ? loginUser.roles[0]?.role : 'user';

    // 보호그룹 id 를 받아서 복구작업 목록을 조회하는 함수.
    const {
        data: jobData,
        isFetching: jobFetching,
        isLoading: jobLoading,
        refetch: recoveryJobListRefresh,
    } = useQuery(
        recoveryJobKeys.list({
            protectionGroupID,
            limit: queryData.limit,
            offset: queryData.offset,
            inputData: queryData.inputData,
            type: queryData.type,
        }),
        () =>
            _getRecoveryJob(protectionGroupID, queryData.limit, queryData.offset, queryData.inputData, queryData.type),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return {
                        jobs: data.jobs,
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        jobs: [],
                        pagination: {},
                        status,
                    };
                }
            },
            enabled: protectionGroupID !== 0,
            keepPreviousData: true,
        },
    );

    // 수정 눌렀을 때 id 값도 전달
    const editRecoveryJob = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const id = e.currentTarget.id;
            navigate(`${PATHNAME.OPENSTACK_JOB_EDIT}/${id}`, {
                state: { GroupID: protectionGroupID, JobID: id },
            });
        },
        [navigate, protectionGroupID],
    );

    // 모니터링 눌렀을 때 id 값 전달
    const viewMonitoring = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const id = e.currentTarget.id;
            const selectedJob = jobData?.jobs.filter((job: any) => job.id === id);
            navigate(`${PATHNAME.OPENSTACK_JOB_MONITORING}/${id}`, {
                state: {
                    GroupID: protectionGroupID,
                    JobID: id,
                    typeCode: selectedJob[0].type_code,
                },
            });
        },
        [jobData, navigate, protectionGroupID],
    );

    // 상세 페이지로 이동
    const viewDetail = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const id = e.currentTarget.id;
            navigate(`${PATHNAME.OPENSTACK_JOB_DETAIL}/${id}`, { state: { GroupID: protectionGroupID, JobID: id } });
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

    // type을 변경할 때
    const changeType = (value: string) => {
        setQueryData(prev => ({
            ...prev,
            type: value,
        }));
    };

    // 페이지가 바뀔 때
    const changePage = (value: number) => {
        setQueryData(prev => ({
            ...prev,
            offset: value,
        }));
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor('plan.name', {
                header: () => <TableHeader text={'복구계획'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('plan.protection_cluster.name', {
                header: () => <TableHeader text={'원본 클러스터'} />,
                cell: props => <IsActiveFormatter cluster={props.row.original?.plan.protection_cluster} />,
            }),
            columnHelper.accessor('plan.recovery_cluster.name', {
                header: () => <TableHeader text={'복구 클러스터'} />,
                cell: props => <IsActiveFormatter cluster={props.row.original?.plan.recovery_cluster} />,
            }),
            columnHelper.accessor('type_code', {
                header: () => <TableHeader text={'작업 유형'} />,
                cell: ({ row }) => <JobTypeFormatter data={row.original.type_code} />,
            }),
            columnHelper.accessor('schedule', {
                header: () => <TableHeader text={'실행 정보'} />,
                cell: ({ row }) => <ExecutionTypeFormatter data={row.original?.schedule?.type} />,
            }),
            columnHelper.accessor('state_code', {
                header: () => <TableHeader text={'상태'} />,
                cell: props => (
                    <TableChip color={props?.row.original?.state_code} label={props?.row.original?.state_code} />
                ),
            }),
            columnHelper.accessor('next_runtime', {
                header: () => <TableHeader text={'실행 예정시간'} />,
                cell: props => <NewDateFormatter data={props} type={'next_runtime'} />,
            }),
            columnHelper.display({
                id: 'actions',
                header: () => <TableHeader text={'동작'} />,
                cell: props => (
                    <ActionsFormatter
                        addEvent={() => {}}
                        data={props?.row?.original}
                        editEvent={editRecoveryJob}
                        monitoringEvent={viewMonitoring}
                        role={role}
                        type={'openstack-recovery-job'}
                        title={'복구작업'}
                        treeId={protectionGroupID}
                        setQueryData={setQueryData}
                        list={jobData?.jobs ?? []}
                        detailEvent={viewDetail}
                    />
                ),
            }),
        ],
        [editRecoveryJob, viewMonitoring, role, protectionGroupID, jobData?.jobs, viewDetail],
    );

    const jobTypeOptions = [
        { value: '', label: '복구유형', isDisabled: true },
        { value: 'all', label: '전체' },
        { value: 'dr.recovery.type.simulation', label: '모의훈련' },
        { value: 'dr.recovery.type.migration', label: '재해복구' },
    ];

    return (
        <>
            <ListToolBarWrapper>
                <ListToolBar>
                    <ListButtonWrapper>
                        <AddButton
                            loading={!protectionGroupID}
                            url={{
                                pathname: PATHNAME.OPENSTACK_JOB_ADD,
                                state: {
                                    GroupID: protectionGroupID,
                                },
                            }}
                        />
                    </ListButtonWrapper>
                    <ListSearchBarWrapper>
                        <ListTableForm inputSubmit={inputSubmit}>
                            <ListTableForm.Filter
                                className="list-select"
                                disabled={(protectionGroupID && jobFetching) === null}
                                name="typeSelect"
                                defaultValue={jobTypeOptions[0]}
                                onChange={(e: OptionType) => {
                                    changeType(e.value);
                                }}
                                options={jobTypeOptions}
                            />
                            <ListTableForm.Search
                                placeholder={t('DR.RECOVERY_PLAN_NAME')}
                                onChange={handleChange}
                                value={searchData}
                                disabled={(protectionGroupID && jobFetching) === null}
                            ></ListTableForm.Search>
                            <ListTableForm.RefreshButton
                                refreshFn={recoveryJobListRefresh}
                                isLoading={protectionGroupID === null || jobFetching}
                            />
                        </ListTableForm>
                    </ListSearchBarWrapper>
                </ListToolBar>
            </ListToolBarWrapper>

            <ListTable
                data={jobData?.jobs ?? []}
                columns={columns}
                pagination={jobData?.pagination ?? {}}
                limit={queryData.limit}
                offset={queryData.offset}
                onChangeLimit={changePageSize}
                onChangePage={changePage}
                isFetching={jobFetching}
                isLoading={jobLoading}
                statusCode={jobData?.status}
                treeID={protectionGroupID}
                type={'openstack-recovery-job'}
            />
        </>
    );
};
export default RecoveryJobList;
