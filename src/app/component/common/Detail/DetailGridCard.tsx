import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Divider, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React from 'react';
import styled from 'styled-components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface DetailGridCardProps {
    labels: string[];
    valueList: any[];
    title: string | undefined;
    dataList: any[] | undefined;
}

// 함수 정의
function getObjectProperty(obj: any, keyString: string) {
    // 키를 '.'을 기준으로 분리
    const keys = keyString.split('.');

    // 객체의 속성을 순회하면서 값을 가져옴
    let result = obj;
    for (const key of keys) {
        if (result?.[key] === undefined) {
            return '';
        }
        result = result[key];
    }

    return result;
}

/**
 * DetailDrawer에 들어가는 Detail 정보를 Card로 보여준다.
 */
const DetailGridCard = ({ labels, valueList, title, dataList }: DetailGridCardProps) => {
    return (
        <>
            <StyledAccordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Title>{title}</Title>
                </AccordionSummary>
                <AccordionDetails>
                    {dataList &&
                        dataList.length > 0 &&
                        dataList.map((data, idx) => {
                            return (
                                <StyledCard variant="outlined" key={idx}>
                                    <CardContent>
                                        <GridWrapper>
                                            {labels.map(label => {
                                                return (
                                                    <Grid key={label} breakpoint={labels.length}>
                                                        <Typography>{label}</Typography>
                                                    </Grid>
                                                );
                                            })}
                                        </GridWrapper>
                                        <GridWrapper>
                                            {valueList.map((value, idx) => {
                                                return (
                                                    <Grid key={idx} breakpoint={labels.length}>
                                                        <Typography variant="h6">
                                                            {getObjectProperty(data, value)}
                                                        </Typography>
                                                    </Grid>
                                                );
                                            })}
                                        </GridWrapper>
                                    </CardContent>
                                </StyledCard>
                            );
                        })}
                </AccordionDetails>
            </StyledAccordion>
            <Divider />
        </>
    );
};

export default DetailGridCard;

const StyledAccordion = styled(Accordion).attrs({ elevation: 0, defaultExpanded: true })`
    &::before {
        opacity: 0;
    }
`;

const GridWrapper = styled(Grid2).attrs({ container: true, spacing: 2 })`
    display: flex;
`;

const Grid = styled(Grid2)<{ breakpoint?: number }>`
    display: flex;
    overflow-wrap: anywhere;
    flex-basis: ${({ breakpoint }) => (breakpoint ? `calc(${(breakpoint / 12) * 100}%)` : 'auto')};
    flex-grow: 1;
`;

const StyledCard = styled(Card)`
    margin-bottom: 10px;
`;

const Title = styled(Typography).attrs({ variant: 'h6' })`
    font-weight: 700;
    padding-bottom: 1rem;
    padding-top: 2rem;
`;
