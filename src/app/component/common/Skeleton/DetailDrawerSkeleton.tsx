import { Box, Skeleton } from '@mui/material';

/**
 * DetailDrawer Skeleton
 */
const DetailDrawerSkeleton = ({ contentHeight = 200 }) => {
    return (
        <Box sx={{ padding: '1rem' }}>
            <Skeleton width="60%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
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

export default DetailDrawerSkeleton;
