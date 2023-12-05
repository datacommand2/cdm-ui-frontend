import { Box, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

type DialogTextProps = {
    title?: ReactNode | string;
    body?: ReactNode | null;
};

/**
 * Dialog 내부에 들어가는 body 컴포넌트
 */
const DialogText = ({ title = '', body }: DialogTextProps) => {
    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 400 }}>
                {title}
            </Typography>
            <Typography>{body}</Typography>
        </Box>
    );
};

export default DialogText;
