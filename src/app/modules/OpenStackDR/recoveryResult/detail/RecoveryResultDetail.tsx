import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, CardContent, Tab, Typography } from '@mui/material';
import TabContext from '@mui/lab/TabContext/TabContext';
import TabList from '@mui/lab/TabList/TabList';
import styled from 'styled-components';
import TabPanel from '@mui/lab/TabPanel/TabPanel';
import { useTranslation } from 'react-i18next';
import { useResetRecoilState } from 'recoil';

import SummaryTab from './SummaryTab';
import InstanceTab from './InstanceTab';
import VolumeTab from './VolumeTab';
import ResultWorkFlowTab from './ResultWorkFlowTab';
import TrainingHistoryTab from './TrainingHistoryTab';
import { _getRecoveryReportDetail } from '../../../../../api/dr/recoveryResult';
import { recoveryResultKeys } from '../../../../../libs/utils/queryKeys';
import CustomCardHeader from '../../../../component/common/CardHeader/CustomCardHeader';
import HeaderChip from '../../../../component/common/Chip/HeaderChip';
import { findLastWord } from '../../../../../libs/utils/commonFunction';
import { edgesAtom, nodesAtom } from '../../../../../recoil/atom/OpenShiftRecoveryPlanAtom';

/**
 * 복구 결과 페이지
 * 1. 복구 결과 리스트 중 하나의 row 데이터를 토대로 구현
 * 2. components 폴더에서 각각의 tab을 구성하는 component를 받아와 페이지를 구현
 */
const RecoveryResultDetail = () => {
    const resetNodes = useResetRecoilState(nodesAtom);
    const resetEdges = useResetRecoilState(edgesAtom);
    useEffect(() => {
        return () => {
            resetNodes();
            resetEdges();
        };
    }, [resetEdges, resetNodes]);

    const { t } = useTranslation();
    const [value, setValue] = React.useState('1');

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };
    const location = useLocation();

    const groupID = location?.state?.groupId;
    const resultID = location?.state?.resultId;

    // 복구결과 상세정보를 불러오는 함수
    const { data: recoveryResultDetail } = useQuery(
        recoveryResultKeys.detail(groupID, resultID),
        () => _getRecoveryReportDetail(groupID, resultID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.report;
                }
            },
            suspense: true,
        },
    );

    return (
        <>
            <CustomCardHeader
                title={
                    findLastWord(recoveryResultDetail?.recovery_type_code) === 'migration'
                        ? t('DR.DISASTER_RECOVERY_RESULT')
                        : t('DR.SIMULATION_TRAINING_RESULTS')
                }
                subheader={
                    <HeaderChip label={recoveryResultDetail?.result_code} color={recoveryResultDetail?.result_code} />
                }
            />
            <CardContent>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="result-tabs">
                            <Tab label={<Typography>{t('DR.SUMMARY')}</Typography>} value="1" />
                            <Tab label={<Typography>{t('DR.WORK_FLOW_RESULT')}</Typography>} value="2" />
                            <Tab label={<Typography>{t('DR.INSTANCE')}</Typography>} value="3" />
                            <Tab label={<Typography>{t('DR.VOLUME')}</Typography>} value="4" />
                            <Tab label={<Typography>{t('DR.WORK_HISTORY')}</Typography>} value="5" />
                        </TabList>
                    </Box>
                    <StyledPanel value="1">
                        <SummaryTab resultDetail={recoveryResultDetail} />
                    </StyledPanel>
                    <StyledPanel value="2">
                        <ResultWorkFlowTab resultDetail={recoveryResultDetail} />
                    </StyledPanel>
                    <StyledPanel value="3">
                        <InstanceTab instances={recoveryResultDetail?.instances} />
                    </StyledPanel>
                    <StyledPanel value="4">
                        <VolumeTab volumes={recoveryResultDetail?.volumes} />
                    </StyledPanel>
                    <StyledPanel value="5">
                        <TrainingHistoryTab taskLogs={recoveryResultDetail?.task_logs} />
                    </StyledPanel>
                </TabContext>
            </CardContent>
        </>
    );
};

export default RecoveryResultDetail;

const StyledPanel = styled(TabPanel)`
    display: flex;
    flex-direction: column;
    height: 100%;
`;
