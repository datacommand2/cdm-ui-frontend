import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import { _getRecoveryReport } from '../../../../../api/dr/recoveryResult';
import { recoveryResultKeys } from '../../../../../libs/utils/queryKeys';
import TableChip from '../../../../component/common/Chip/TableChip';
import ListTableForm from '../../../../component/common/ListTableForm/ListTableForm';
import JobTypeFormatter from '../../../../component/common/Table/formatter/JobTypeFormatter';
import NewDateFormatter from '../../../../component/common/Table/formatter/NewDateFormatter';
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
import TableHeader from '../../../../component/common/Table/TableHeader';
import ListTable from '../../../../component/common/Table/ListTable';
import { PATHNAME } from '../../../../../constant/pathname';
import ExecutionTypeFormatter from '../../../../component/common/Table/formatter/ExecutionTypeFormatter';
import { LoginUser } from '../../../../../recoil/atom/LoginUser';
import { OptionType } from '../../../../../@types';
import DialogAlert from '../../../../component/common/Alert/DialogAlert';
import { useTreeState } from '@/recoil/atom/Global';

interface RecoveryResult {
    id: number;
    recovery_plan_name: string;
    protection_cluster_name: string;
    recovery_cluster_name: string;
    recovery_type_code: string;
    result_code: string;
    schedule_type: string;
    started_at: number;
    finished_at: number;
}

const columnHelper = createColumnHelper<RecoveryResult>();

/**
 * 보호그룹 아이디를 받아와서 해당하는 복구결과 목록을 보여주는 컴포넌트
 */

