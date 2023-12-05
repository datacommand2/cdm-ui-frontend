import { Skeleton } from '@mui/material';
import React from 'react';

interface DefaultSkeletonProps {
    height?: number;
}
/**
 * 기본적인 Skeleton 1개
 */
const DefaultSkeleton = ({ height }: DefaultSkeletonProps) => {
    return <Skeleton height={height} width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />;
};

export default DefaultSkeleton;
