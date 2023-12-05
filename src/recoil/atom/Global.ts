import { atom, useRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

// Define atoms
const selectedMenuAtom = atom<string>({
    key: 'selectedMenu',
    default: '',
    effects_UNSTABLE: [persistAtom],
});

const isMenuOpenAtom = atom<boolean>({
    key: 'isMenuOpen',
    default: false,
    effects_UNSTABLE: [persistAtom],
});

const modeAtom = atom<'light' | 'dark'>({
    key: 'mode',
    default: 'light',
    effects_UNSTABLE: [persistAtom],
});

interface TreeState {
    clusterID: number;
    protectionGroupID: number;
    protectionGroupName: string;
    protectionGroupResourceName: string;
}

const treeStateAtom = atom<TreeState>({
    key: 'treeState',
    default: {
        clusterID: 0,
        protectionGroupID: 0,
        protectionGroupName: '',
        protectionGroupResourceName: '',
    },
});

const openedDrawersAtom = atom<any>({
    key: 'openedDrawers',
    default: null,
});

// Define setter functions to replace Redux reducers
const useSelectedMenu = (): [string, (newMenu: string) => void] => {
    const [menu, setSelectedMenu] = useRecoilState(selectedMenuAtom);
    return [menu, (newMenu: string) => setSelectedMenu(newMenu)];
};

const useIsMenuOpen = (): [boolean, (newIsOpen: boolean) => void] => {
    const [isOpen, setIsMenuOpen] = useRecoilState(isMenuOpenAtom);
    return [isOpen, (newIsOpen: boolean) => setIsMenuOpen(newIsOpen)];
};

const useToggleMode = (): ['light' | 'dark', (newMode: 'light' | 'dark') => void] => {
    const [mode, setMode] = useRecoilState(modeAtom);
    return [mode, (newMode: 'light' | 'dark') => setMode(newMode)];
};

const useTreeState = (): [TreeState, (newTreeState: TreeState) => void] => {
    const [treeState, setTreeState] = useRecoilState(treeStateAtom);
    return [treeState, newTreeState => setTreeState(newTreeState)];
};

const useOpenedDrawerState = (): [any[], (newOpenedDrawerState: any) => void] => {
    const [openedDrawers, setOpenedDrawers] = useRecoilState(openedDrawersAtom);
    return [openedDrawers, newOpenedDrawerState => setOpenedDrawers(newOpenedDrawerState)];
};

// Export atoms and setter functions
export {
    useSelectedMenu,
    useIsMenuOpen,
    useToggleMode,
    useTreeState,
    treeStateAtom,
    useOpenedDrawerState,
    openedDrawersAtom,
};
