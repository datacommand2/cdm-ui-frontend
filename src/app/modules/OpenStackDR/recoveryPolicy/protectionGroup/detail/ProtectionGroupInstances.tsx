import { useQuery } from '@tanstack/react-query';
import React, { Suspense, useCallback, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/table-core';
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';

import { protectionGroupKeys } from '../../../../../../libs/utils/queryKeys';
import { _getProtectionGroupDetail } from '../../../../../../api/dr/protectionGroup';
import { Detail } from '../../../../../component/common/Detail/Detail';
import TableHeader from '../../../../../component/common/Table/TableHeader';
import TableChip from '../../../../../component/common/Chip/TableChip';
import NoPageTable from '../../../../../component/common/Table/NoPageTable';
import DetailActions from '../../../../../component/common/Table/formatter/DetailActions';
import DetailDrawerSkeleton from '../../../../../component/common/Skeleton/DetailDrawerSkeleton';
import InstanceDetail from '../../../../OpenStackCenter/detail/InstanceTab/InstanceDetail';
import useDrawer from '@/hooks/useDrawer';

interface Instance {
    id: number;
    uuid: string;
    name: string;
    tenant: {
        name: string;
    };
    availability_zone: {
        name: string;
    };
    status: string;
    state: string;
}

const columnHelper = createColumnHelper<Instance>();

/**
 * 보호그룹 인스턴스 목록
 */
const ProtectionGroupInstances = () => {
    const location = useLocation();
    const GroupID = location.state.GroupID;

    const { openDrawer } = useDrawer();

    const { data: protectionGroupDetail } = useQuery(
        protectionGroupKeys.detail(GroupID),
        () => _getProtectionGroupDetail(GroupID),
        {
            select: ([data, ,]) => {
                return data.group;
            },
            suspense: true,
        },
    );

    const handleClick = useCallback(
        (instanceID: number) => {
            openDrawer(
                <Suspense fallback={<DetailDrawerSkeleton />}>
                    <InstanceDetail clusterID={protectionGroupDetail.protection_cluster.id} instanceID={instanceID} />
                </Suspense>,
            );
        },
        [openDrawer, protectionGroupDetail],
    );

    const instancesColumns = useMemo(
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
                cell: ({ row }) => (
                    <DetailActions
                        onClick={() => {
                            handleClick(row.original.id);
                        }}
                    />
                ),
            }),
        ],
        [handleClick],
    );

    // 이름, 프로젝트, 가용구역, Status, State, Action
    return (
        <Detail>
            <Detail.Title text={`보호그룹 인스턴스 목록 (${protectionGroupDetail?.instances?.length ?? 0})`} />
            <Detail.Body>
                <NoPageTable
                    columns={instancesColumns}
                    data={protectionGroupDetail?.instances ?? []}
                    noDataMessage={'인스턴스 목록이 존재하지 않습니다.'}
                    onClick={(data: any) => {
                        handleClick(data.id);
                    }}
                />
            </Detail.Body>
        </Detail>
    );
};

export default ProtectionGroupInstances;
