import { Accordion, AccordionSummary, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface PlanPanelProps {
    children: any;
}
//
const Wrapper = ({ children }: PlanPanelProps) => {
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <StyledAccordian onChange={handleChange('panel1')} expanded={expanded === 'panel1'} variant="outlined">
            {children}
        </StyledAccordian>
    );
};

interface TitleProps {
    variant?: string;
    text: string | ReactNode;
    style?: any;
}

const Title = ({ text = '', style = {} }: TitleProps) => {
    return (
        <StyledSummary expandIcon={<ExpandMoreIcon />}>
            <DetailTitle variant="h6" style={style}>
                {text}
            </DetailTitle>
        </StyledSummary>
    );
};

export const PlanPanel = Object.assign(Wrapper, {
    Title,
});

const StyledAccordian = styled(Accordion)`
    margin-bottom: 0.5rem;
`;

const DetailTitle = styled(Typography).attrs({ variant: 'h6' })`
    padding-bottom: 1rem;
    font-weight: 700;
`;

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
