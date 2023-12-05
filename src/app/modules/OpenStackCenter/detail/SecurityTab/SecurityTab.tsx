import React, { useState, useMemo, Suspense, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { CardContent, Typography } from '@mui/material';

import { clusterSecurityGroupKeys } from '../../../../../libs/utils/queryKeys';
import { _getClusterSecurityGroup } from '../../../../../api/center/cluster';
import TableHeader from '../../../../component/common/Table/TableHeader';
import SecurityDetail from './SecurityDetail';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../component/common/ListToolBar/ListToolBar';
import ListTableForm from '../../../../component/common/ListTableForm/ListTableForm';
import ListTable from '../../../../component/common/Table/ListTable';
import { OpenStackSecurityGroup } from '../../../../../@types/Cluster/clusterService';
import { OpenStackCluster } from '../../../../../@types/Cluster';
import DetailDrawerSkeleton from '../../../../component/common/Skeleton/DetailDrawerSkeleton';
import ActionsFormatter from '../../../../component/common/Table/formatter/ActionsFormatter';
import useDrawer from '@/hooks/useDrawer';

const columnHelper = createColumnHelper<OpenStackSecurityGroup>();

interface SecurityGroupTabProps {
    id: number;
    cluster: OpenStackCluster;
}

/**
 * 클러스터 아이디를 받아와서 보안그룹 목록을 구성하는 컴포넌트
 */
const SecurityTab = ({ id, cluster }: SecurityGroupTabProps) => {
    const [inputData, setInputData] = useState('');

    // 보안그룹 쿼리 정보
    // 검색 필터
    const [searchFilterValue, setSearchFilterValue] = useState('');
    // 한 페이지에 표시할 항목 개수
    const [limit, setLimit] = useState(10);
    // 페이지에 표시할 인덱스
    const [offset, setOffset] = useState(0);

    const { openDrawer } = useDrawer();

    const handleClick = useCallback(
        (securityGroupID: number) => {
            openDrawer(
                <Suspense fallback={<DetailDrawerSkeleton />}>
                    <SecurityDetail securityGroupID={securityGroupID} clusterID={cluster.id} />
                </Suspense>,
            );
        },
        [cluster, openDrawer],
    );

    // 클러스터 보안그룹 정보를 불러오는 함수
    const {
        data: clusterSecurityGroups,
        isFetching: securityGroupFetching,
        isLoading: securityGroupLoading,
        refetch: securityGroupListRefresh,
    } = useQuery(
        clusterSecurityGroupKeys.list({ clusterID: id, limit, offset, inputData: searchFilterValue }),
        () => _getClusterSecurityGroup(id, limit, offset, searchFilterValue),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return {
                        securityGroups: data.security_groups,
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        securityGroups: [],
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

    // 검색 inputChange
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target.value);
    };

    // 검색
    const inputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearchFilterValue(inputData);
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
            columnHelper.accessor('uuid', {
                header: () => <TableHeader text={'UUID'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('description', {
                header: () => <TableHeader text={'설명'} />,
                cell: ({ getValue }) => <Typography>{getValue() ?? '-'}</Typography>,
            }),
            columnHelper.display({
                id: 'actions',
                header: () => <TableHeader text={'동작'} />,
                cell: props => (
                    <ActionsFormatter
                        monitoringEvent={() => {}}
                        addEvent={() => {}}
                        data={props?.row?.original}
                        type={`openstack-securitygroup`}
                        title={'보안그룹'}
                        detailEvent={() => {
                            handleClick(props.row.original.id);
                        }}
                        editEvent={() => {}}
                        treeId={''}
                    />
                ),
            }),
        ],
        [handleClick],
    );

    return (
        <CardContent>
            <ListToolBarWrapper>
                <ListToolBar>
                    <ListButtonWrapper>{}</ListButtonWrapper>
                    <ListSearchBarWrapper>
                        <ListTableForm inputSubmit={inputSubmit}>
                            <ListTableForm.Search placeholder={'이름'} onChange={handleChange} value={inputData} />
                            <ListTableForm.RefreshButton
                                refreshFn={securityGroupListRefresh}
                                isLoading={securityGroupFetching}
                            />
                        </ListTableForm>
                    </ListSearchBarWrapper>
                </ListToolBar>
                <ListTable
                    data={clusterSecurityGroups?.securityGroups ?? []}
                    pagination={clusterSecurityGroups?.pagination ?? {}}
                    columns={columns}
                    limit={limit}
                    offset={offset}
                    onChangeLimit={changePageSize}
                    onChangePage={changePage}
                    isFetching={securityGroupFetching}
                    isLoading={securityGroupLoading}
                    statusCode={clusterSecurityGroups?.status}
                    type={'openstack-securitygroup'}
                    onClick={(data: OpenStackSecurityGroup) => {
                        handleClick(data.id);
                    }}
                />
            </ListToolBarWrapper>
        </CardContent>
    );
};

export default SecurityTab;
