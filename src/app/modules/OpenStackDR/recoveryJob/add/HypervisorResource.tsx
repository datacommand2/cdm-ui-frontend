import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { createColumnHelper } from '@tanstack/react-table';
import { Box, Skeleton, Typography, useTheme } from '@mui/material';

import { _getHypervisorResource } from '../../../../../api/dr/protectionGroup';
import TableHeader from '../../../../component/common/Table/TableHeader';
import NoPageTable from '../../../../component/common/Table/NoPageTable';
import { formatBytes } from '../../../../../libs/utils/commonFunction';

const columnHelper = createColumnHelper<any>();

interface HypervisorResourceProps {
    groupID: number;
    planID: number;
    type: string;
    snapshotID: number;
    setHypervisorResource: React.Dispatch<any>;
}

/**
 * 하이퍼바이저 리소스 정보를 보여주는 컴포넌트
 */
const HypervisorResource = ({ groupID, planID, type, snapshotID, setHypervisorResource }: HypervisorResourceProps) => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    // 하이퍼바이저 리소스 정보를 불러오는 함수
    const { data: hypervisorResource, isLoading: hypervisorResourceLoading } = useQuery(
        ['hypervisorResource', { groupID, planID, snapshotID }],
        () => _getHypervisorResource(groupID, planID, type, snapshotID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return {
                        hypervisor_resources: data.hypervisor_resources,
                        usable: data.usable,
                    };
                } else if (status === 204) {
                    return {};
                }
            },
            enabled: !!planID,
        },
    );

    useEffect(() => {
        if (hypervisorResource) {
            setHypervisorResource(hypervisorResource);
        }
    }, [hypervisorResource, setHypervisorResource]);

    const isAvailableResource = (total: number, expected: number) => {
        if (total < expected) {
            return `${mode}-error`;
        } else {
            return `${mode}-success`;
        }
    };

    // ..total    전체
    // ..expected 사용 예정
    // ..used     사용된
    const columns = useMemo(
        () => [
            columnHelper.display({
                id: 'name',
                header: () => <TableHeader text={'리소스'} />,
                cell: () => {
                    return (
                        <>
                            <Typography sx={{ fontWeight: 700 }}>VCPU</Typography>
                            <Typography sx={{ fontWeight: 700 }}>DISK</Typography>
                            <Typography sx={{ fontWeight: 700 }}>MEM</Typography>
                        </>
                    );
                },
            }),
            columnHelper.accessor('total', {
                header: () => <TableHeader text={'전체'} />,
                cell: ({ row }) => (
                    <>
                        <Typography>{row.original.vcpu_total_cnt} core</Typography>
                        <Typography>{formatBytes(row.original.disk_total_bytes)}</Typography>
                        <Typography>{formatBytes(row.original.mem_total_bytes)}</Typography>
                    </>
                ),
            }),
            columnHelper.accessor('used', {
                header: () => <TableHeader text={'사용중'} />,
                cell: ({ row }) => (
                    <>
                        <Typography>{row.original?.vcpu_used_cnt ?? 0} core</Typography>
                        <Typography>{formatBytes(row.original?.disk_used_bytes ?? 0)}</Typography>
                        <Typography>{formatBytes(row.original?.mem_used_bytes ?? 0)}</Typography>
                    </>
                ),
            }),
            columnHelper.accessor('expected', {
                header: () => <TableHeader text={'사용예정'} />,
                cell: ({ row }) => (
                    <>
                        <Typography
                            className={isAvailableResource(
                                row.original.vcpu_total_cnt,
                                row.original.vcpu_expected_usage,
                            )}
                        >
                            {row.original.vcpu_expected_usage} core
                        </Typography>
                        <Typography
                            className={isAvailableResource(
                                row.original.disk_total_bytes,
                                row.original.disk_expected_usage,
                            )}
                        >
                            {formatBytes(row.original.disk_expected_usage)}
                        </Typography>
                        <Typography
                            className={isAvailableResource(
                                row.original.mem_total_bytes,
                                row.original.mem_expected_usage,
                            )}
                        >
                            {formatBytes(row.original.mem_expected_usage)}
                        </Typography>
                    </>
                ),
            }),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    if (hypervisorResourceLoading) {
        return (
            <>
                <Skeleton width="70%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
                <Skeleton height={150} width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
            </>
        );
    } else {
        return (
            <>
                {hypervisorResource === undefined ? (
                    <div></div>
                ) : (
                    hypervisorResource?.hypervisor_resources?.map((resource: any, idx: number) => {
                        return (
                            <Wrapper key={idx}>
                                <HypervisorName>{resource.name}</HypervisorName>
                                <ResourceWrapper sx={{ border: `1px solid ${theme.palette.divider}` }}>
                                    <NoPageTable
                                        columns={columns}
                                        data={hypervisorResource.hypervisor_resources}
                                        noDataMessage={'데이터가 존재하지 않습니다.'}
                                    />
                                </ResourceWrapper>
                            </Wrapper>
                        );
                    })
                )}
            </>
        );
        // hypervisorResource 는 배열
    }
};

export default HypervisorResource;

const Wrapper = styled(Box)`
    display: flex;
    flex-direction: column;
`;

const HypervisorName = styled(Typography).attrs({ variant: 'h6' })`
    margin-bottom: 10px;
`;
const ResourceWrapper = styled(Box)`
    display: flex;
    margin-bottom: 1rem;
    overflow-x: auto;
    flex-direction: column;
    padding: 20px;
    border-radius: 5px;

    & .no-page-table {
        padding: 0;
    }

    & .no-page-table-container {
        padding: 0;
    }
`;
