import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Button, CardContent, Typography } from '@mui/material';
import { useCallback } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { userGroupKeys } from '../../../../../../../libs/utils/queryKeys';
import { _getGroupUserList, _modifyUserListInGroup } from '../../../../../../../api/cloud/identity';
import IndeterminateCheckBox from '../../../../../../component/common/IndeterminateCheckBox';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../../../component/common/ListToolBar/ListToolBar';
import ListTableForm from '../../../../../../component/common/ListTableForm/ListTableForm';
import { AddUserInGroup } from './AddUserInGroup';
import DefaultDialog from '../../../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../../../component/common/Dialog/DialogText';
import TableHeader from '../../../../../../component/common/Table/TableHeader';
import ListTable from '../../../../../../component/common/Table/ListTable';

const columnHelper = createColumnHelper();
/**
 * 그룹 내 사용자 목록을 보여주는 컴포넌트
 */
const UserInGroup = ({ selectedGroupId }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [allChecked, setAllChecked] = useState(false);
    const [checkedUsers, setCheckedUsers] = useState([]);
    const [addUserInGroupModal, setAddUserInGroupModal] = useState(false);
    const [exceptUserModal, setExceptUserModal] = useState(false);
    // 유저리스트 쿼리 정보
    const [searchFilterValue, setSearchFilterValue] = useState('');
    // 검색 필터
    // 검색 필터
    const [inputData, setInputData] = useState('');
    // 한 페이지에 표시할 항목 개수
    const [limit, setLimit] = useState(10);
    // 페이지에 표시할 인덱스
    const [offset, setOffset] = useState(0);

    // 사용자 추가 버튼을 눌렀을 때
    const onClickAddUserInGroup = async () => {
        setAddUserInGroupModal(true);
    };

    // List 그룹 내 사용자 목록을 받아오는 함수
    const {
        data: groupUserList,
        isFetching: groupUserFetching,
        isLoading: groupUserLoading,
        refetch: groupUserReFresh,
    } = useQuery(
        userGroupKeys.userListInGroup({ limit, offset, inputData, selectedGroupId }),
        () => _getGroupUserList(limit, offset, inputData, selectedGroupId),
        {
            select: ([data, error, status]) => {
                if (status === 200 || status === 201) {
                    return {
                        users: data.users,
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        users: [],
                        pagination: {},
                        status,
                    };
                } else {
                    throw new Error();
                }
            },
            keepPreviousData: true,
        },
    );
    // List 그룹 내 전체 사용자 목록을 받아오는 함수
    const { data: groupAllUserList } = useQuery(
        userGroupKeys.userListsInGroup(),
        () => _getGroupUserList(null, null, null, selectedGroupId),
        {
            select: ([data, error, status]) => {
                if (status === 200 || status === 201) {
                    return {
                        users: data.users,
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        users: [],
                        pagination: {},
                        status,
                    };
                } else {
                    throw new Error();
                }
            },
            keepPreviousData: true,
        },
    );

    // 사용자 그룹에서 선택한 사용자를 제외하는 함수
    const { isLoading: exceptLoading, mutate: exceptUserInGroup } = useMutation(
        payload => _modifyUserListInGroup(selectedGroupId, payload),
        {
            onSuccess: ([data, error, status]) => {
                if (status === 200 || status === 201) {
                    toast.success(t('CLOUD.USER.GROUP.SUCCESS_EXCLUDE'));
                    setExceptUserModal(false);
                    changePage(0);
                    setAllChecked(false);
                    setCheckedUsers([]);
                    queryClient.invalidateQueries(userGroupKeys.userListsInGroup());
                }
            },
        },
    );

    // 페이지 당 보여주는 데이터 수를 변경했을 때
    const changePageSize = value => {
        setLimit(value);
    };

    // 페이지가 바뀔 때
    const changePage = value => {
        setOffset(value);
    };

    // 검색 input change
    const handleChange = e => {
        setSearchFilterValue(e.target.value);
    };

    // 검색
    const inputSubmit = e => {
        e.preventDefault();
        setOffset(0);
        setInputData(searchFilterValue);
    };

    // 그룹 내 사용자 목록 체크
    const checkUserInGroup = useCallback(
        userID => {
            // 체크되어 있지 않은 경우
            if (!checkedUsers.includes(userID)) {
                setCheckedUsers([...checkedUsers, userID]);
            }
            // 체크되어 있는 경우
            else {
                const filteredUsers = checkedUsers.filter(id => id !== userID);
                setCheckedUsers(filteredUsers);
            }
        },
        [checkedUsers],
    );

    const columns = useMemo(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <IndeterminateCheckBox
                        {...{
                            checked: allChecked,
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler(),
                        }}
                        onClick={() => {
                            if (allChecked) {
                                // table.getIsAllRowsSelected === true 면
                                // 전체 선택 해제
                                setAllChecked(false);
                                setCheckedUsers([]);
                            } else {
                                // table.getIsAllRowsSelected === false 면
                                // 전체 선택
                                const rows = table.getRowModel().rows.map(ins => Number(ins.original.id));
                                setCheckedUsers(rows);
                                setAllChecked(true);
                            }
                        }}
                    />
                ),
                cell: ({ row }) => (
                    <IndeterminateCheckBox
                        {...{
                            id: row.original.id,
                            checked: checkedUsers.includes(Number(row.original.id)),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                        onClick={() => {
                            checkUserInGroup(Number(row.original.id));
                        }}
                    />
                ),
            },
            columnHelper.accessor('account', {
                header: <TableHeader text={'사용자 ID'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('name', {
                header: <TableHeader text={'사용자 이름'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('department', {
                header: <TableHeader text={'사용자 부서'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('position', {
                header: <TableHeader text={'사용자 직책'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
        ],
        [allChecked, checkUserInGroup, checkedUsers],
    );

    return (
        <>
            <CardContent>
                <ListToolBarWrapper>
                    <ListToolBar>
                        {/* 그룹에 사용자 추가 */}
                        <ListButtonWrapper>
                            <StyledAddButton color="primary" onClick={onClickAddUserInGroup}>
                                <Typography>{t('CLOUD.USER.GROUP.ADD_USERS')}</Typography>
                            </StyledAddButton>
                            {/* 그룹에서 사용자 삭제 */}
                            <StyledDeleteButton
                                color="error"
                                disabled={checkedUsers.length === 0}
                                onClick={() => {
                                    setExceptUserModal(true);
                                }}
                            >
                                <Typography>{t('CLOUD.USER.GROUP.EXCLUDING_USER')}</Typography>
                            </StyledDeleteButton>
                        </ListButtonWrapper>
                        <ListSearchBarWrapper>
                            <ListTableForm inputSubmit={inputSubmit}>
                                <ListTableForm.Search
                                    placeholder={t('CLOUD.USER.GROUP.USER_NAME')}
                                    onChange={handleChange}
                                    value={searchFilterValue}
                                    disabled={groupUserFetching}
                                />
                                <ListTableForm.RefreshButton
                                    isLoading={groupUserFetching}
                                    refreshFn={groupUserReFresh}
                                />
                            </ListTableForm>
                        </ListSearchBarWrapper>
                    </ListToolBar>
                </ListToolBarWrapper>
                <ListTable
                    data={groupUserList?.users ?? []}
                    pagination={groupUserList?.pagination ?? {}}
                    columns={columns}
                    limit={limit}
                    offset={offset}
                    onChangeLimit={changePageSize}
                    onChangePage={changePage}
                    isFetching={groupUserFetching}
                    isLoading={groupUserLoading}
                    statusCode={groupUserList?.status}
                />
            </CardContent>

            {addUserInGroupModal && (
                <AddUserInGroup
                    open={addUserInGroupModal}
                    selectedGroupId={selectedGroupId}
                    userListInGroup={groupUserList?.users ?? []}
                    onClose={() => {
                        setAddUserInGroupModal(false);
                    }}
                />
            )}
            {exceptUserModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={exceptUserModal}
                    title={t('CLOUD.USER.GROUP.EXCLUDING_USER')}
                    onClose={() => {
                        setExceptUserModal(false);
                    }}
                    onConfirm={() => {
                        let users = [];
                        let userListId = groupAllUserList?.users.map(user => user.id);
                        // 현재 있는 사용자 - 선택한 사용자의 id 배열
                        let result = userListId.filter(data => !checkedUsers.includes(Number(data)));
                        // 보낼 데이터는 [{ id: "1" }, { id: "2" }] 객체 배열 형식
                        result.map(data => users.push({ id: data }));
                        exceptUserInGroup(users);
                    }}
                    isLoading={exceptLoading}
                    actionType="confirm"
                    buttonColor="error"
                >
                    <DialogText
                        title={t('CLOUD.USER.GROUP.EXCEPTION')}
                        body={t('CLOUD.USER.GROUP.WARN_EXCLUDING_USER')}
                    />
                </DefaultDialog>
            )}
        </>
    );
};

export default UserInGroup;

const StyledAddButton = styled(Button).attrs({ variant: 'contained' })`
    height: 100%;
`;

const StyledDeleteButton = styled(Button).attrs({ variant: 'contained' })`
    height: 100%;
`;
