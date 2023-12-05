import React, { useState, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { clusterRouterKeys } from '../../../../../libs/utils/queryKeys';
import { _getClusterRouter } from '../../../../../api/center/cluster';
import TableHeader from '../../../../component/common/Table/TableHeader';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../component/common/ListToolBar/ListToolBar';
import ListTableForm from '../../../../component/common/ListTableForm/ListTableForm';
import ListTable from '../../../../component/common/Table/ListTable';
import { OpenStackRouter } from '../../../../../@types/Cluster/clusterService';

const columnHelper = createColumnHelper<OpenStackRouter>();

type RowType = {
    row: OpenStackRouter;
};
/**
 * 외부 네트워크 이름
 */
const ExternalNetworkNameFormatter = ({ row }: RowType) => {
    return (
        <span>
            {row.external_routing_interfaces?.map((v, index) => {
                return (
                    <div key={`external_${v.network.name}-${index}`}>
                        <Typography>{v.network.name}</Typography>
                    </div>
                );
            })}
        </span>
    );
};

/**
 * 외부 네트워크 인터페이스
 */
const ExternalInterfaceFormatter = ({ row }: RowType) => {
    return (
        <span>
            {row.external_routing_interfaces?.map((v, index) => {
                return (
                    <div key={`external_${v.ip_address}-${index}`}>
                        <Typography>
                            {v.subnet.name}({v.ip_address})
                        </Typography>
                    </div>
                );
            })}
        </span>
    );
};

/**
 * 내부 네트워크 이름
 */
const InternalNetworkNameFormatter = ({ row }: RowType) => {
    return (
        <span>
            {row.internal_routing_interfaces?.map((v, index) => {
                return (
                    <div key={`internal_${v.network.name}-${index}`}>
                        <Typography>{v.network.name}</Typography>
                    </div>
                );
            })}
        </span>
    );
};

/**
 * 내부 네트워크 인터페이스
 */
const InternalInterfaceFormatter = ({ row }: RowType) => {
    return (
        <span>
            {row.internal_routing_interfaces?.map((v, index) => {
                return (
                    <div key={`internal_${v.ip_address}-${index}`}>
                        <Typography>
                            {v.subnet.name}({v.ip_address})
                        </Typography>
                    </div>
                );
            })}
        </span>
    );
};

interface RouterTabProps {
    id: number;
}

/**
 * 클러스터 id를 받아와서 클러스터 라우터 목록을 보여주는 컴포넌트
 */
const RouterTab = ({ id }: RouterTabProps) => {
    const { t } = useTranslation();
    const [inputData, setInputData] = useState('');
    // 라우터 쿼리 정보
    // 검색 필터
    const [uuid, setUuid] = useState('');
    // 한 페이지에 표시할 항목 개수
    const [limit, setLimit] = useState(10);
    // 페이지에 표시할 인덱스
    const [offset, setOffset] = useState(0);

    // 라우터 정보를 불러오는 함수
    const {
        data: clusterRouters,
        isFetching: routerFetching,
        isLoading: routerLoading,
        refetch: routerListRefresh,
    } = useQuery(
        clusterRouterKeys.list({ clusterID: id, limit, offset, uuid }),
        () => _getClusterRouter(id, limit, offset, uuid),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return {
                        routers: data.routers,
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        routers: [],
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
            columnHelper.accessor('external_routing_interfaces.network.name', {
                header: () => <TableHeader text={'외부 네트워크 이름'} />,
                cell: props => {
                    return <ExternalNetworkNameFormatter row={props.row.original} />;
                },
            }),
            columnHelper.accessor('external_routing_interfaces.subnet.name', {
                header: () => <TableHeader text={'외부 네트워크 인터페이스'} />,
                cell: props => {
                    return <ExternalInterfaceFormatter row={props.row.original} />;
                },
            }),
            columnHelper.accessor('internal_routing_interfaces.network.name', {
                header: () => <TableHeader text={'내부 네트워크 이름'} />,
                cell: props => {
                    return <InternalNetworkNameFormatter row={props.row.original} />;
                },
            }),
            columnHelper.accessor('internal_routing_interfaces.subnet.name', {
                header: () => <TableHeader text={'내부 네트워크 인터페이스'} />,
                cell: props => {
                    return <InternalInterfaceFormatter row={props.row.original} />;
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
                                placeholder={t('GLOBAL.UUID')}
                                onChange={handleChange}
                                value={inputData}
                            ></ListTableForm.Search>
                            <ListTableForm.RefreshButton refreshFn={routerListRefresh} isLoading={routerFetching} />
                        </ListTableForm>
                    </ListSearchBarWrapper>
                </ListToolBar>
                <ListTable
                    data={clusterRouters?.routers ?? []}
                    pagination={clusterRouters?.pagination ?? {}}
                    columns={columns}
                    limit={limit}
                    offset={offset}
                    onChangeLimit={changePageSize}
                    onChangePage={changePage}
                    isFetching={routerFetching}
                    isLoading={routerLoading}
                    statusCode={clusterRouters?.status}
                    type={'openstack-router'}
                    onClick={() => {}}
                />
            </ListToolBarWrapper>
        </CardContent>
    );
};

export default React.memo(RouterTab);
