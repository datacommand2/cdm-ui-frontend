import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';
import { formatUnixTimestamp } from '../../../../../libs/utils/commonFunction';

/**
 * 날짜 변환 컴포넌트
 */
const NewDateFormatter = ({ type, data }) => {
    let date = dayjs().unix();
    if (!type) {
        date = data;
    } else {
        date = data?.row?.original[type];
    }

    if (date) {
        return <Typography>{formatUnixTimestamp(date)}</Typography>;
    } else {
        return <div>-</div>;
    }
};

export default NewDateFormatter;
