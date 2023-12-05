import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { CardContent, Typography } from '@mui/material';

import { clusterTenantKeys } from '../../../../../libs/utils/queryKeys';
import { _getClusterTenant } from '../../../../../api/center/cluster';
import TableHeader from '../../../../component/common/Table/TableHeader';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../component/common/ListToolBar/ListToolBar';
import ListTableForm from '../../../../component/common/ListTableForm/ListTableForm';
import ListTable from '../../../../component/common/Table/ListTable';
import { OpenStackTenant } from '../../../../../@types/Cluster/clusterService';

const columnHelper = createColumnHelper<OpenStackTenant>();

interface TenantTabProps {
    id: number;
}

/**
 * 클러스터 아이디를 받아와서 테넌트, 가용구역 정보를 불러오는 컴포넌트
 */
const TenantTab = ({ id }: TenantTabProps) => {
    const [inputData, setInputData] = useState('');
    // 라우터 쿼리 정보
    // 검색 필터
    const [uuid, setUuid] = useState('');
    // 한 페이지에 표시할 항목 개수
    const [limit, setLimit] = useState(10);
    // 페이지에 표시할 인덱스
    const [offset, setOffset] = useState(0);

    // 클러스터 테넌트 정보를 불러오는 함수
    const {
        data: clusterTenants,
        isFetching: tenantFetching,
        isLoading: tenantLoading,
        refetch: tenantListRefresh,
    } = useQuery(
        clusterTenantKeys.list({ clusterID: id, limit, offset, uuid }),
        () => _getClusterTenant(id, limit, offset, uuid),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return {
                        tenants: data.tenants,
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        tenants: [],
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

    // 검색 input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target.value);
    };

    // 검색
    const inputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUuid(inputData);
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
            columnHelper.accessor('enabled', {
                header: () => <TableHeader text={'활성화 여부'} />,
                cell: ({ row }) => {
                    return <Typography>{row.original?.enabled === true ? '활성화' : '비활성화'}</Typography>;
                },
            }),
        ],
        [],
    );

    return (
        <CardContent>
            <ListToolBarWrapper>
                <ListToolBar>
                    <ListButtonWrapper>{}</ListButtonWrapper>
                    <ListSearchBarWrapper>
                        <ListTableForm inputSubmit={inputSubmit}>
                            <ListTableForm.Search
                                placeholder={'이름'}
                                onChange={handleChange}
                                value={inputData}
                            ></ListTableForm.Search>
                            <ListTableForm.RefreshButton refreshFn={tenantListRefresh} isLoading={tenantFetching} />
                        </ListTableForm>
                    </ListSearchBarWrapper>
                </ListToolBar>
                <ListTable
                    data={clusterTenants?.tenants ?? []}
                    pagination={clusterTenants?.pagination ?? {}}
                    columns={columns}
                    limit={limit}
                    offset={offset}
                    onChangeLimit={changePageSize}
                    onChangePage={changePage}
                    isFetching={tenantFetching}
                    isLoading={tenantLoading}
                    statusCode={clusterTenants?.status ?? 200}
                    type={'openstack-tenant'}
                />
            </ListToolBarWrapper>
        </CardContent>
    );
};

export default TenantTab;
