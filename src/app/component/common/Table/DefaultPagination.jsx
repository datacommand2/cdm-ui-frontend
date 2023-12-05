import { CircularProgress, OutlinedInput, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import Select from 'react-select';

import * as S from './Pagination.style';

const pageOption = [
    { value: 5, label: 5 },
    { value: 10, label: 10 },
    { value: 20, label: 20 },
];

const DefaultPagination = ({ table, isLoading, isFetching, treeID }) => {
    const [currentPage, setCurrentPage] = useState(table.getState().pagination.pageIndex + 1);
    const muiTheme = useTheme();
    const mode = muiTheme.palette.mode;

    return (
        <S.PaginationWrapper>
            <S.PaginationPageSizeGroup>
                <Select
                    isDisabled={isLoading || isFetching}
                    menuPlacement="top"
                    name="limit-select"
                    theme={theme => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary: muiTheme.palette.primary[mode],
                        },
                    })}
                    className={`${mode}-react-select`}
                    classNamePrefix={`${mode}-react-select`}
                    onChange={e => {
                        table.setPageSize(Number(e.value));
                    }}
                    options={pageOption}
                    defaultValue={pageOption[1]}
                    isSearchable={false}
                />
                <Typography>
                    {table.getState().pagination.pageIndex + 1} - {table.getPageCount()}
                </Typography>
                {(isFetching || isLoading) && (
                    <S.LoadingSpinner>
                        {treeID ? (
                            <>
                                <Typography>Loading...</Typography>
                                <CircularProgress size={20} />
                            </>
                        ) : null}
                    </S.LoadingSpinner>
                )}
            </S.PaginationPageSizeGroup>
            <S.PaginationMovePageGroup>
                <OutlinedInput
                    disabled={isLoading}
                    type="number"
                    size="small"
                    value={currentPage}
                    onChange={e => {
                        if (Number(e.target.value) < 1 || Number(e.target.value) > Number(table.getPageCount())) {
                            return;
                        }
                        setCurrentPage(e.target.value);
                    }}
                    onBlur={e => {
                        if (Number(e.target.value) < 1 || Number(e.target.value) > Number(table.getPageCount())) {
                            return;
                        } else {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }
                    }}
                    min={1}
                    max={Number(table.getPageCount())}
                />
                <S.PaginationButtonGroup>
                    <Stack spacing={2}>
                        <S.CustomPagination
                            disabled={isLoading}
                            count={Number(table.getPageCount())}
                            size="medium"
                            color="primary"
                            variant="outlined"
                            onChange={(e, page) => {
                                table.setPageIndex(page - 1);
                            }}
                            page={table.getState().pagination.pageIndex + 1}
                        />
                    </Stack>
                </S.PaginationButtonGroup>
            </S.PaginationMovePageGroup>
        </S.PaginationWrapper>
    );
};

export default DefaultPagination;
