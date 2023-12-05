import { Button, Typography } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';

import { LoginUser } from '../../../../recoil/atom/LoginUser';

const ActionButton = ({
    buttonType,
    type = 'primary',
    onClick = () => {},
    disabled = false,
    size = 'lg',
    isLoading = false,
    buttonColor = 'primary',
}) => {
    const { t } = useTranslation();
    const authInfo = useRecoilValue(LoginUser);
    const role = authInfo?.roles?.[0]?.role ?? 'user';
    const location = useLocation();
    let display;
    if (location.pathname.split('/').includes('recovery-job')) {
        display = role !== 'admin' && role !== 'manager' && role !== 'operator' ? { display: 'none' } : undefined;
    } else {
        display = role !== 'admin' && role !== 'manager' ? { display: 'none' } : undefined;
    }

    if (buttonType === 'add') {
        return (
            <StyledButton size={size} style={display} type={type} onClick={onClick} disabled={disabled} color="primary">
                <Typography>{t('BUTTON.ADD')}</Typography>
            </StyledButton>
        );
    } else if (buttonType === 'apply') {
        return (
            <StyledButton size={size} style={display} type={type} onClick={onClick} disabled={disabled} color="primary">
                <Typography>적용</Typography>
            </StyledButton>
        );
    } else if (buttonType === 'edit') {
        return (
            <StyledButton size={size} style={display} type={type} onClick={onClick} disabled={disabled} color="primary">
                <Typography>{t('BUTTON.MODIFY')}</Typography>
            </StyledButton>
        );
    } else if (buttonType === 'delete') {
        return (
            <StyledButton size={size} style={display} type={type} onClick={onClick} disabled={disabled} color="error">
                <Typography>{t('BUTTON.DELETE')}</Typography>
            </StyledButton>
        );
    } else if (buttonType === 'prev') {
        return (
            <StyledButton color="success" size={size} type={type} onClick={onClick} disabled={disabled}>
                <Typography>{t('BUTTON.PREV')}</Typography>
            </StyledButton>
        );
    } else if (buttonType === 'logout') {
        return (
            <StyledButton color="error" size={size} type={type} onClick={onClick} disabled={disabled}>
                <Typography>{t('BUTTON.LOGOUT')}</Typography>
            </StyledButton>
        );
    } else if (buttonType === 'exit') {
        return (
            <StyledButton color="error" size={size} type={'button'} onClick={onClick} disabled={disabled}>
                <Typography>{t('BUTTON.EXIT')}</Typography>
            </StyledButton>
        );
    } else if (buttonType === 'connect') {
        return (
            <StyledButton color="primary" size={size} type={type} onClick={onClick} disabled={disabled}>
                <Typography>{t('BUTTON.CONNECT')}</Typography>
            </StyledButton>
        );
    } else if (buttonType === 'continue') {
        return (
            <StyledButton color="cancel" size={size} type={type} onClick={onClick} disabled={disabled}>
                <Typography>{t('BUTTON.CONTINUE')}</Typography>
            </StyledButton>
        );
    } else if (buttonType === 'close') {
        return (
            <StyledButton color="cancel" size={size} type={type} onClick={onClick} disabled={disabled}>
                <Typography>{t('BUTTON.CLOSE')}</Typography>
            </StyledButton>
        );
    } else if (buttonType === 'cancel') {
        return (
            <StyledButton color="cancel" size={size} type={type} onClick={onClick} disabled={disabled}>
                <Typography>{t('BUTTON.CANCEL')}</Typography>
            </StyledButton>
        );
    } else if (buttonType === 'next') {
        return (
            <StyledButton color="success" size={size} type={type} onClick={onClick} disabled={disabled}>
                <Typography>{t('BUTTON.NEXT')}</Typography>
            </StyledButton>
        );
    } else if (buttonType === 'confirm') {
        return (
            <StyledLoadingButton
                color={buttonColor}
                size={size}
                onClick={onClick}
                disabled={disabled}
                loading={isLoading}
                loadingPosition="center"
            >
                <Typography>{t('DR.RP.CONFIRM')}</Typography>
            </StyledLoadingButton>
        );
    } else {
        return (
            <StyledLoadingButton
                color={buttonColor}
                size={size}
                onClick={onClick}
                disabled={disabled}
                loading={isLoading}
                loadingPosition="center"
            >
                <Typography>{t('DR.RP.CONFIRM')}</Typography>
            </StyledLoadingButton>
        );
    }
};

export default ActionButton;

const StyledButton = styled(Button).attrs({ variant: 'contained' })``;
const StyledLoadingButton = styled(LoadingButton).attrs({ variant: 'contained' })``;
