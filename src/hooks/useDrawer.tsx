import { ReactNode } from 'react';
import { useSetRecoilState } from 'recoil';

import { openedDrawersAtom } from '@/recoil/atom/Global';

/**
 * Drawer 동작 관련 Hook
 */
const useDrawer = () => {
    const setDrawers = useSetRecoilState(openedDrawersAtom);

    const open = (Component: ReactNode, width?: number) => {
        setDrawers({ Component, width });
    };

    const close = () => {
        setDrawers(null);
    };

    const openDrawer = (Component: ReactNode, width?: number) => {
        open(Component, width);
    };
    const closeDrawer = () => {
        close();
    };

    return { openDrawer, closeDrawer };
};

export default useDrawer;
