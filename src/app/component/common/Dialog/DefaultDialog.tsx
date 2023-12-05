import { Breakpoint, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

import ActionButton from '../Button/ActionButton';

interface DefaultDialogProps {
    open: boolean;
    title: string;
    maxWidth?: false | Breakpoint | undefined;
    onClose?: any;
    onConfirm?: any;
    isLoading?: boolean;
    actionType?: string;
    customActions?: ReactNode;
    customDialogTitle?: any;
    children: ReactNode;
    buttonColor?: string;
    isCustomActions?: boolean;
}

/**
 * 기본 Dialog
 * DialogContent로는 children을 받아서 렌더링한다.
 * 일단, Actions는 고정으로 넣어놓고 custom props를 보고 따로 렌더링한다.
 */
const DefaultDialog = ({
    open,
    title,
    maxWidth,
    onClose,
    onConfirm,
    isLoading = false,
    actionType,
    customActions = <></>,
    customDialogTitle = false,
    children,
    buttonColor = 'primary',
    isCustomActions = false,
}: DefaultDialogProps) => {
    return (
        <Dialog open={open} fullWidth maxWidth={maxWidth}>
            {customDialogTitle ? customDialogTitle : <CustomTitle variant="h6">{title}</CustomTitle>}
            <DialogContent dividers={true}>{children}</DialogContent>
            <DialogActions>
                {isCustomActions ? (
                    customActions
                ) : (
                    <>
                        <ActionButton buttonType="cancel" onClick={onClose} disabled={isLoading} />
                        <ActionButton
                            buttonType={actionType}
                            buttonColor={buttonColor}
                            type="primary"
                            disabled={isLoading}
                            isLoading={isLoading}
                            onClick={onConfirm}
                        />
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default DefaultDialog;

const CustomTitle = styled(DialogTitle)`
    display: flex;
    font-weight: 700;
`;
