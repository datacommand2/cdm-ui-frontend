import React, { Suspense, useCallback, useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { clusterInstanceKeys } from '../../../../../libs/utils/queryKeys';
import { _getClusterInstance } from '../../../../../api/center/cluster';
import TableHeader from '../../../../component/common/Table/TableHeader';
import InstanceDetail from './InstanceDetail';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../component/common/ListToolBar/ListToolBar';
import ListTableForm from '../../../../component/common/ListTableForm/ListTableForm';
import ListTable from '../../../../component/common/Table/ListTable';
import TableChip from '../../../../component/common/Chip/TableChip';
import { OpenStackCluster } from '../../../../../@types/Cluster';
import { OpenStackInstance } from '../../../../../@types/Cluster/clusterService';
import DetailDrawerSkeleton from '../../../../component/common/Skeleton/DetailDrawerSkeleton';
import ActionsFormatter from '../../../../component/common/Table/formatter/ActionsFormatter';
import useDrawer from '@/hooks/useDrawer';

const columnHelper = createColumnHelper<OpenStackInstance>();

interface InstanceTabProps {
    id: number;
    cluster: OpenStackCluster;
}

/**
 * 클러스터 아이디를 받아와서 인스턴스 목록을 구성하는 컴포넌트
 */
const InstanceTab = ({ id, cluster }: InstanceTabProps) => {
    const { t } = useTranslation();
    // 검색 데이터
    const [inputData, setInputData] = useState('');

    // 인스턴스 쿼리 정보
    // 검색 필터
    const [name, setName] = useState('');
    // 한 페이지에 표시할 항목 개수
    const [limit, setLimit] = useState(10);
    // 페이지에 표시할 인덱스
    const [offset, setOffset] = useState(0);

    const { openDrawer } = useDrawer();

    const handleClick = useCallback(
        (instanceID: number) => {
            openDrawer(
                <Suspense fallback={<DetailDrawerSkeleton />}>
                    <InstanceDetail instanceID={instanceID} clusterID={cluster.id} />
                </Suspense>,
            );
        },
        [cluster, openDrawer],
    );

    // 클러스터 인스턴스 정보를 불러오는 함수
    const {
        data: clusterInstances,
        isFetching: instanceFetching,
        isLoading: instanceLoading,
        refetch: instanceListRefresh,
    } = useQuery(
        clusterInstanceKeys.list({ clusterID: id, limit, offset, name }),
        () => _getClusterInstance(id, limit, offset, name),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return {
                        instances: data.instances,
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        instances: [],
                        pagination: {},
                        status,
                    };
                } else throw new Error();
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
        setName(inputData);
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
            columnHelper.accessor('tenant.name', {
                header: () => <TableHeader text={'프로젝트'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('availability_zone.name', {
                header: () => <TableHeader text={'가용구역'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('hypervisor.hostname', {
                header: () => <TableHeader text={'노드'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
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
                        type={`openstack-instances`}
                        title={'인스턴스'}
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
                            <ListTableForm.Search
                                placeholder={t('TABLE.NAME')}
                                onChange={handleChange}
                                value={inputData}
                            ></ListTableForm.Search>
                            <ListTableForm.RefreshButton refreshFn={instanceListRefresh} isLoading={instanceFetching} />
                        </ListTableForm>
                    </ListSearchBarWrapper>
                </ListToolBar>
                <ListTable
                    data={clusterInstances?.instances ?? []}
                    pagination={clusterInstances?.pagination ?? {}}
                    columns={columns}
                    limit={limit}
                    offset={offset}
                    onChangeLimit={changePageSize}
                    onChangePage={changePage}
                    isFetching={instanceFetching}
                    isLoading={instanceLoading}
                    statusCode={clusterInstances?.status}
                    type={'openstack-instance'}
                    onClick={(data: OpenStackInstance) => {
                        handleClick(data.id);
                    }}
                />
            </ListToolBarWrapper>
        </CardContent>
    );
};

export default React.memo(InstanceTab);
