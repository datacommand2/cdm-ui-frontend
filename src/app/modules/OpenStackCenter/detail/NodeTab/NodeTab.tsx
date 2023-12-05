import React, { Suspense, useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { CardContent, Typography } from '@mui/material';

import { clusterHypervisorKeys } from '../../../../../libs/utils/queryKeys';
import { _getClusterHypervisor } from '../../../../../api/center/cluster';
import TableHeader from '../../../../component/common/Table/TableHeader';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../component/common/ListToolBar/ListToolBar';
import ListTableForm from '../../../../component/common/ListTableForm/ListTableForm';
import ListTable from '../../../../component/common/Table/ListTable';
import { formatBytes } from '../../../../../libs/utils/commonFunction';
import ActionsFormatter from '../../../../component/common/Table/formatter/ActionsFormatter';
import DetailDrawerSkeleton from '../../../../component/common/Skeleton/DetailDrawerSkeleton';
import NodeDetail from './NodeDetail';
import { OpenStackCluster } from '../../../../../@types/Cluster';
import { OpenStackHyperviser } from '../../../../../@types/Cluster/clusterService';
import useDrawer from '@/hooks/useDrawer';

interface NodeTabProps {
    id: number;
    cluster: OpenStackCluster;
}

interface NodeTableRow {
    id: number;
    hostname: string;
    type_code: string;
    ip_address: string;
    vcpu_total_cnt: number;
    mem_total_bytes: number;
    disk_total_bytes: number;
}
const columnHelper = createColumnHelper<NodeTableRow>();

/**
 * 클러스터 노드 목록을 불러오는 컴포넌트
 */
const NodeTab = ({ id, cluster }: NodeTabProps) => {
    // 검색 데이터
    const [inputData, setInputData] = useState('');
    // 하이퍼바이저 쿼리 정보
    // 검색 필터
    const [hostname, setHostName] = useState('');
    // 한 페이지에 표시할 항목 개수
    const [limit, setLimit] = useState(10);
    // 페이지에 표시할 인덱스
    const [offset, setOffset] = useState(0);

    // 클러스터 노드 정보를 불러오는 함수
    const {
        data: clusterHypervisors,
        isFetching: hypervisorFetching,
        isLoading: hypervisorLoading,
        refetch: hypervisorListRefresh,
    } = useQuery(
        clusterHypervisorKeys.list({ clusterID: id, limit, offset, hostname }),
        () => _getClusterHypervisor(id, limit, offset, hostname),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return {
                        hypervisors: data.hypervisors,
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        hypervisors: [],
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

    const { openDrawer } = useDrawer();

    const handleClick = useCallback(
        (nodeID: number) => {
            openDrawer(
                <Suspense fallback={<DetailDrawerSkeleton />}>
                    <NodeDetail clusterID={id} nodeID={nodeID} cluster={cluster} />
                </Suspense>,
            );
        },
        [cluster, id, openDrawer],
    );

    // 검색 input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target.value);
    };

    // 검색
    const inputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setHostName(inputData);
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
            columnHelper.accessor('hostname', {
                header: () => <TableHeader text={'호스트 이름'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('type_code', {
                header: () => <TableHeader text={'유형'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('ip_address', {
                header: () => <TableHeader text={'주소'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('vcpu_total_cnt', {
                header: () => <TableHeader text={'VCPUs(전체)'} />,
                cell: ({ getValue }) => {
                    return <Typography>{`${getValue() ?? 0}(core)`}</Typography>;
                },
            }),
            columnHelper.accessor('mem_total_bytes', {
                header: () => <TableHeader text={'RAM(전체)'} />,
                cell: ({ getValue }) => {
                    return <Typography>{formatBytes(getValue() ?? 0)}</Typography>;
                },
            }),
            columnHelper.accessor('disk_total_bytes', {
                header: () => <TableHeader text={'DISK(전체)'} />,
                cell: ({ getValue }) => {
                    return <Typography>{formatBytes(getValue() ?? 0)}</Typography>;
                },
            }),
            columnHelper.display({
                id: 'actions',
                header: () => <TableHeader text={'동작'} />,
                cell: props => (
                    <ActionsFormatter
                        monitoringEvent={() => {}}
                        addEvent={() => {}}
                        data={props?.row?.original}
                        type={`openstack-nodes`}
                        title={'노드'}
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
                                placeholder={'호스트 이름'}
                                onChange={handleChange}
                                value={inputData}
                            />
                            <ListTableForm.RefreshButton
                                refreshFn={hypervisorListRefresh}
                                isLoading={hypervisorFetching}
                            />
                        </ListTableForm>
                    </ListSearchBarWrapper>
                </ListToolBar>
                <ListTable
                    data={clusterHypervisors?.hypervisors ?? []}
                    pagination={clusterHypervisors?.pagination ?? {}}
                    columns={columns}
                    limit={limit}
                    offset={offset}
                    onChangeLimit={changePageSize}
                    onChangePage={changePage}
                    isFetching={hypervisorFetching}
                    isLoading={hypervisorLoading}
                    statusCode={clusterHypervisors?.status}
                    type={'openstack-node'}
                    onClick={(data: OpenStackHyperviser) => {
                        handleClick(data.id);
                    }}
                />
            </ListToolBarWrapper>
        </CardContent>
    );
};

export default NodeTab;
