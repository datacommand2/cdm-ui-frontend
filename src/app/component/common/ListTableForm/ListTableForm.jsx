import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { Box, Button, IconButton, InputAdornment, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import Select from 'react-select';
/**
 * 테이블 목록에 대한 필터, 검색, 새로고침 버튼 컴포넌트
 */
const ListTableFormMain = ({ inputSubmit, children }) => {
    return (
        <form onSubmit={inputSubmit}>
            <FilterWrapper>{children}</FilterWrapper>
        </form>
    );
};

const Filter = ({ onChange, name, disabled, defaultValue, className, options }) => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    return (
        <Select
            className={className}
            name={name}
            isDisabled={disabled}
            onChange={onChange}
            options={options}
            defaultValue={defaultValue}
            isSearchable={false}
            classNamePrefix={`${mode}-react-select`}
            menuPortalTarget={document.querySelector('body')}
            menuPlacement="bottom"
        />
    );
};

const Search = ({ placeholder, value, onChange, disabled = false }) => {
    return (
        <Box sx={{ display: 'flex', marginRight: '8px' }}>
            <TextField
                placeholder={placeholder}
                aria-label={placeholder}
                aria-describedby="basic-addon2"
                type="text"
                onChange={onChange}
                value={value}
                maxLength={255}
                disabled={disabled}
                size="small"
                sx={{ '& > .MuiInputBase-root': { height: '100%' } }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton type="submit" disabled={disabled}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};

const RefreshButton = ({ refreshFn, isLoading }) => {
    return (
        <Tooltip title={<Typography>새로고침</Typography>}>
            <div style={{ display: 'flex' }}>
                <RefreshBtn disabled={isLoading} onClick={refreshFn}>
                    <RefreshOutlinedIcon />
                </RefreshBtn>
            </div>
        </Tooltip>
    );
};

export const ListTableForm = Object.assign(ListTableFormMain, {
    Filter,
    Search,
    RefreshButton,
});
export default ListTableForm;

const RefreshBtn = styled(Button)`
    box-shadow: none;
`;

const FilterWrapper = styled(Box)`
    display: flex;
    justify-content: end;
`;
