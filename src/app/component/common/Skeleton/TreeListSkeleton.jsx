import { Box, Skeleton } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

/**
 * 복구계획, 작업과 같은 Sidebar Skeleton
 */
const TreeListSkeleton = () => {
    return (
        <Wrapper>
            <Skeleton width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
            <Skeleton width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
            <Skeleton width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
            <Skeleton width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
        </Wrapper>
    );
};

export default TreeListSkeleton;

const Wrapper = styled(Box)`
    display: flex;
    flex-direction: column;
`;
