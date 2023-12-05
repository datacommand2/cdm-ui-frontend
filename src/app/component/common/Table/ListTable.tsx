import React, { useState, Fragment } from 'react';
import {
    getPaginationRowModel,
    useReactTable,
    getCoreRowModel,
    flexRender,
    getExpandedRowModel,
} from '@tanstack/react-table';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import * as S from './ListTable.style';
import DefaultPagination from './DefaultPagination';
import Pagination from './Pagination';

interface ListTableProps {
    getRowCanExpand?: any;
    columns: any;
    data: any;
    pagination?: any;
    limit?: number;
    offset?: number;
    onChangeLimit?: (value: number) => void;
    onChangePage?: (value: number) => void;
    isFetching?: boolean;
    statusCode?: number | undefined;
    isLoading?: boolean;
    treeID?: any;
    subContent?: any;
    type: string;
    defaultPagination?: boolean;
    onClick?: any;
}

/**
 * 데이터 목록 테이블을 나타내는 컴포넌트
 * @param onClick 함수를 전달해주어야 Drawer 토글이 가능하다
 */
const ListTable = ({
    getRowCanExpand = () => true,
    columns,
    data = [],
    pagination,
    limit = 5,
    offset = 0,
    onChangeLimit,
    onChangePage,
    isFetching,
    statusCode = 200,
    isLoading,
    treeID = 1,
    subContent,
    type,
    defaultPagination = false,
    onClick = () => {},
}: ListTableProps) => {
    // useReactTable로 테이블 구조 정의
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        pageCount: defaultPagination ? undefined : pagination.total_page ?? 0,
        state: defaultPagination
            ? undefined
            : ({
                  totalItems: pagination.total_items ?? 0,
                  page: pagination?.page ?? 0,
                  limit,
                  offset,
              } as any),
        manualPagination: defaultPagination ? undefined : true,
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand,
    });

    const [jumpPage, setJumpPage] = useState(pagination?.page ?? 1);

    return (
        <S.ListWrapper>
            {isLoading && treeID ? (
                SkeletonTable()
            ) : (
                <>
                    <S.ListTableContainer>
                        <S.ListTable>
                            <S.ListTableHead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <S.ListTableRow key={headerGroup.id}>
                                        {headerGroup.headers.map(header => {
                                            return (
                                                <S.ListTableHeaderCell id={header.id} key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column.columnDef.header,
                                                              header.getContext(),
                                                          )}
                                                </S.ListTableHeaderCell>
                                            );
                                        })}
                                    </S.ListTableRow>
                                ))}
                            </S.ListTableHead>

                            {treeID === null ? (
                                NotSelectedTable({ columns, type })
                            ) : statusCode === 204 || data.length === 0 ? (
                                TableNoContent({ columns })
                            ) : (
                                <S.ListTableBody>
                                    {table.getRowModel().rows.map((row, idx) => {
                                        return (
                                            <Fragment key={row.id + idx}>
                                                <S.ListTableRow key={row.id}>
                                                    {row.getVisibleCells().map(cell => {
                                                        return (
                                                            <S.ListTableContentCell
                                                                onClick={() => {
                                                                    if (cell.column.id !== 'actions') {
                                                                        onClick(row.original);
                                                                    }
                                                                }}
                                                                key={cell.id}
                                                            >
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext(),
                                                                )}
                                                            </S.ListTableContentCell>
                                                        );
                                                    })}
                                                </S.ListTableRow>
                                                {row.getIsExpanded() && (
                                                    <S.ListTableSubRow key={`expand-${row.id}`}>
                                                        {/* 2nd row is a custom 1 cell row */}
                                                        <S.ListTableSubContentCell
                                                            colSpan={row.getVisibleCells().length}
                                                        >
                                                            {subContent({ row })}
                                                        </S.ListTableSubContentCell>
                                                    </S.ListTableSubRow>
                                                )}
                                            </Fragment>
                                        );
                                    })}
                                </S.ListTableBody>
                            )}
                        </S.ListTable>
                        {/* <Divider /> */}
                    </S.ListTableContainer>
                </>
            )}
            {defaultPagination ? (
                <DefaultPagination table={table} isLoading={isLoading} treeID={treeID} isFetching={isFetching} />
            ) : (
                <Pagination
                    onChangePage={onChangePage}
                    table={table}
                    jumpPage={jumpPage}
                    setJumpPage={setJumpPage}
                    onChangeLimit={onChangeLimit}
                    isFetching={isFetching}
                    isLoading={isLoading}
                    treeID={treeID}
                    type={type}
                />
            )}
        </S.ListWrapper>
    );
};

export default ListTable;

ListTable.defaultProps = {
    subContent: () => {},
};
const SkeletonTable = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Skeleton width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
            <Skeleton width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
            <Skeleton width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
            <Skeleton width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
            <Skeleton width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
        </Box>
    );
};

interface TableNoContentProps {
    columns: any;
}
const TableNoContent = ({ columns }: TableNoContentProps) => {
    return (
        <S.ListTableBody>
            <S.ListTableRow>
                <S.ListTableContentCell colSpan={columns.length} sx={{ p: 0.5, border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography>데이터가 존재하지 않습니다.</Typography>
                    </div>
                </S.ListTableContentCell>
            </S.ListTableRow>
        </S.ListTableBody>
    );
};

interface NotSelectedTableProps {
    columns: any;
    type: any;
}
const NotSelectedTable = ({ columns, type }: NotSelectedTableProps) => {
    return (
        <S.ListTableBody>
            <S.ListTableRow>
                <S.ListTableContentCell colSpan={columns.length} sx={{ p: 0.5, border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {type === 'protection-group' ? (
                            <Typography>클러스터를 선택해주세요.</Typography>
                        ) : (
                            <Typography>보호그룹을 선택해주세요.</Typography>
                        )}
                    </div>
                </S.ListTableContentCell>
            </S.ListTableRow>
        </S.ListTableBody>
    );
};
