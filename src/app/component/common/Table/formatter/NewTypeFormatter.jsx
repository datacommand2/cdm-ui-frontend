import { Typography } from '@mui/material';
import React from 'react';

/**
 * type_code 포맷터
 */
const NewTypeFormatter = ({ data }) => {
    // data => type_code
    let typeCode = '';
    if (data) {
        typeCode = data.split('.');
    } else {
        typeCode = '-';
    }
    return <Typography>{typeCode[typeCode.length - 1].toUpperCase()}</Typography>;
};

export default NewTypeFormatter;
