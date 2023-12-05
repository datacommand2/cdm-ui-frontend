import { Typography } from '@mui/material';
import React from 'react';

const JobTypeFormatter = ({ data }) => {
    let typeCode = '';
    if (data) {
        typeCode = data.split('.');
    } else {
        typeCode = '-';
    }

    const type = typeCode !== '-' ? typeCode[typeCode.length - 1] : null;

    if (type === 'simulation' || type === 'test') {
        return <Typography>모의훈련</Typography>;
    } else if (type === 'migration' || type === 'recovery') {
        return <Typography>재해복구</Typography>;
    } else if (type === undefined || type === null) {
        return <Typography>-</Typography>;
    } else return <Typography>-</Typography>;
};
export default JobTypeFormatter;
