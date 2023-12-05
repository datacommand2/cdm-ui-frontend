import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * Detail 정보를 보여줄 수 있는 컴포넌트
 * 합성 컴포넌트로 구현
 */
const Wrapper = ({ children }) => {
    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = panel => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <Accordion onChange={handleChange('panel1')} expanded={expanded === 'panel1'} variant="outlined">
            {children}
        </Accordion>
    );
};

const Title = ({ variant = 'h6', text, style = {} }) => {
    return (
        <StyledSummary expandIcon={<ExpandMoreIcon />}>
            <DetailTitle variant={variant} style={style}>
                {text}
            </DetailTitle>
        </StyledSummary>
    );
};

const Body = ({ children }) => {
    return <AccordionDetails>{children}</AccordionDetails>;
};

const ContentWrapper = ({ children }) => {
    return (
        <>
            <Row>{children}</Row>
            <Divider />
        </>
    );
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

const ContentCell = ({ children }) => {
    return <ContentCellWrapper>{children}</ContentCellWrapper>;
};

export const Detail = Object.assign(Wrapper, {
    Title,
    Body,
    ContentWrapper,
    ContentTitle,
    ContentBody,
    ContentBodyDiv,
    ContentHeader,
    ContentCell,
    ContentTitleDiv,
});

const StyledSummary = styled(AccordionSummary)`
    flex-direction: row-reverse;

    .MuiAccordionSummary-content {
        margin: 0;
    }

    .MuiAccordionSummary-content h6 {
        padding: 0;
        padding-left: 1rem;
    }

    .Mui-expanded {
        svg {
            transform: rotate(90deg);
        }
    }

    .MuiAccordionSummary-expandIconWrapper {
        transform: rotate(270deg);
    }
`;

const DetailTitle = styled(Typography).attrs({ variant: 'h6' })`
    padding-bottom: 1rem;
    font-weight: 700;
`;

const Row = styled(Box)`
    padding: 0.3rem;
    display: flex;

    ${({ theme }) => theme.breakpoints.down.md} {
        flex-direction: column;
    }
`;

const ContentHeaderText = styled(Typography).attrs({ variant: 'h6' })`
    font-weight: 700;
    padding-bottom: 1rem;
    padding-top: 2rem;
`;

const ContentTitleText = styled(Typography)`
    font-weight: 700;
    flex: 30%;
`;
const ContentTitleDIV = styled.div`
    flex: 30%;
`;

const ContentBodyDIV = styled.div`
    flex: 70%;
`;
const ContentBodyText = styled(Typography)`
    flex: 70%;
`;

const ContentCellWrapper = styled(Box)`
    display: flex;
    flex: 1;
    gap: 0.5rem;
    padding: 0.5rem;
`;
