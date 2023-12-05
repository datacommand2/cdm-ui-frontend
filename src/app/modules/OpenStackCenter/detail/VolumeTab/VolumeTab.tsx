import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { CardContent, Typography } from '@mui/material';

import { clusterVolumeKeys } from '../../../../../libs/utils/queryKeys';
import { _getClusterVolume } from '../../../../../api/center/cluster';
import TableHeader from '../../../../component/common/Table/TableHeader';
import NewTypeFormatter from '../../../../component/common/Table/formatter/NewTypeFormatter';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../component/common/ListToolBar/ListToolBar';
import ListTableForm from '../../../../component/common/ListTableForm/ListTableForm';
import ListTable from '../../../../component/common/Table/ListTable';
import { formatBytes } from '../../../../../libs/utils/commonFunction';
import { OpenStackVolume } from '../../../../../@types/Cluster/clusterService';

const columnHelper = createColumnHelper<OpenStackVolume>();

interface VolumeTabProps {
    id: number;
}

/**
 * 클러스터 아이디를 받아와서 클러스터 볼륨 목록을 구성하는 컴포넌트
 */
const VolumeTab = ({ id }: VolumeTabProps) => {
    // 검색 데이터
    const [inputData, setInputData] = useState('');
    // 볼륨 쿼리 정보
    // 검색 필터
    const [searchFilterValue, setSearchFilterValue] = useState('');
    // 한 페이지에 표시할 항목 개수
    const [limit, setLimit] = useState(10);
    // 페이지에 표시할 인덱스
    const [offset, setOffset] = useState(0);

    // 클러스터 볼륨 정보를 불러오는 함수
    const {
        data: clusterVolumes,
        isFetching: volumeFetching,
        isLoading: volumeLoading,
        refetch: volumeListRefresh,
    } = useQuery(
        clusterVolumeKeys.list({ clusterID: id, limit, offset, inputData: searchFilterValue }),
        () => _getClusterVolume(id, limit, offset, searchFilterValue),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return {
                        volumes: data.volumes,
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        volumes: [],
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
            columnHelper.accessor('tenant.name', {
                header: () => <TableHeader text={'프로젝트'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('size_bytes', {
                header: () => <TableHeader text={'크기'} />,
                cell: ({ getValue }) => <Typography>{formatBytes(getValue())}</Typography>,
            }),
            columnHelper.accessor('multiattach', {
                header: () => <TableHeader text={'공유'} />,
                cell: props => {
                    return <Typography>{props.row.original?.multiattach ? 'O' : 'X'}</Typography>;
                },
            }),
            columnHelper.accessor('storage.type_code', {
                header: () => <TableHeader text={'볼륨타입'} />,
                cell: props => {
                    return <NewTypeFormatter data={props.row.original?.storage?.type_code} />;
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
                            <ListTableForm.Search placeholder={'이름'} onChange={handleChange} value={inputData} />
                            <ListTableForm.RefreshButton refreshFn={volumeListRefresh} isLoading={volumeFetching} />
                        </ListTableForm>
                    </ListSearchBarWrapper>
                </ListToolBar>
                <ListTable
                    data={clusterVolumes?.volumes ?? []}
                    pagination={clusterVolumes?.pagination ?? {}}
                    columns={columns}
                    limit={limit}
                    offset={offset}
                    onChangeLimit={changePageSize}
                    onChangePage={changePage}
                    isFetching={volumeFetching}
                    isLoading={volumeLoading}
                    statusCode={clusterVolumes?.status}
                    type={'openstack-volume'}
                />
            </ListToolBarWrapper>
        </CardContent>
    );
};

export default VolumeTab;
