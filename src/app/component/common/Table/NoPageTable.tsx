import { Table, Typography } from '@mui/material';
import { useReactTable, flexRender, getCoreRowModel } from '@tanstack/react-table';
import React from 'react';

import * as S from './ListTable.style';
import TreeListSkeleton from '../Skeleton/TreeListSkeleton';

interface NoPageTableProps {
    columns: any[];
    data: any[];
    isLoading?: boolean;
    noDataMessage: string;
    onClick?: any;
}

const NoPageTable = ({ columns, data, isLoading = false, noDataMessage, onClick = () => {} }: NoPageTableProps) => {
    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
    return (
        <S.ListWrapper className="no-page-table">
            <S.NoPageListTableContainer className="no-page-table-container">
                <Table size="small">
                    <S.ListTableHead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <S.ListTableRow key={`no-page-table-${headerGroup.id}`}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <S.ListTableHeaderCell
                                            colSpan={header.colSpan}
                                            id={`table-checkbox-${header.id}`}
                                            key={`no-page-table-${header.id}`}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </S.ListTableHeaderCell>
                                    );
                                })}
                            </S.ListTableRow>
                        ))}
                    </S.ListTableHead>
                    {data.length === 0 ? (
                        TableNoContent({ columns, noDataMessage })
                    ) : isLoading ? (
                        TableLoading({ columns })
                    ) : (
                        <S.ListTableBody>
                            {table.getRowModel().rows.map(row => {
                                return (
                                    <S.ListTableRow id={row.id} key={`no-page-table-${row.id}`}>
                                        {row.getVisibleCells().map(cell => (
                                            <S.ListTableContentCell
                                                key={`no-page-table-${cell.id}`}
                                                onClick={() => {
                                                    if (cell.column.id !== 'actions' && row.original) {
                                                        onClick(row.original);
                                                    }
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </S.ListTableContentCell>
                                        ))}
                                    </S.ListTableRow>
                                );
                            })}
                        </S.ListTableBody>
                    )}
                </Table>
            </S.NoPageListTableContainer>
        </S.ListWrapper>
    );
};

export default NoPageTable;

const TableNoContent = ({
    columns,
    noDataMessage = '데이터가 존재하지 않습니다.',
}: {
    columns: any[];
    noDataMessage: string;
}) => {
    return (
        <S.ListTableBody>
            <S.ListTableRow>
                <S.ListTableContentCell colSpan={columns.length} sx={{ p: 0.5, border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                        <Typography>{noDataMessage}</Typography>
                    </div>
                </S.ListTableContentCell>
            </S.ListTableRow>
        </S.ListTableBody>
    );
};

const TableLoading = ({ columns }: { columns: any[] }) => {
    return (
        <S.ListTableBody>
            <S.ListTableRow>
                <S.ListTableContentCell colSpan={columns.length} sx={{ p: 0.5, border: 'none' }}>
                    <TreeListSkeleton />
                </S.ListTableContentCell>
            </S.ListTableRow>
        </S.ListTableBody>
    );
};
