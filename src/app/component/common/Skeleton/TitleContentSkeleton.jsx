import { Box, Skeleton } from '@mui/material';
import React from 'react';

const TitleContentSkeleton = ({ titleHeight = 'auto', contentHeight = 200 }) => {
    return (
        <Box sx={{ padding: '1rem' }}>
            <Skeleton
                height={titleHeight}
                width="100%"
                variant="rounded"
                animation="wave"
                sx={{ marginBottom: '0.5em' }}
            />
            <Skeleton
                height={contentHeight}
                width="100%"
                variant="rounded"
                animation="wave"
                sx={{ marginBottom: '0.5em' }}
            />
        </Box>
    );
};

export default TitleContentSkeleton;
