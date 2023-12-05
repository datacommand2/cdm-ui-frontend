import { CardHeader, Divider, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

interface CustomCardHeaderProps {
    title: string;
    subheader?: React.ReactNode; // optional
    headerAction?: React.ReactNode; // optional
}

/**
 * cardheader custom 컴포넌트
 */
const CustomCardHeader = ({ title, subheader, headerAction }: CustomCardHeaderProps) => {
    return (
        <>
            <StyledHeader
                title={
                    <TitleWrapper>
                        <Typography variant="h6" sx={{ fontWeight: '700', marginRight: '10px', whiteSpace: 'nowrap' }}>
                            {title}
                        </Typography>
                        {subheader}
                    </TitleWrapper>
                }
                subheader={headerAction ? <TitleWrapper>{headerAction}</TitleWrapper> : null}
            />
            <Divider />
        </>
    );
};

export default CustomCardHeader;

const StyledHeader = styled(CardHeader)`
    & > .MuiCardHeader-content {
        row-gap: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
    }
`;

const TitleWrapper = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
`;
