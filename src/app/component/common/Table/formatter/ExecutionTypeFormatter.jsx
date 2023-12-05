import { Typography } from '@mui/material';

const ExecutionTypeFormatter = ({ data }) => {
    let executionType = '';

    if (data) {
        if (data === 'schedule.type.specified') {
            executionType = '특정 일시';
        } else if (data === 'schedule.type.daily') {
            executionType = '일간 스케쥴';
        } else if (data === 'schedule.type.weekly') {
            executionType = '주간 스케쥴';
        } else if (data === 'schedule.type.week-of-monthly') {
            executionType = '월간(요일) 스케쥴';
        } else if (data === 'schedule.type.hourly') {
            executionType = '시간 스케쥴';
        } else {
            executionType = '월간(일) 스케쥴';
        }
    } else {
        executionType = '즉시';
    }

    return <Typography>{executionType}</Typography>;
};

export default ExecutionTypeFormatter;
