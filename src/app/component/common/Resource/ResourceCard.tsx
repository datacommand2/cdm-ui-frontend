import { Card, CardContent, FormLabel, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface ResourceCardWrapperProps {
    type: 'protection' | 'recovery';
    children: ReactNode;
}
/**
 * 복구계획에서 사용하는 리소스 카드
 */
const ResourceCardWrapper = ({ type, children }: ResourceCardWrapperProps) => {
    return (
        <Card variant="outlined" sx={{ flex: 1 }}>
            <CardContent>
                <Typography variant="h6" className="muted-text" gutterBottom>
                    {type === 'protection' ? '보호대상' : '복구대상'}
                </Typography>
                {children}
            </CardContent>
        </Card>
    );
};

interface ContentWrapperProps {
    children: ReactNode;
}
const Wrapper = ({ children }: ContentWrapperProps) => {
    return <StyledContentWrapper>{children}</StyledContentWrapper>;
};

interface TitleProp {
    text: string | ReactNode;
}
const Title = ({ text }: TitleProp) => {
    if (typeof text === 'string') {
        return <StyledTitle>{text}</StyledTitle>;
    } else {
        return <>{text}</>;
    }
};

interface ContentProp {
    children: ReactNode;
}
const Content = ({ children }: ContentProp) => {
    return <>{children}</>;
};

export const ResourceCard = Object.assign(ResourceCardWrapper, {
    Wrapper,
    Title,
    Content,
});

const StyledTitle = styled(FormLabel)`
    font-weight: 700;
    padding-bottom: 5px;
`;

const StyledContentWrapper = styled.div`
    /* display: flex;
    align-items: center;
    justify-content: space-between; */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 1rem;

    /* ${({ theme }) => theme.breakpoints.down.sm} {
        flex-direction: column;
        align-items: flex-start;
    } */
`;
