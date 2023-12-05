import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';

import StatusInfo from './StatusInfo';

const JobStatusBar = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const mode = theme.palette.mode;

    return (
        <StausContainer className={`${mode}-job-status-wrapper`}>
            <StatusInfo type="preparing" text={t('BADGE.PREPARING')} />
            <StatusInfo type="completed" text={t('DR.RECOVERY_COMPLETE')} />
            <StatusInfo type="completed" circle="primary" text={t('DR.JOB_RUNNING')} />
            <StatusInfo type="completed" circle="success" text={t('DR.SUCCESS')} />
            <StatusInfo type="fail" text={t('DR.FAIL')} />
        </StausContainer>
    );
};

export default JobStatusBar;

const StausContainer = styled.div``;
