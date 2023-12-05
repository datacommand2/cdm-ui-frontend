import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { CardContent, Typography } from '@mui/material';

import { clusterAvZoneKeys } from '../../../../../libs/utils/queryKeys';
import { _getClusterAvZone } from '../../../../../api/center/cluster';
import TableHeader from '../../../../component/common/Table/TableHeader';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../component/common/ListToolBar/ListToolBar';
import ListTableForm from '../../../../component/common/ListTableForm/ListTableForm';
import ListTable from '../../../../component/common/Table/ListTable';
import { OpenStackAvZone } from '../../../../../@types/Cluster/clusterService';

const columnHelper = createColumnHelper<OpenStackAvZone>();

interface AvZoneTabProps {
    id: number;
}

/**
 * 클러스터 아이디를 받아와서 테넌트, 가용구역 정보를 불러오는 컴포넌트
 */
const AvZoneTab = ({ id }: AvZoneTabProps) => {
    // 한 페이지에 표시할 항목 개수
    const [limit, setLimit] = useState(10);
    // 페이지에 표시할 인덱스
    const [offset, setOffset] = useState(0);

    // 클러스터 가용구역 정보를 불러오는 함수
    const {
        data: clusterAvZones,
        isFetching: avZoneFetching,
        isLoading: avZoneLoading,
        refetch: avZoneListRefresh,
    } = useQuery(clusterAvZoneKeys.list({ clusterID: id, limit, offset }), () => _getClusterAvZone(id, limit, offset), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                return {
                    avZones: data.availability_zones,
                    pagination: data.pagination,
                    status,
                };
            } else if (status === 204) {
                return {
                    avZones: [],
                    pagination: {},
                    status,
                };
            } else {
                throw new Error();
            }
        },
        keepPreviousData: true,
    });

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
            columnHelper.accessor('available', {
                header: () => <TableHeader text={'가용여부'} />,
                cell: ({ row }) => {
                    return <Typography>{row.original?.available ? '예' : '아니오'}</Typography>;
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
                        <ListTableForm.RefreshButton refreshFn={avZoneListRefresh} isLoading={avZoneFetching} />
                    </ListSearchBarWrapper>
                </ListToolBar>
                <ListTable
                    data={clusterAvZones?.avZones ?? []}
                    pagination={clusterAvZones?.pagination ?? {}}
                    columns={columns}
                    limit={limit}
                    offset={offset}
                    onChangeLimit={changePageSize}
                    onChangePage={changePage}
                    isFetching={avZoneFetching}
                    isLoading={avZoneLoading}
                    statusCode={clusterAvZones?.status}
                    type={'openstack-avzone'}
                    onClick={() => {}}
                />
            </ListToolBarWrapper>
        </CardContent>
    );
};

export default AvZoneTab;
