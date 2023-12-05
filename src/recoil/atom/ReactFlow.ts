import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

// Define atoms for each piece of state
export const zoomLevelAtom = atom<number>({
    key: 'zoomLevel',
    default: 1,
    effects_UNSTABLE: [persistAtom],
});

export const positionXAtom = atom<number>({
    key: 'positionX',
    default: 0,
    effects_UNSTABLE: [persistAtom],
});

export const positionYAtom = atom<number>({
    key: 'positionY',
    default: 0,
    effects_UNSTABLE: [persistAtom],
});

export const useResetState = () => {
    const setZoomLevel = useSetRecoilState(zoomLevelAtom);
    const setPositionX = useSetRecoilState(positionXAtom);
    const setPositionY = useSetRecoilState(positionYAtom);

    return () => {
        setZoomLevel(1);
        setPositionX(0);
        setPositionY(0);
    };
};

export const useZoomLevel = (): [number, (newZoomLevel: number) => void] => {
    const [zoomLevel, setZoomLevel] = useRecoilState(zoomLevelAtom);
    return [zoomLevel, (zoomLevel: number) => setZoomLevel(zoomLevel)];
};

export const usePositionX = (): [number, (newPositionX: number) => void] => {
    const [positionX, setPositionX] = useRecoilState(positionXAtom);
    return [positionX, (newPositionX: number) => setPositionX(newPositionX)];
};

export const usePositionY = (): [number, (newPositionY: number) => void] => {
    const [positionY, setPositionY] = useRecoilState(positionYAtom);
    return [positionY, (newPositionY: number) => setPositionY(newPositionY)];
};
