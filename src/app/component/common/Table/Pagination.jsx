import React from 'react';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Select from 'react-select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material';

import * as S from './Pagination.style';

/**
 * 페이지네이션 컴포넌트
 */
const Pagination = ({
    onChangePage,
    table,
    jumpPage,
    setJumpPage,
    onChangeLimit,
    isFetching,
    isLoading,
    treeID,
    type,
}) => {
    const muiTheme = useTheme();
    const mode = muiTheme.palette.mode;
    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            if (jumpPage > 0) {
                if (
                    Number(e.target.value) <= table.getPageCount() &&
                    e.target.value !== '' &&
                    table.getState().page !== e.target.value
                ) {
                    onChangePage(table.getState().limit * (jumpPage - 1));
                }
            }
        }
    };

    const pageOptions = () => {
        if (type === 'event-list') {
            return [
                { value: 10, label: 10 },
                { value: 20, label: 20 },
                { value: 50, label: 50 },
                { value: 100, label: 100 },
            ];
        } else {
            return [
                { value: 5, label: 5 },
                { value: 10, label: 10 },
                { value: 20, label: 20 },
            ];
        }
    };

    return (
        <S.PaginationWrapper>
            <S.PaginationPageSizeGroup>
                <Select
                    isDisabled={isLoading}
                    menuPlacement="top"
                    name="limit-select"
                    theme={theme => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary: mode === 'light' ? muiTheme.palette.primary.light : muiTheme.palette.primary.dark,
                        },
                    })}
                    className={mode === 'light' ? 'light-react-select' : 'dark-react-select'}
                    classNamePrefix={mode === 'light' ? 'light-react-select' : 'dark-react-select'}
                    onChange={e => onChangeLimit(e.value)}
                    options={pageOptions()}
                    defaultValue={type === 'event-list' ? pageOptions()[0] : pageOptions()[1]}
                    isSearchable={false}
                />
                <Typography>
                    {`${table.getState().offset + 1} - ${
                        table.getState().offset + table.getState().limit > table.getState().totalItems
                            ? table.getState().totalItems
                            : table.getState().offset + table.getState().limit
                    }`}
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
                    value={jumpPage}
                    onChange={e => {
                        if (Number(e.target.value) <= table.getPageCount() && e.target.value >= 0) {
                            setJumpPage(e.target.value);
                        }
                    }}
                    onBlur={e => {
                        if (jumpPage > 0) {
                            if (
                                Number(e.target.value) <= table.getPageCount() &&
                                e.target.value !== '' &&
                                table.getState().page !== e.target.value
                            ) {
                                onChangePage(table.getState().limit * (jumpPage - 1));
                            }
                        }
                    }}
                    min={1}
                    max={Number(table.getPageCount())}
                    onKeyPress={handleKeyPress}
                />
                <S.PaginationButtonGroup>
                    <Stack spacing={2}>
                        <S.CustomPagination
                            disabled={isLoading}
                            count={Number(table.getPageCount())}
                            size="medium"
                            onChange={(event, value) => {
                                onChangePage((value - 1) * table.getState().limit);
                                setJumpPage(Number(value));
                            }}
                            page={Number(table.getState().page)}
                            color="primary"
                            variant="outlined"
                        />
                    </Stack>
                </S.PaginationButtonGroup>
            </S.PaginationMovePageGroup>
        </S.PaginationWrapper>
    );
};

export default Pagination;
