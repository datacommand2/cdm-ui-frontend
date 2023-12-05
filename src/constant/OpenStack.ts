import { ClusterServiceSyncProgress, ClusterServiceSyncTypeCode } from '../@types/Cluster';

/**
 * 오픈스택 서비스 동기화 상태 Map
 */
export const ClusterServiceSyncMap: Record<ClusterServiceSyncTypeCode, string> = {
    'cluster.hypervisor.list.sync': '클러스터 하이퍼바이저 동기화',
    'cluster.keypair.list.sync': '클러스터 키페어 동기화',
    'cluster.storage.list.sync': '클러스터 스토리지 동기화',
    'cluster.router.list.sync': '클러스터 라우터 동기화',
    'cluster.security_group.list.sync': '클러스터 보안그룹 동기화',
    'cluster.tenant.list.sync': '클러스터 프로젝트 동기화',
    'cluster.volume-snapshot.list.sync': '클러스터 볼륨 스냅샷 동기화',
    'cluster.volume.list.sync': '클러스터 볼륨 동기화',
    'cluster.availability_zone.list.sync': '클러스터 가용구역 동기화',
    'cluster.instance.list.sync': '클러스터 인스턴스 동기화',
    'cluster.network.list.sync': '클러스터 네트워크 동기화',
};

/**
 * 오픈스택 서비스 동기화 진행률 Map
 */
export const ClusterServiceSyncProgressMap: Record<ClusterServiceSyncProgress, string> = {
    'cluster.sync.completed': '완료',
    'cluster.sync.failed': '실패',
    'cluster.sync.running': '진행중',
    'cluster.sync.waiting': '대기',
    waiting: '대기',
};
