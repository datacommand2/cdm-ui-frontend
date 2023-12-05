import { openedDrawersAtom } from '@/recoil/atom/Global';
import { Box, Drawer, IconButton, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';

import CloseIcon from '@mui/icons-material/Close';
import useDrawer from '@/hooks/useDrawer';

/**
 * 전역에서 사용하는 Drawer 컴포넌트
 */
const GlobalDrawer = () => {
    const drawer = useRecoilValue(openedDrawersAtom);

    return (
        <Drawer anchor={'right'} open={drawer === null ? false : true}>
            <Box sx={{ width: drawer?.width ?? 700 }} role="presentation">
                {drawer?.Component}
            </Box>
        </Drawer>
    );
};

export default GlobalDrawer;

/**
 * Drawer 컴포넌트 닫기 버튼
 */
export const CloseDrawerButton = () => {
    const { closeDrawer } = useDrawer();

    return (
        <Tooltip title={<Typography>닫기</Typography>}>
            <IconButton onClick={closeDrawer}>
                <CloseIcon />
            </IconButton>
        </Tooltip>
    );
};
