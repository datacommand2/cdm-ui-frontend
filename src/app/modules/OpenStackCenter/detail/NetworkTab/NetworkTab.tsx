import React, { useState, useMemo, Suspense, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { clusterNetworkKeys } from '../../../../../libs/utils/queryKeys';
import { _getClusterNetwork } from '../../../../../api/center/cluster';
import TableHeader from '../../../../component/common/Table/TableHeader';
import NetworkDetail from './NetworkDetail';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../component/common/ListToolBar/ListToolBar';
import ListTableForm from '../../../../component/common/ListTableForm/ListTableForm';
import ListTable from '../../../../component/common/Table/ListTable';
import TableChip from '../../../../component/common/Chip/TableChip';
import { OpenStackNetwork } from '../../../../../@types/Cluster/clusterService';
import DetailDrawerSkeleton from '../../../../component/common/Skeleton/DetailDrawerSkeleton';
import ActionsFormatter from '../../../../component/common/Table/formatter/ActionsFormatter';
import { OpenStackCluster } from '../../../../../@types/Cluster';
import useDrawer from '@/hooks/useDrawer';

const columnHelper = createColumnHelper<OpenStackNetwork>();

interface NetworkTabProps {
    id: number;
    cluster: OpenStackCluster;
}

/**
 * 클러스터 아이디를 받아와 클러스터 네트워크를 조회하는 컴포넌트
 */
const NetworkTab = ({ id, cluster }: NetworkTabProps) => {
    const { t } = useTranslation();
    const [inputData, setInputData] = useState('');
    // 네트워크 쿼리 정보
    // 한 페이지에 표시할 항목 개수
    const [limit, setLimit] = useState(10);
    // 페이지에 표시할 인덱스
    const [offset, setOffset] = useState(0);
    // 검색 필터
    const [searchFilterValue, setSearchFilterValue] = useState('');

    const { openDrawer } = useDrawer();

    const handleClick = useCallback(
        (networkID: number) => {
            openDrawer(
                <Suspense fallback={<DetailDrawerSkeleton />}>
                    <NetworkDetail networkID={networkID} clusterID={cluster.id} />
                </Suspense>,
            );
        },
        [cluster, openDrawer],
    );

    // 클러스터 네트워크 정보를 불러오는 함수
    const {
        data: clusterNetwok,
        isFetching: networkFetching,
        isLoading: networkLoading,
        refetch: networkListRefresh,
    } = useQuery(
        clusterNetworkKeys.list({ clusterID: id, limit, offset, inputData: searchFilterValue }),
        () => _getClusterNetwork(id, limit, offset, searchFilterValue),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return {
                        networks: data.networks,
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        networks: [],
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
            columnHelper.accessor('tenant.name', {
                header: () => <TableHeader text={'프로젝트'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('type_code', {
                header: () => <TableHeader text={'유형'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('external_flag', {
                header: () => <TableHeader text={'외부 네트워크'} />,
                cell: props => {
                    return <Typography>{props.row.original?.external_flag ? 'O' : 'X'}</Typography>;
                },
            }),
            columnHelper.accessor('status', {
                header: () => <TableHeader text={'Status'} />,
                cell: props => <TableChip color={props?.row.original?.status} label={props?.row.original?.status} />,
            }),
            columnHelper.accessor('state', {
                header: () => <TableHeader text={'State'} />,
                cell: props => <TableChip color={props?.row.original?.state} label={props?.row.original?.state} />,
            }),
            columnHelper.display({
                id: 'actions',
                header: () => <TableHeader text={'동작'} />,
                cell: props => (
                    <ActionsFormatter
                        monitoringEvent={() => {}}
                        addEvent={() => {}}
                        data={props?.row?.original}
                        type={`openstack-networks`}
                        title={'네트워크'}
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
    // 검색 input change
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

    return (
        <CardContent>
            <ListToolBarWrapper>
                <ListToolBar>
                    <ListButtonWrapper>{}</ListButtonWrapper>
                    <ListSearchBarWrapper>
                        <ListTableForm inputSubmit={inputSubmit}>
                            <ListTableForm.Search
                                placeholder={t('GLOBAL.UUID')}
                                onChange={handleChange}
                                value={inputData}
                            />
                            <ListTableForm.RefreshButton refreshFn={networkListRefresh} isLoading={networkFetching} />
                        </ListTableForm>
                    </ListSearchBarWrapper>
                </ListToolBar>
                <ListTable
                    data={clusterNetwok?.networks ?? []}
                    pagination={clusterNetwok?.pagination ?? {}}
                    columns={columns}
                    limit={limit}
                    offset={offset}
                    onChangeLimit={changePageSize}
                    onChangePage={changePage}
                    isFetching={networkFetching}
                    isLoading={networkLoading}
                    statusCode={clusterNetwok?.status}
                    type={'openstack-network'}
                    onClick={(data: OpenStackNetwork) => {
                        handleClick(data.id);
                    }}
                />
            </ListToolBarWrapper>
        </CardContent>
    );
};

export default NetworkTab;