const RecoveryResultList = () => {
    const [treeState] = useTreeState();
    const protectionGroupID = treeState?.protectionGroupID;
    const protectionGroupName = treeState?.protectionGroupName;

    const { t } = useTranslation();
    const [showAbnormalState, setShowAbnormalState] = useState(false);
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const navigate = useNavigate();
    // 복구결과 목록 쿼리
    const [queryData, setQueryData] = useState({
        limit: 10,
        offset: 0,
        type: '',
        result: '',
    });

    const loginUser = useRecoilValue(LoginUser);
    const role = loginUser?.roles ? loginUser.roles[0]?.role : 'user';

    // 클릭한 그룹 id로 복구결과 리스트를 불러오는 함수
    const {
        data: resultData,
        isFetching: resultFetching,
        isLoading: resultLoading,
        refetch: recoveryResultListRefresh,
    } = useQuery(
        recoveryResultKeys.list({
            protectionGroupID: protectionGroupID,
            name: protectionGroupName,
            limit: queryData.limit,
            offset: queryData.offset,
            type: queryData.type,
            result: queryData.result,
        }),
        () =>
            _getRecoveryReport(
                protectionGroupID,
                protectionGroupName,
                queryData.limit,
                queryData.offset,
                queryData.type,
                queryData.result,
            ),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return {
                        results: data.reports,
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        results: [],
                        pagination: {},
                        status,
                    };
                }
            },
            enabled: protectionGroupID !== 0,
            keepPreviousData: true,
        },
    );

    // row의 정보를 상세보기로 이동하게 만드는 이벤트
    const passSelectedRowData = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const resultId = e.currentTarget.id;
            navigate(`${PATHNAME.OPENSTACK_RESULT_DETAIL}/${resultId}`, {
                state: { groupId: protectionGroupID, resultId },
            });
        },
        [navigate, protectionGroupID],
    );

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

    // type을 변경할 때
    const changeType = (value: string) => {
        setQueryData(prev => ({
            ...prev,
            type: value,
        }));
    };

    // result를 바꿀 때
    const changeResult = (value: string) => {
        setQueryData(prev => ({
            ...prev,
            result: value,
        }));
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor('recovery_plan_name', {
                header: () => <TableHeader text={'복구계획'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('protection_cluster_name', {
                header: () => <TableHeader text={'원본 클러스터'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('recovery_cluster_name', {
                header: () => <TableHeader text={'복구 클러스터'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('recovery_type_code', {
                header: () => <TableHeader text={'작업 유형'} />,
                cell: ({ row }) => <JobTypeFormatter data={row.original?.recovery_type_code} />,
            }),
            columnHelper.accessor('result_code', {
                header: () => <TableHeader text={'복구결과'} />,
                cell: props => (
                    <TableChip
                        color={props?.row.original?.result_code}
                        label={props?.row.original?.result_code}
                        action={() => {
                            setShowAbnormalState(true);
                            setSelectedReport(props.row.original);
                        }}
                        type="recovery-result"
                        id={props.row.original.id}
                    />
                ),
            }),
            columnHelper.accessor('schedule_type', {
                header: () => <TableHeader text={'실행 정보'} />,
                cell: ({ row }) => <ExecutionTypeFormatter data={row.original?.schedule_type} />,
            }),
            columnHelper.accessor('started_at', {
                header: () => <TableHeader text={'복구 시작일시'} />,
                cell: props => <NewDateFormatter data={props} type={'started_at'} />,
            }),
            columnHelper.accessor('finished_at', {
                header: () => <TableHeader text={'복구 완료일시'} />,
                cell: props => <NewDateFormatter data={props} type={'finished_at'} />,
            }),
            columnHelper.display({
                id: 'actions',
                header: () => <TableHeader text={'동작'} />,
                cell: props => (
                    <ActionsFormatter
                        data={props?.row?.original}
                        detailEvent={passSelectedRowData}
                        isLoading={resultLoading}
                        role={role}
                        type={'openstack-recovery-result'}
                        title={'복구결과'}
                        treeId={protectionGroupID}
                        setQueryData={setQueryData}
                        list={resultData?.results ?? []}
                        addEvent={() => {}}
                        editEvent={() => {}}
                        monitoringEvent={() => {}}
                    />
                ),
            }),
        ],
        [passSelectedRowData, protectionGroupID, resultData, resultLoading, role],
    );

    const typeOptions = [
        { value: '', label: '복구작업', isDisabled: true },
        { value: 'all', label: '전체' },
        { value: 'dr.recovery.type.simulation', label: '모의훈련' },
        { value: 'dr.recovery.type.migration', label: '재해복구' },
    ];

    const resultOptions = [
        { value: '', label: '복구결과', isDisabled: true },
        { value: 'all', label: '전체' },
        { value: 'dr.recovery.result.success', label: '성공' },
        { value: 'dr.recovery.result.partial_success', label: '부분성공' },
        { value: 'dr.recovery.result.failed', label: '실패' },
        { value: 'dr.recovery.result.canceled', label: '취소' },
    ];

    return (
        <>
            <ListToolBarWrapper>
                <ListToolBar>
                    <ListButtonWrapper>{}</ListButtonWrapper>
                    <ListSearchBarWrapper>
                        <ListTableForm inputSubmit={() => {}}>
                            <ListTableForm.Filter
                                className="list-select"
                                disabled={!protectionGroupID}
                                name="typeSelect"
                                defaultValue={typeOptions[0]}
                                onChange={(e: OptionType) => {
                                    changeType(e.value);
                                }}
                                options={typeOptions}
                            />
                            <ListTableForm.Filter
                                className="list-select"
                                disabled={!protectionGroupID}
                                name="resultSelect"
                                defaultValue={resultOptions[0]}
                                onChange={(e: OptionType) => {
                                    changeResult(e.value);
                                }}
                                options={resultOptions}
                            />
                            <ListTableForm.RefreshButton
                                refreshFn={recoveryResultListRefresh}
                                isLoading={protectionGroupID === null || resultFetching}
                            />
                        </ListTableForm>
                    </ListSearchBarWrapper>
                </ListToolBar>
            </ListToolBarWrapper>

            <ListTable
                data={resultData?.results ?? []}
                columns={columns}
                pagination={resultData?.pagination ?? {}}
                limit={queryData.limit}
                offset={queryData.offset}
                onChangeLimit={changePageSize}
                onChangePage={changePage}
                isFetching={resultFetching}
                isLoading={resultLoading}
                statusCode={resultData?.status}
                treeID={protectionGroupID}
                type={'openstack-recovery-result'}
            />
            {showAbnormalState && selectedReport && (
                <DefaultDialog
                    actionType={'close'}
                    onConfirm={() => {}}
                    onClose={() => {}}
                    isCustomActions={true}
                    maxWidth="xs"
                    open={showAbnormalState}
                    title={t('DR.RP.STATE_INFO')}
                    customActions={
                        <ActionButton
                            buttonType="close"
                            onClick={() => {
                                setShowAbnormalState(false);
                            }}
                        />
                    }
                >
                    <DialogText title={selectedReport?.recovery_plan_name} />
                    <ul>
                        {selectedReport?.failed_reasons
                            ? selectedReport?.failed_reasons.map((reason: any, i: number) => {
                                  return (
                                      <li key={`${reason.code}-${i}`}>
                                          <DialogAlert type="emergency" message={reason.code} />
                                      </li>
                                  );
                              })
                            : null}
                    </ul>
                </DefaultDialog>
            )}
        </>
    );
};

export default RecoveryResultList;
