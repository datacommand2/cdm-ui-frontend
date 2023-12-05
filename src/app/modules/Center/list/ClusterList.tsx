import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { Tooltip, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { useTranslation } from 'react-i18next';

import { _getClusterList } from '../../../../api/center/cluster';
import AddButton from '../../../component/common/Button/AddButton';
import { clusterKeys } from '../../../../libs/utils/queryKeys';
import ListTableForm from '../../../component/common/ListTableForm/ListTableForm';
import NewTypeFormatter from '../../../component/common/Table/formatter/NewTypeFormatter';
import NewDateFormatter from '../../../component/common/Table/formatter/NewDateFormatter';
import ClusterSyncStatus from './ClusterSyncStatus';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../component/common/ListToolBar/ListToolBar';
import ClusterStatusChip from './ClusterStatusChip';
import ActionsFormatter from '../../../component/common/Table/formatter/ActionsFormatter';
import TableHeader from '../../../component/common/Table/TableHeader';
import ListTable from '../../../component/common/Table/ListTable';
import { PATHNAME } from '../../../../constant/pathname';
import { findLastWord } from '../../../../libs/utils/commonFunction';
import { LoginUser } from '../../../../recoil/atom/LoginUser';
import { clusterSyncStatus } from '../../../../recoil/atom/Cluster';
import { OpenStackCluster, OpenStackClusters } from '../../../../@types/Cluster';
import { OptionType } from '../../../../@types';

type ClusterListType = OpenStackCluster;

const columnHelper = createColumnHelper<ClusterListType>();
/**
 * 클러스터 목록을 보여주는 페이지
 */
const ClusterList = () => {
    const { t } = useTranslation();
    const resetSyncStatus = useResetRecoilState(clusterSyncStatus);
    const navigate = useNavigate();
    const [filterFlag, setFilterFlag] = useState(false);
    const [clusterList, setClusterList] = useState<ClusterListType[] | []>([]);
    const [filteredClusterList, setFilteredClusterList] = useState<ClusterListType[] | []>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(true);

    const loginUser = useRecoilValue(LoginUser);
    const role = loginUser?.roles?.[0]?.role ?? 'user';

    const [searchData, setSearchData] = useState('');
    const queryClient = useQueryClient();

    useEffect(() => {
        return () => {
            resetSyncStatus();
        };
    }, [queryClient, resetSyncStatus]);

    const [
        {
            data: openStackClusters = [],
            isLoading: openStackClusterLoading,
            isFetching: openStackClusterFetching,
            refetch: openStackRefresh,
        },
    ] = useQueries({
        queries: [
            {
                queryKey: clusterKeys.lists(),
                queryFn: () => _getClusterList(undefined),
                keepPreviousData: true,
                select: ([data, , status]: [{ clusters: OpenStackClusters[] } | null, Error | any, number]) => {
                    if (status === 200 || status === 201) {
                        return data?.clusters as OpenStackClusters[];
                    } else if (status === 204) {
                        return [];
                    } else {
                        return [];
                    }
                },
            },
        ],
    });

    useEffect(() => {
        if (!openStackClusterLoading) {
            setClusterList([...openStackClusters]);
            setIsLoading(false);
        }
        if (openStackClusterFetching === false) {
            setIsFetching(false);
        }
    }, [openStackClusterFetching, openStackClusterLoading, openStackClusters]);

    const clusterListRefresh = () => {
        openStackRefresh();
        setFilterFlag(false);
        setSearchData('');
        setFilteredClusterList([]);
    };
    // 검색 input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchData(e.target.value);
    };

    // 검색
    const inputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFilteredClusterList(
            clusterList.filter(cluster => cluster.name.toLowerCase().includes(searchData.toLowerCase())),
        );
        setFilterFlag(true);
    };

    // 보호그룹 추가 버튼을 눌렀을 때
    // history.push로 페이지 이동과 state 변수에
    // 클릭한 클러스터 id를 같이 넘겨줌
    const addProtectionGroup = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const id = e.currentTarget.id;
            navigate(PATHNAME.OPENSTACK_GROUP_ADD, {
                state: { clusterID: id },
            });
        },
        [navigate],
    );

    // 수정 버튼을 눌렀을 때
    // history.push로 페이지 이동과 state 변수에
    const editCluster = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const id = e.currentTarget.id;
            navigate(`${PATHNAME.OPENSTACK_CLUSTER_EDIT}/${id}`, {
                state: { clusterID: id },
            });
        },
        [navigate],
    );

    // 클러스터 상세 보기
    const detailCluster = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const id = e.currentTarget.id;
            navigate(`${PATHNAME.OPENSTACK_CLUSTER_DETAIL}/${id}`, { state: { clusterID: id } });
        },
        [navigate],
    );

    const columns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('type_code', {
                header: () => <TableHeader text={'타입'} />,
                cell: props => <NewTypeFormatter data={props.row.original.type_code} />,
            }),
            columnHelper.accessor('owner_group.name', {
                header: () => <TableHeader text={'소유자 그룹'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('state_code', {
                header: () => {
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <TableHeader text={'상태'} />
                            <Tooltip
                                title={<Typography>클러스터의 각 서비스 활성화 여부를 확인할 수 있습니다.</Typography>}
                            >
                                <div style={{ display: 'flex' }}>
                                    <ErrorIcon />
                                </div>
                            </Tooltip>
                        </div>
                    );
                },
                cell: props => {
                    return <ClusterStatusChip clusterID={props.row.original.id} isLoading={isFetching} />;
                },
            }),
            columnHelper.accessor('id', {
                header: () => {
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <TableHeader text={'동기화 상태'} />
                            <Tooltip
                                title={<Typography>클러스터의 각 서비스 동기화 상태를 확인할 수 있습니다.</Typography>}
                            >
                                <div style={{ display: 'flex' }}>
                                    <ErrorIcon />
                                </div>
                            </Tooltip>
                        </div>
                    );
                },
                cell: props => {
                    return <ClusterSyncStatus cluster={props.row.original} isLoading={isFetching} />;
                },
            }),
            columnHelper.accessor('created_at', {
                header: () => <TableHeader text={'등록일'} />,
                cell: props => <NewDateFormatter data={props} type={'created_at'} />,
            }),
            columnHelper.accessor('updated_at', {
                header: () => <TableHeader text={'수정일'} />,
                cell: props => <NewDateFormatter data={props} type={'updated_at'} />,
            }),
            columnHelper.display({
                id: 'actions',
                header: () => <TableHeader text={'동작'} />,
                cell: props => (
                    <ActionsFormatter
                        data={props?.row?.original}
                        addEvent={addProtectionGroup}
                        editEvent={editCluster}
                        role={role}
                        isLoading={isFetching}
                        type={`${findLastWord(props.row.original.type_code)}-cluster`}
                        title={'클러스터'}
                        detailEvent={detailCluster}
                        monitoringEvent={() => {}}
                        treeId={''}
                    />
                ),
            }),
        ],
        [isFetching, addProtectionGroup, editCluster, role, detailCluster],
    );

    const clusterTypeOptions = [
        { value: '', label: '클러스터 유형', isDisabled: true },
        { value: 'all', label: '전체' },
        { value: 'cluster.type.openstack', label: 'OpenStack' },
    ];

    return (
        <>
            <ListToolBarWrapper>
                <ListToolBar>
                    <ListButtonWrapper>
                        <AddButton
                            loading={isFetching}
                            url={{
                                pathname: PATHNAME.CLUSTER_ADD,
                            }}
                        />
                    </ListButtonWrapper>
                    <ListSearchBarWrapper>
                        <ListTableForm inputSubmit={inputSubmit}>
                            <ListTableForm.Filter
                                name="clusters"
                                disabled={isFetching}
                                className="list-select"
                                defaultValue={clusterTypeOptions[0]}
                                options={clusterTypeOptions}
                                onChange={(e: OptionType) => {
                                    if (e.value === 'all') {
                                        setFilterFlag(false);
                                        setFilteredClusterList([]);
                                    } else {
                                        setFilterFlag(true);
                                        setFilteredClusterList(
                                            clusterList.filter(
                                                cluster => findLastWord(cluster.type_code) === findLastWord(e.value),
                                            ),
                                        );
                                    }
                                }}
                            />
                            <ListTableForm.Search
                                placeholder={t('DR.CLUSTER_NAME')}
                                value={searchData}
                                onChange={handleChange}
                                disabled={isFetching}
                            />
                            <ListTableForm.RefreshButton refreshFn={clusterListRefresh} isLoading={isFetching} />
                        </ListTableForm>
                    </ListSearchBarWrapper>
                </ListToolBar>
            </ListToolBarWrapper>
            <ListTable
                data={!filterFlag ? clusterList : filteredClusterList}
                columns={columns}
                isFetching={isFetching}
                isLoading={isLoading}
                defaultPagination={true}
                type={'cluster-list'}
            />
        </>
    );
};

export default React.memo(ClusterList);
