const instanceData: any = (instances: any[]) => {
    let protectionTenants: any[] = [];
    let protectionAvailabilityZones: any[] = [];
    let protectionStorages: any[] = [];
    let protectionVolumes: any[] = [];
    let protectionNetworks: any[] = [];
    let protectionInstances: any[] = [];
    instances.forEach(item => {
        if (item.tenant) {
            let flag = true;
            protectionTenants.forEach(tenant => {
                if (tenant.id === item.tenant.id) {
                    flag = false;
                }
            });
            if (flag) {
                protectionTenants.push(item.tenant);
            }
        }

        if (item.availability_zone) {
            let flag = true;
            protectionAvailabilityZones.forEach(az => {
                if (az.id === item.availability_zone.id) {
                    flag = false;
                }
            });
            if (flag) {
                protectionAvailabilityZones.push(item.availability_zone);
            }
        }

        if (item.routers) {
            let flag = true;
            item.routers.forEach((router: any) => {
                if (router.external_routing_interfaces) {
                    router.external_routing_interfaces.forEach((ex: any) => {
                        protectionNetworks.forEach(network => {
                            if (ex.network.id === network.id) {
                                flag = false;
                            }
                        });
                        if (flag) {
                            protectionNetworks.push(ex.network);
                        }
                    });
                }
            });
        }

        if (item.volumes) {
            let storageFlag = true;
            item.volumes.forEach((vol: any) => {
                protectionStorages.forEach(storage => {
                    if (vol.storage.id === storage.id) {
                        storageFlag = false;
                    }
                });
                if (storageFlag) {
                    protectionStorages.push(vol.storage);
                }
            });

            let volumeFlag = true;
            item.volumes.forEach((vol: any) => {
                protectionVolumes.forEach(volume => {
                    if (vol.volume.id === volume.id) {
                        volumeFlag = false;
                    }
                });
                if (volumeFlag) {
                    protectionVolumes.push(vol.volume);
                }
            });
        }
    });

    return {
        protectionInstances,
        protectionNetworks,
        protectionStorages,
        protectionVolumes,
        protectionTenants,
        protectionAvailabilityZones,
    };
};

export { instanceData };
