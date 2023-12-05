import React from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Signal } from '@preact/signals-react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { useLogout, useCheckSession } from '@modules/Cloud/auth/common/hooks';
import { authInfo, LoginUser } from '@recoil/atom/LoginUser';

import ActionButton from '../Button/ActionButton';

interface SessionTimeDialogProps {
    open: Signal<boolean>;
    sessionTime: Signal<number>;
}

/**
 * 세션 남은시간을 알려주는 Dialog
 */
const SessionTimeDialog = ({ open, sessionTime }: SessionTimeDialogProps) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const setAuthInfo = useSetRecoilState(authInfo);
    const resetLoginUser = useResetRecoilState(LoginUser);

    // 로그아웃 하는 함수
    const { mutate: logout } = useLogout({
        successCallback: () => {
            queryClient.clear();
            toast.success('로그아웃 되었습니다.');
            localStorage.removeItem('session');
            setAuthInfo(false);
            resetLoginUser();
        },
    });

    // 세션 체크하는 함수
    const { mutate: extendSession } = useCheckSession({
        successCallback: (data: any) => {
            localStorage.setItem('session', data.user.session.key);
            toast.success('세션이 업데이트 되었습니다.');
        },
    });

    return (
        <Dialog open={true} maxWidth="sm" fullWidth>
            <DialogTitle>
                <div>
                    <Typography variant="h6">{t('GLOBAL.SESSION_TIMEOUT')}</Typography>
                </div>
            </DialogTitle>
            <DialogContent dividers={true}>
                <Box>
                    <Typography>{t('GLOBAL.SESSION_MODAL_HEAD')}</Typography>
                    <Typography variant="h6" className="error-text">{`${sessionTime.value} ${t(
                        'GLOBAL.SESSION_SECOND',
                    )}`}</Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <ActionButton
                    buttonType={'logout'}
                    onClick={() => {
                        // 로그아웃
                        logout();
                        // close session modal
                        open.value = false;
                    }}
                />
                <ActionButton
                    buttonType="continue"
                    type="primary"
                    onClick={() => {
                        // extend session
                        extendSession();
                        // close session modal
                        open.value = false;
                    }}
                />
            </DialogActions>
        </Dialog>
    );
};

export default SessionTimeDialog;
