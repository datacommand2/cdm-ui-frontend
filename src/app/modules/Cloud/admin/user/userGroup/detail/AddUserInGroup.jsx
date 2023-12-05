import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { _getUserListInGroup, _modifyUserListInGroup } from '../../../../../../../api/cloud/identity';
import { userGroupKeys } from '../../../../../../../libs/utils/queryKeys';
import ActionButton from '../../../../../../component/common/Button/ActionButton';
import IndeterminateCheckBox from '../../../../../../component/common/IndeterminateCheckBox';
import DefaultDialog from '../../../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../../../component/common/Dialog/DialogText';
import TableHeader from '../../../../../../component/common/Table/TableHeader';
import ListTable from '../../../../../../component/common/Table/ListTable';

const columnHelper = createColumnHelper();

export const AddUserInGroup = ({ onClose, open, selectedGroupId, userListInGroup }) => {
    const { t } = useTranslation();
    const [addModal, setAddModal] = useState(false);
    const [allChecked, setAllChecked] = useState(false);
    const [checkedUsers, setCheckedUsers] = useState([]);

    const queryClient = useQueryClient();

    let existingUsers = userListInGroup.map(user => user.id);

    // 사용자 추가 버튼을 눌렀을 때
    // 그룹 내 속해있는 사용자를 제외한 모든 사용자 목록을 조회하는 함수
    // TODO: 2023-10-18 수정
    // 원래는 직접 pagination을 계산해서 사용했음 (왜? admin 은 빠지고 나머지로 테이블을 구성해야 했기 때문에)

    // 그 코드보다 그냥 전체를 조회하고 admin 제외 후 defaultPagination=true 를 하는게 더 낫다고 판단
    const {
        data: userList,
        isFetching: userListFetching,
        isLoading: userListLoading,
    } = useQuery(userGroupKeys.userListOutGroup({ selectedGroupId }), () => _getUserListInGroup(selectedGroupId), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                const filterData = data.users.filter(user => user.id !== '1');
                return filterData;
            } else if (status === 204) {
                return [];
            } else {
                throw new Error();
            }
        },
        keepPreviousData: true,
    });

    // 사용자 그룹에 사용자를 추가하는 함수
    const { isLoading: addLoading, mutate: addUserInGroup } = useMutation(
        payload => _modifyUserListInGroup(selectedGroupId, payload),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    toast.success(t('CLOUD.USER.GROUP.SUCCESS_ADD_USER'));
                    queryClient.invalidateQueries(userGroupKeys.userListsInGroup());
                }
                setAddModal(false);
                onClose();
            },
        },
    );

    // 모달이 종료될 때 clean-up
    // 안해주면 취소하고 다시 들어왔을 때 selectedRow 값이 남아있음
    useEffect(() => {
        return () => {
            setCheckedUsers([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

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
            <Dialog open={open} fullWidth maxWidth={'lg'}>
                <DialogTitle>{t('CLOUD.USER.GROUP.ADD_USERS')}</DialogTitle>
                <Divider />
                <DialogContent>
                    <ListTable
                        data={userList ?? []}
                        columns={columns}
                        isFetching={userListFetching}
                        isLoading={userListLoading}
                        defaultPagination={true}
                        statusCode={userList?.status}
                    />
                </DialogContent>
                <Divider />
                <DialogActions>
                    <ActionButton buttonType="cancel" onClick={onClose} />
                    <ActionButton
                        buttonType="add"
                        disabled={checkedUsers.length === 0}
                        onClick={() => {
                            // 데이터 형식 맞추기
                            // 원래 존재하는 사용자도 같이 넣어준다
                            setAddModal(true);
                        }}
                    />
                </DialogActions>
            </Dialog>
            {addModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={addModal}
                    title={t('CLOUD.USER.GROUP.ADD_USERS')}
                    onClose={() => {
                        setAddModal(false);
                    }}
                    onConfirm={() => {
                        let users = [];

                        existingUsers.map(data => users.push({ id: data }));
                        checkedUsers.map(data => users.push({ id: data }));
                        addUserInGroup(users);
                    }}
                    isLoading={addLoading}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    <DialogText title={t('BUTTON.ADD')} body={t('CLOUD.USER.GROUP.ADD_USERS_IN_GROUP_STORY')} />
                </DefaultDialog>
            )}
        </>
    );
};
