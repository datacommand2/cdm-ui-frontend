import React from 'react';
import styled from 'styled-components';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

const ListToolBarWrapper = ({ children }) => {
    return <Wrapper>{children}</Wrapper>;
};

const ListToolBar = ({ children }) => {
    return <StyleListToolBarWrapper>{children}</StyleListToolBarWrapper>;
};

const ListButtonWrapper = ({ children }) => {
    return <ButtonWrapper>{children}</ButtonWrapper>;
};

const ListSearchBarWrapper = ({ children }) => {
    return <SearchBarWrapper>{children}</SearchBarWrapper>;
};
const ListEventWrapper = ({ children }) => {
    return <EventWrapper>{children}</EventWrapper>;
};

const Wrapper = styled.div`
    width: 100%;
    margin-left: auto;
    margin-right: auto;
`;

const StyleListToolBarWrapper = styled(Grid2).attrs({ container: true })`
    padding: 0 25px;
`;

const ButtonWrapper = styled(Grid2).attrs({ sm: 4, xs: 12 })`
    display: flex;
    gap: 5px;
`;
const SearchBarWrapper = styled(Grid2).attrs({ sm: 8, xs: 12 })`
    display: flex;
    justify-content: end;
`;
const EventWrapper = styled(Grid2).attrs({ sm: 12, xs: 12 })`
    display: flex;
    justify-content: end;
    gap: 5px;
    flex-wrap: wrap;
`;

export { ListToolBarWrapper, ListToolBar, ListButtonWrapper, ListSearchBarWrapper, ListEventWrapper };
