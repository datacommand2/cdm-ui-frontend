/**
 * 복구계획 추가, 수정 payload의 volumes 데이터를 만드는 함수
 * TODO: 다른 데이터들은 사용자가 지정하는데 volumes는 왜 자동으로 지정하는지?
 * 이전 코드에서 이렇게 작성되어 있었음
 */
export const storeVolumes = (planDetail: any) => {
    let storageVolumeArr: any[] = [];
    planDetail.instances.map((instance: any) => {
        instance.protection_cluster_instance.volumes.map((v: any) => {
            storageVolumeArr.push({ storage: v.storage.id, volume: v.volume.id });
        });
    });

    let planVolumes: any[] = [];
    storageVolumeArr.map(v => {
        planDetail.storages.map((storage: any) => {
            if (storage.protection_cluster_storage.id === v.storage) {
                planVolumes.push({
                    recovery_type_code: 'dr.recovery.plan.volume.recovery.type.mirroring',
                    protection_cluster_volume: {
                        id: v.volume,
                    },
                    recovery_cluster_storage: {
                        id: storage.recovery_cluster_storage.id,
                    },
                });
            }
        });
    });
    return planVolumes;
};
