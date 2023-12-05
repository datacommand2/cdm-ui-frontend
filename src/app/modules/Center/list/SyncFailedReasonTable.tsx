import { Typography } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import NoPageTable from '../../../component/common/Table/NoPageTable';

interface Reason {
    code: string;
    contents?: string;
}

// TODO: 타입 정의
interface SyncFailedReasonTableProps {
    reasons: any;
}
const columnHelper = createColumnHelper<Reason>();

/**
 * 클러스터 동기화 실패 사유를 보여주는 테이블
 */
const SyncFailedReasonTable = ({ reasons }: SyncFailedReasonTableProps) => {
    const columns = useMemo(
        () => [
            columnHelper.accessor('code', {
                header: () => <StyledHeader>이름</StyledHeader>,
                cell: ({ row }) => <Typography>{row.original.code.split('.')[2]}</Typography>,
            }),
            columnHelper.accessor('contents', {
                header: () => <StyledHeader>이유</StyledHeader>,
                cell: props => {
                    return <Typography>{props.row.original.contents}</Typography>;
                },
            }),
        ],
        [],
    );

    return <NoPageTable columns={columns} data={reasons} isLoading={false} noDataMessage={''} />;
};

export default SyncFailedReasonTable;

const StyledHeader = styled(Typography)`
    font-weight: 700;
`;
