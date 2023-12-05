import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useComputed, useSignal } from '@preact/signals-react';

import ListTableForm from '@component/common/ListTableForm/ListTableForm';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '@component/common/ListToolBar/ListToolBar';
import AddButton from '@component/common/Button/AddButton';
import ListTable from '@component/common/Table/ListTable';
import { OptionType } from '@/@types';

import { useUsersQuery } from '../common/hooks';
import { createColumns } from '../common/components';

/**
 * 사용자 목록을 보여주는 컴포넌트
 */
const UserAccountList = () => {
    const { t } = useTranslation();
    const inputData = useSignal('');
    // 사용자 목록 목록 쿼리
    const queryData = useSignal({
        inputData: '',
        limit: 10,
        offset: 0,
        isLogin: false,
    });
    const navigate = useNavigate();

    const {
        data: usersData,
        isFetching: usersFetching,
        isLoading: usersLoading,
        refetch: userListRefresh,
    } = useUsersQuery({ queryData: queryData.value });

    // 수정 버튼을 눌렀을 때
    // history.push로 페이지 이동과 state 변수에
    // 클릭한 보호그룹 id를 같이 넘겨줌
    const passSelectedRowDataToEdit = (e: React.MouseEvent<HTMLElement>) => {
        const id = e.currentTarget.id;

        navigate(`/cloud/admin/users/userAccount/edit/${id}`, {
            state: { RowID: id },
        });
    };

    // 페이지 당 보여주는 데이터 수를 변경했을 때
    const changePageSize = (value: number) => {
        queryData.value = { ...queryData.value, limit: value };
    };

    // 페이지가 바뀔 때
    const changePage = (value: number) => {
        queryData.value = { ...queryData.value, offset: value };
    };

    // 접속여부 필터링
    const onChangeConnect = (e: OptionType) => {
        if (e.value === 'true') {
            queryData.value = { ...queryData.value, offset: 0, isLogin: true };
        } else if (e.value === 'false') {
            queryData.value = { ...queryData.value, offset: 0, isLogin: false };
        }
    };

    // 검색 input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        inputData.value = e.target.value;
    };

    // 검색
    const inputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        queryData.value = {
            ...queryData.value,
            offset: 0,
            inputData: inputData.value,
        };
    };

    const columns = useComputed(() =>
        createColumns({
            usersData,
            passSelectedRowDataToEdit,
            queryData: queryData.value,
        }),
    );

    const loginOptions = [
        { value: '', label: '접속여부', isDisabled: true },
        { value: 'false', label: '전체' },
        { value: 'true', label: '로그인' },
    ];

    return (
        <>
            <ListToolBarWrapper>
                {/* 검색 및 계정 추가 영역 */}
                <ListToolBar>
                    {/* 계정 추가 영역 */}
                    <ListButtonWrapper>
                        <AddButton
                            loading={usersLoading}
                            url={{
                                pathname: '/cloud/admin/users/userAccount/add',
                            }}
                        />
                    </ListButtonWrapper>
                    {/* 접속여부, 사용자 이름 검색 영역 */}
                    <ListSearchBarWrapper>
                        <ListTableForm inputSubmit={inputSubmit}>
                            <ListTableForm.Filter
                                className="list-select"
                                name="connect"
                                onChange={onChangeConnect}
                                defaultValue={loginOptions[0]}
                                options={loginOptions}
                                disabled={usersLoading}
                            />
                            <ListTableForm.Search
                                placeholder={t('CLOUD.USER.ACCOUNT.USER_NAME')}
                                onChange={handleChange}
                                value={inputData}
                            />
                            <ListTableForm.RefreshButton refreshFn={userListRefresh} isLoading={usersFetching} />
                        </ListTableForm>
                    </ListSearchBarWrapper>
                </ListToolBar>
            </ListToolBarWrapper>
            <ListTable
                data={usersData?.users ?? []}
                columns={columns.value}
                pagination={usersData?.pagination ?? {}}
                limit={queryData.value.limit}
                offset={queryData.value.offset}
                onChangeLimit={changePageSize}
                onChangePage={changePage}
                isFetching={usersFetching}
                isLoading={usersLoading}
                statusCode={usersData?.status}
                type={'cloud-user'}
            />
        </>
    );
};

export default UserAccountList;
