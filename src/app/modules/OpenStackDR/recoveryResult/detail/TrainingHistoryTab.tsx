import React from 'react';
import styled from 'styled-components';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import dayjs from 'dayjs';

interface TrainingHistoryTabProps {
    taskLogs: {
        code: string;
        contents: string;
        log_dt: number;
        log_seq: number;
    }[];
}

/**
 * 복구결과 페이지의 작업내역 탭
 */
const TrainingHistoryTab = ({ taskLogs }: TrainingHistoryTabProps) => {
    const theme = useTheme();
    // const trainingReport = useSelector(selector.report);
    const sortedTaskLogs = taskLogs
        ? taskLogs.slice(0, taskLogs.length).sort(function (a, b) {
              if (a.log_dt > b.log_dt) return 1;
              if (a.log_dt < b.log_dt) return -1;
              return 0;
          })
        : undefined;

    return (
        <Card variant="outlined">
            <CardContent>
                <Wrapper sx={{ border: `1px solid ${theme.palette.divider}` }}>
                    {sortedTaskLogs ? (
                        sortedTaskLogs.map(item => (
                            <TaskList key={item.log_dt + item.log_seq} date={item.log_dt} content={item.code} />
                        ))
                    ) : (
                        <div> - </div>
                    )}
                </Wrapper>
            </CardContent>
        </Card>
    );
};

export default TrainingHistoryTab;

const TaskList = ({ date, content }: { date: number; content: string }) => {
    return (
        <TaskGrid>
            <Date>
                <Typography sx={{ fontWeight: 700 }}>{dayjs.unix(date).format('YYYY-MM-DD-HH:mm:ss')}</Typography>
            </Date>
            <Content>
                <Typography>{content}</Typography>
            </Content>
        </TaskGrid>
    );
};

const TaskGrid = styled(Grid2).attrs({ container: true, columnSpacing: 3, rowSpacing: 3 })`
    display: flex;
    margin-bottom: 2px;
`;
const Date = styled(Grid2).attrs({ xs: 2 })``;
const Content = styled(Grid2).attrs({ xs: 10 })``;

const Wrapper = styled(Box)`
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 2rem;
`;
