import { Alert, Typography } from '@mui/material';
import React from 'react';

const DialogAlert = ({ type, message }) => {
    let customType = 'info';
    if (type === 'prepare') {
        customType = 'info';
    } else if (type === 'critical' || type === 'emergency') {
        customType = 'error';
    } else if (type === 'warning' || type === 'stopped' || type === 'mirroring') {
        customType = 'warning';
    }
    return (
        <Alert severity={customType} sx={{ marginBottom: '1rem' }}>
            <Typography>{message}</Typography>
        </Alert>
    );
};

export default DialogAlert;
