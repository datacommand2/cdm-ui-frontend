import React, { useState, useMemo, Suspense, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { CardContent, Typography } from '@mui/material';

import { clusterVolumeTypeKeys } from '../../../../../libs/utils/queryKeys';
import { _getClusterVolumeType } from '../../../../../api/center/cluster';
import TableHeader from '../../../../component/common/Table/TableHeader';
import NewTypeFormatter from '../../../../component/common/Table/formatter/NewTypeFormatter';
import TableChip from '../../../../component/common/Chip/TableChip';
import VolumeTypeDetail from './VolumeTypeDetail';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../component/common/ListToolBar/ListToolBar';
import ListTableForm from '../../../../component/common/ListTableForm/ListTableForm';
import ListTable from '../../../../component/common/Table/ListTable';
import { formatBytes } from '../../../../../libs/utils/commonFunction';
import { OpenSatckStorage } from '../../../../../@types/Cluster/clusterService';
import ActionsFormatter from '../../../../component/common/Table/formatter/ActionsFormatter';
import DetailDrawerSkeleton from '../../../../component/common/Skeleton/DetailDrawerSkeleton';
import { OpenStackCluster } from '../../../../../@types/Cluster';
import useDrawer from '@/hooks/useDrawer';

const columnHelper = createColumnHelper<OpenSatckStorage>();

interface VolumeTypeTabProps {
    id: number;
    cluster: OpenStackCluster;
}

/**
 * 클러스터 아이디를 받아와서 볼륨타입 목록을 구성하는 컴포넌트
 */
const VolumeTypeTab = ({ id, cluster }: VolumeTypeTabProps) => {
    // inputData
    const [inputData, setInputData] = useState('');

    // 볼륨타입 쿼리 정보
    const [searchFilterValue, setSearchFilterValue] = useState('');
    // 한 페이지에 표시할 항목 개수
    const [limit, setLimit] = useState(10);
    // 페이지에 표시할 인덱스
    const [offset, setOffset] = useState(0);

    const { openDrawer } = useDrawer();

    const handleClick = useCallback(
        (volumeTypeID: number) => {
            openDrawer(
                <Suspense fallback={<DetailDrawerSkeleton />}>
                    <Suspense fallback={<DetailDrawerSkeleton />}>
                        <VolumeTypeDetail volumeTypeID={volumeTypeID} clusterID={cluster.id} cluster={cluster} />
                    </Suspense>
                </Suspense>,
            );
        },
        [cluster, openDrawer],
    );

    // 볼륨타입 목록을 조회하는 함수
    const {
        data: clusterVolumeTypes,
        isFetching: volumeTypeFetching,
        isLoading: volumeTypeLoading,
        refetch: volumeTypeRefresh,
    } = useQuery(
        clusterVolumeTypeKeys.list({ clusterID: id, limit, offset, inputData: searchFilterValue }),
        () => _getClusterVolumeType(id, limit, offset, searchFilterValue),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return {
                        volumeTypes: data.storages,
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        volumeTypes: [],
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
            columnHelper.accessor('type_code', {
                header: () => <TableHeader text={'타입'} />,
                cell: ({ getValue }) => <NewTypeFormatter data={getValue()} />,
            }),
            columnHelper.accessor('status', {
                header: () => <TableHeader text={'Status'} />,
                cell: props => {
                    return <TableChip label={props.row.original.status} color={props.row.original.status} />;
                },
            }),
            columnHelper.accessor('capacity_bytes', {
                header: () => <TableHeader text={'용량'} />,
                cell: props => {
                    return <Typography>{formatBytes(props.row.original.capacity_bytes)}</Typography>;
                },
            }),
            columnHelper.accessor('used_bytes', {
                header: () => <TableHeader text={'사용량'} />,
                cell: props => {
                    return <Typography>{formatBytes(props.row.original.used_bytes)}</Typography>;
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
                        type={`openstack-networks`}
                        title={'볼륨타입'}
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
                            <ListTableForm.RefreshButton refreshFn={volumeTypeRefresh} isLoading={volumeTypeFetching} />
                        </ListTableForm>
                    </ListSearchBarWrapper>
                </ListToolBar>
                <ListTable
                    data={clusterVolumeTypes?.volumeTypes ?? []}
                    pagination={clusterVolumeTypes?.pagination ?? {}}
                    columns={columns}
                    limit={limit}
                    offset={offset}
                    onChangeLimit={changePageSize}
                    onChangePage={changePage}
                    isFetching={volumeTypeFetching}
                    isLoading={volumeTypeLoading}
                    statusCode={clusterVolumeTypes?.status}
                    type={'openstack-volumetype'}
                    onClick={(data: OpenSatckStorage) => {
                        handleClick(data.id);
                    }}
                />
            </ListToolBarWrapper>
        </CardContent>
    );
};

export default VolumeTypeTab;
