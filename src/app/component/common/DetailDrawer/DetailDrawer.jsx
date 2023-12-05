import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { CloseDrawerButton } from '../layout/Drawers';

/**
 * Detail 정보를 보여줄 수 있는 컴포넌트
 * 합성 컴포넌트로 구현
 */
const Wrapper = ({ children }) => {
    return <Box sx={{ padding: '1rem' }}>{children}</Box>;
};

const Title = ({ variant = 'h6', text = '', style = {}, isCloseButton = true }) => {
    return (
        <StyledBox>
            <DetailTitle variant={variant} sx={style}>
                {text}
            </DetailTitle>
            {isCloseButton && <CloseDrawerButton />}
        </StyledBox>
    );
};

const ContentWrapper = ({ children }) => {
    const theme = useTheme();
    return <Row sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>{children}</Row>;
};

const ContentHeader = ({ text }) => {
    return <ContentHeaderText>{text}</ContentHeaderText>;
};

const ContentTitle = ({ text }) => {
    return <ContentTitleText>{text}</ContentTitleText>;
};

const ContentTitleDiv = ({ children }) => {
    return <ContentTitleDIV>{children}</ContentTitleDIV>;
};

const ContentBody = ({ children }) => {
    return <ContentBodyText>{children}</ContentBodyText>;
};
const ContentBodyDiv = ({ children }) => {
    return <ContentBodyDIV>{children}</ContentBodyDIV>;
};

export const renderDetail = (title, value) => {
    return (
        <DetailDrawer.ContentWrapper key={title}>
            <DetailDrawer.ContentTitle text={title} />
            <DetailDrawer.ContentBody>{value}</DetailDrawer.ContentBody>
        </DetailDrawer.ContentWrapper>
    );
};

export const DetailDrawer = Object.assign(Wrapper, {
    Title,
    ContentWrapper,
    ContentTitle,
    ContentTitleDiv,
    ContentBody,
    ContentBodyDiv,
    ContentHeader,
});

const StyledBox = styled(Box)`
    display: flex;
    justify-content: space-between;
`;
const DetailTitle = styled(Typography).attrs({ variant: 'h5' })`
    font-weight: 700;
`;

const Row = styled(Box)`
    padding: 0.3rem;
    display: flex;
`;

const ContentHeaderText = styled(Typography).attrs({ variant: 'h6' })`
    font-weight: 700;
    padding-bottom: 1rem;
    padding-top: 2rem;
`;

const ContentTitleText = styled(Typography)`
    display: flex;
    align-items: center;
    font-weight: 700;
    flex: 30%;
`;

const ContentTitleDIV = styled.div`
    flex: 30%;
`;

const ContentBodyText = styled(Typography)`
    flex: 70%;
`;

const ContentBodyDIV = styled.div`
    flex: 70%;
`;
