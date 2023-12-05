import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material';

import StatusInfo from './StatusInfo';

const ResultStatusBar = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const { t } = useTranslation();
    return (
        <StausContainer className={`${mode}-job-status-wrapper`}>
            <StatusInfo type="completed" circle="success" text={t('DR.SUCCESS')} />
            <StatusInfo type="completed" circle="warn" text={t('BADGE.WARNING')} />
            <StatusInfo type="fail" text={t('DR.FAIL')} />
        </StausContainer>
    );
};

export default ResultStatusBar;

const StausContainer = styled.div``;
