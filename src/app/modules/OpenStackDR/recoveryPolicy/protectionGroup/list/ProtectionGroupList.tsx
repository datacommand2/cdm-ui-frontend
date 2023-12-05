import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { Typography } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';

import { _getProtectionGroup } from '../../../../../../api/dr/protectionGroup';
import AddButton from '../../../../../component/common/Button/AddButton';
import { protectionGroupKeys } from '../../../../../../libs/utils/queryKeys';
import ListTableForm from '../../../../../component/common/ListTableForm/ListTableForm';
import IsActiveFormatter from '../../../../../component/common/Table/formatter/IsActiveFormatter';
import NewTypeFormatter from '../../../../../component/common/Table/formatter/NewTypeFormatter';
import NewDateFormatter from '../../../../../component/common/Table/formatter/NewDateFormatter';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../../component/common/ListToolBar/ListToolBar';
import ActionsFormatter from '../../../../../component/common/Table/formatter/ActionsFormatter';
import TableHeader from '../../../../../component/common/Table/TableHeader';
import ListTable from '../../../../../component/common/Table/ListTable';
import { PATHNAME } from '../../../../../../constant/pathname';
import { LoginUser } from '../../../../../../recoil/atom/LoginUser';
import { useTreeState } from '@/recoil/atom/Global';

const columnHelper = createColumnHelper();

/**
 * 보호그룹 리스트 컴포넌트
 * 1. 보호 그룹 리스트 페이지를 화면에 나타냄
 * 2. 종류와 소유자 그룹, 클러스터 선택 및 검색하고자 하는 대상 입력 후 검색 가능.
 * 3. 필터 선택없이도 바로 검색대상 입력후 검색 가능.
 */
const ProtectionGroupList = () => {
    const [treeState] = useTreeState();
    const clusterID = treeState.clusterID;
    const { t } = useTranslation();
    const navigate = useNavigate();

    const loginUser = useRecoilValue(LoginUser);
    const role = loginUser?.roles ? loginUser.roles[0]?.role : 'user';
    const [searchFilterValue, setSearchFilterValue] = useState('');
    // 보호그룹 쿼리 정보
    // 검색 필터
    const [inputData, setInputData] = useState('');
    // 한 페이지에 표시할 항목 개수
    const [limit, setLimit] = useState(10);
    // 페이지에 표시할 인덱스
    const [offset, setOffset] = useState(0);

    // 보호그룹 리스트를 불러오는 함수
    const {
        data: protectionGroupList,
        isFetching: groupFetching,
        isLoading: groupLoading,
        refetch: protectionGroupListRefresh,
    } = useQuery(
        protectionGroupKeys.list({ limit, offset, inputData, clusterID }),
        () => _getProtectionGroup(limit, offset, inputData, clusterID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return {
                        groups: data.groups,
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        groups: [],
                        pagination: {},
                        status,
                    };
                } else throw new Error();
            },
            enabled: clusterID !== 0,
            keepPreviousData: true,
            // staleTime: StaleTime,
        },
    );

    // RP 추가 버튼을 눌렀을 때
    // history.push로 페이지 이동과 state 변수에
    // 클릭한 보호그룹 id를 같이 넘겨줌
    const passselectedGroupData = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const id = e.currentTarget.id;
            navigate(PATHNAME.OPENSTACK_PLAN_ADD, {
                state: { groupID: id },
            });
        },
        [navigate],
    );

    // 수정 버튼을 눌렀을 때
    // history.push로 페이지 이동과 state 변수에
    // 클릭한 보호그룹 id를 같이 넘겨줌
    const passselectedGroupDataToEdit = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const id = e.currentTarget.id;
            const group = protectionGroupList?.groups.filter((group: any) => group.id === id);

            navigate(`${PATHNAME.OPENSTACK_GROUP_EDIT}/${id}`, {
                state: { groupID: id, updatable: group[0]?.updatable === true ? true : false },
            });
        },
        [navigate, protectionGroupList],
    );

    // 상세 정보 클릭
    const viewDetail = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const id = e.currentTarget.id;
            navigate(`${PATHNAME.OPENSTACK_GROUP_DETAIL}/${id}`, { state: { GroupID: id } });
        },
        [navigate],
    );

    // 검색 inputChange
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilterValue(e.target.value);
    };

    // 검색
    const inputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setOffset(0);
        setInputData(searchFilterValue);
    };

    // 페이지 당 보여주는 데이터 수를 변경했을 때
    const changePageSize = (value: number) => {
        setLimit(value);
    };

    // 페이지가 바뀔 때
    const changePage = (value: number) => {
        setOffset(value);
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('protection_cluster.type_code', {
                header: () => <TableHeader text={'타입'} />,
                cell: ({ getValue }) => <NewTypeFormatter data={getValue()} />,
            }),
            columnHelper.accessor('protection_cluster', {
                header: () => <TableHeader text={'클러스터'} />,
                cell: ({ getValue }) => <IsActiveFormatter cluster={getValue()} />,
            }),
            columnHelper.accessor('created_at', {
                header: () => <TableHeader text={'등록일'} />,
                cell: props => <NewDateFormatter data={props} type={'created_at'} />,
            }),
            columnHelper.accessor('updated_at', {
                header: () => <TableHeader text={'수정일'} />,
                cell: props => <NewDateFormatter data={props} type={'updated_at'} />,
            }),
            columnHelper.display({
                id: 'actions',
                header: () => <TableHeader text={'동작'} />,
                cell: props => (
                    <ActionsFormatter
                        data={props?.row?.original}
                        addEvent={passselectedGroupData}
                        editEvent={passselectedGroupDataToEdit}
                        isLoading={groupFetching}
                        role={role}
                        type={'openstack-protection-group'}
                        title={'보호그룹'}
                        detailEvent={viewDetail}
                        monitoringEvent={() => {}}
                        treeId={0}
                    />
                ),
            }),
        ],
        [groupFetching, passselectedGroupData, passselectedGroupDataToEdit, role, viewDetail],
    );

    return (
        <>
            <ListToolBarWrapper>
                <ListToolBar>
                    <ListButtonWrapper>
                        <AddButton
                            loading={clusterID === 0}
                            url={{
                                pathname: PATHNAME.OPENSTACK_GROUP_ADD,
                            }}
                        />
                    </ListButtonWrapper>
                    <ListSearchBarWrapper>
                        <ListTableForm inputSubmit={inputSubmit}>
                            <ListTableForm.Search
                                placeholder={t('TABLE.NAME')}
                                onChange={handleChange}
                                value={searchFilterValue}
                                disabled={groupLoading}
                            />
                            <ListTableForm.RefreshButton
                                refreshFn={protectionGroupListRefresh}
                                isLoading={groupLoading}
                            />
                        </ListTableForm>
                    </ListSearchBarWrapper>
                </ListToolBar>
            </ListToolBarWrapper>
            <ListTable
                data={protectionGroupList?.groups ?? []}
                columns={columns}
                pagination={protectionGroupList?.pagination ?? {}}
                limit={limit}
                offset={offset}
                onChangeLimit={changePageSize}
                onChangePage={changePage}
                isFetching={groupFetching}
                isLoading={groupLoading}
                statusCode={protectionGroupList?.status}
                treeID={clusterID}
                type={'protection-group'}
            />
        </>
    );
};

export default ProtectionGroupList;
