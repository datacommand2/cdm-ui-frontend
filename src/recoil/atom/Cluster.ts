import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

import { ClusterSyncStatus } from '../../@types/Cluster';

const { persistAtom } = recoilPersist();

const clusterSyncStatus = atom<ClusterSyncStatus[]>({
    key: 'clusterSyncStatus',
    default: [{ id: 0, status: 'cluster.sync.state.none', completion: [], progress: '0' }],
    effects_UNSTABLE: [persistAtom],
});

export { clusterSyncStatus };
