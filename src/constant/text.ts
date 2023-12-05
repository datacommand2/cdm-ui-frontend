import i18n from '../libs/i18n/I18nConfig';

const t = i18n.t;

interface StringText {
    [key: string]: string;
}

const TEXT: StringText = {
    mon: '월',
    tue: '화',
    wed: '수',
    thu: '목',
    fri: '금',
    sat: '토',
    sun: '일',
    undefined: '',
    '': '',
    completed: '완료',
    failed: '실패',
    running: '진행중',
    init: '초기화중',
    available: '활성화',
    unavailable: '비활성화',
    error: '에러',
    none: '없음',
    waiting: '대기',
    'cluster.sync.completed': '완료',
    'cluster.sync.running': '진행중',
    'cluster.sync.failed': '실패',
    'cluster.sync.init': '초기화중',
    'cluster.sync.waiting': '대기',
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
    hypervisor: '하이퍼바이저',
    network: '네트워크',
    volume: '볼륨',
    keypair: '키페어',
    instance: '인스턴스',
    tenant: '프로젝트',
    availability_zone: '가용구역',
    storage: '스토리지',
    subnet: '서브넷',
    floating_ip: '플로팅 아이피',
    instance_spec: '인스턴스 스펙',
    'volume-snapshot': '볼륨 스냅샷',
    security_group: '보안그룹',
    router: '라우터',
    "Inoperative due to 'unavailable' condition in the network": '네트워크가 비활성화되어 클러스터가 경고 상태입니다.',
    "Inoperative due to 'unavailable' condition in the compute": '컴퓨트가 비활성화되어 클러스터가 경고 상태입니다.',
    "Inoperative due to 'unavailable' condition in the storage":
        '블록 스토리지가 비활성화되어 클러스터가 경고 상태입니다.',
    'check if there is a deleted service in the storage': '블록 스토리지가 삭제되어 클러스터가 경고 상태입니다.',
    'check if there is a deleted service in the compute': '컴퓨트가 삭제되어 클러스터가 경고 상태입니다.',
    'check if there is a deleted service in the network': '네트워크가 삭제되어 클러스터가 경고 상태입니다.',
    'not found cluster': '클러스터를 찾을 수 없습니다.',
    'unusable database': '데이터베이스 오류',
    'unsupported cluster type': '지원하지 않는 클러스터 유형',
    'cluster server error': '클러스터 서버에서 오류가 발생하여 클러스터가 경고 상태입니다.',
    'unknown error': '알 수 없는 에러가 발생했습니다.',
    'not found endpoint': 'endpoint를 찾을 수 없습니다.',
    'unauthorized user': '인가되지 않은 사용자입니다.',
    'not connected to cluster': '클러스터에 연결할 수 없습니다.',
    '-': '-',
    'dr.recovery.recovery_point.type.latest': t('DR.LATEST_DATA'),
    'dr.recovery.recovery_point.type.latest_snapshot': t('DR.LATEST_SNAPSHOT'),
    'dr.recovery.recovery_point.type.snapshot': t('DR.SPECIFIC_SNAPSHOT'),
};

export { TEXT };