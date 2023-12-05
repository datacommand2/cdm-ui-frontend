export interface OpenStackRecoveryPlanAdd {
    recovery_cluster: {
        id: number;
    };
    protection_cluster: {
        id: number;
    };
    direction_code: string;
    remarks?: string;
    name: string;
    snapshot_retention_count: number;
    detail: {
        tenants: {
            recovery_type_code: string;
            protection_cluster_tenant: {
                id: number;
            };
            recovery_cluster_tenant_mirror_name: string;
        }[];
        availability_zones: {
            recovery_type_code: string;
            protection_cluster_availability_zone: {
                id: number;
            };
            recovery_cluster_availability_zone: {
                id: number;
            };
        }[];
        external_networks: {
            recovery_type_code: string;
            protection_cluster_external_network: {
                id: number;
            };
            recovery_cluster_external_network: {
                id: number;
            };
        }[];
        storages: {
            recovery_type_code: string;
            protection_cluster_storage: {
                id: number;
            };
            recovery_cluster_storage: {
                id: number;
            };
        }[];
        instances: {
            recovery_type_code: string;
            protection_cluster_instance: {
                id: number;
            };
            recovery_cluster_hypervisor: {
                id: number;
            };
            recovery_cluster_availability_zone: {
                id: number;
            };
            auto_start_flag?: boolean;
            dependencies?: { id: number }[];
        }[];
    };
}
/**
 * 오픈스택 복구계획 수정 인터페이스
 */
export interface OpenStackRecoveryPlanEdit {
    id: number;
    protection_cluster: {
        id: number;
    };
    recovery_cluster: {
        id: number;
    };
    direction_code: string;
    remarks?: string;
    name: string;
    snapshot_retention_count: number;
    detail: {
        tenants: {
            recovery_type_code: string;
            protection_cluster_tenant: {
                id: number;
            };
            recovery_cluster_tenant_mirror_name: string;
        }[];
        availability_zones: {
            recovery_type_code: string;
            protection_cluster_availability_zone: {
                id: number;
            };
            recovery_cluster_availability_zone: {
                id: number;
            };
        }[];
        external_networks: {
            recovery_type_code: string;
            protection_cluster_external_network: {
                id: number;
            };
            recovery_cluster_external_network: {
                id: number;
            };
        }[];
        storages: {
            recovery_type_code: string;
            protection_cluster_storage: {
                id: number;
            };
            recovery_cluster_storage: {
                id: number;
            };
        }[];
        instances: {
            recovery_type_code: string;
            protection_cluster_instance: {
                id: number;
            };
            recovery_cluster_hypervisor: {
                id: number;
            };
            recovery_cluster_availability_zone: {
                id: number;
            };
            auto_start_flag?: boolean;
            dependencies?: { id: number }[];
        }[];
    };
}
