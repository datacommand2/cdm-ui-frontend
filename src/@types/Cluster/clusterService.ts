import { OpenStackCluster } from '.';
import { Tenant } from '../Cloud/user';

export type HypervisorTypeCode =
    | 'openstack.hypervisor.type.kvm'
    | 'openstack.hypervisor.type.lxc'
    | 'openstack.hypervisor.type.qemu'
    | 'openstack.hypervisor.type.uml'
    | 'openstack.hypervisor.type.vmware'
    | 'openstack.hypervisor.type.xen'
    | 'openstack.hypervisor.type.xenserver'
    | 'openstack.hypervisor.type.hyper-v'
    | 'openstack.hypervisor.type.virtuozzo';

export type NetworkTypeCode =
    | 'openstack.network.type.vlan'
    | 'openstack.network.type.vxlan'
    | 'openstack.network.type.gre'
    | 'openstack.network.type.flat'
    | 'openstack.network.type.local';
/**
 * 클러스터 하이퍼바이저(노드) 인터페이스
 */
export interface OpenStackHyperviser {
    id: number;
    cluster: OpenStackCluster;
    availability_zone: {
        id: number;
        cluster: OpenStackCluster;
        name: string;
        available: boolean;
    };
    uuid: string;
    type_code: HypervisorTypeCode;
    hostname: string;
    ip_address: string;
    vcpu_total_cnt?: number;
    vcpu_used_cnt?: number;
    mem_total_bytes?: number;
    mem_used_bytes?: number;
    disk_total_bytes?: number;
    disk_used_bytes?: number;
    status: 'enabled' | 'disabled';
    state: 'up' | 'down';
    ssh_port?: number;
    ssh_account?: string;
    ssh_password?: string;
    agent_port?: number;
    agent_version?: string;
    agent_installed_at?: number;
    agent_last_upgraded_at?: number;
}

/**
 * 클러스터 하이퍼바이저(노드) 추가정보 수정 인터페이스
 */
export interface OpenStackHypervisorInfoEdit {
    id: number;
    ssh_port: number;
    ssh_account: string;
    ssh_password: string;
    agent_port: number;
    agent_version: string;
    agent_installed_at: number;
    agent_last_upgraded_at: number;
}

/**
 * 오픈스택 서브넷
 */
export interface OpenStackNetworkSubnet {
    id: number;
    uuid: string;
    name: string;
    description?: string;
    network_cidr?: string;
    dhcp_enabled?: boolean;
    dhcp_pools?: {
        id: number;
        start_ip_address?: string;
        end_ip_address?: string;
    }[];
    gateway_enabled?: boolean;
    gateway_ip_address?: string;
    ipv6_address_mode_code?: 'slaac' | 'dhcpv6-stateful' | 'dhcpv6-stateless';
    ipv6_ra_mode_code?: 'slaac' | 'dhcpv6-stateful' | 'dhcpv6-stateless';
    nameservers?: {
        id: number;
        nameserver: string;
    }[];
}
/**
 * 오픈스택 Floating IP
 */
export interface OpenStackNetworkFloatingIP {
    id: number;
    uuid: string;
    description?: string;
    ip_address?: string;
    status: 'ACTIVE' | 'DOWN' | 'ERROR';
}

/**
 * 클러스터 라우터 인터페이스
 */
export interface OpenStackRouter {
    id: number;
    tenant: OpenStackTenant;
    uuid: string;
    name: string;
    description?: string;
    internal_routing_interfaces?: {
        network: {
            id: number;
            cluster: OpenStackCluster;
            tenant: Tenant;
            type_code: NetworkTypeCode;
            uuid: string;
            name: string;
            description?: string;
            external_flag?: boolean;
            status: 'ACTIVE' | 'DOWN' | 'BUILD' | 'ERROR';
            state: 'up' | 'down';
            subnets?: OpenStackNetworkSubnet[];
            floating_ips?: OpenStackNetworkFloatingIP[];
        };
        subnet: OpenStackNetworkSubnet;
        ip_address: string;
    }[];
    external_routing_interfaces?: {
        network: {
            id: number;
            cluster: OpenStackCluster;
            tenant: OpenStackTenant;
            type_code: NetworkTypeCode;
            uuid: string;
            name: string;
            description?: string;
            external_flag?: boolean;
            status: 'ACTIVE' | 'DOWN' | 'BUILD' | 'ERROR';
            state: 'up' | 'down';
            subnets?: OpenStackNetworkSubnet[];
            floating_ips?: OpenStackNetworkFloatingIP[];
        };
        subnet: OpenStackNetworkSubnet;
        ip_address: string;
    }[];
    extra_routes?: {
        id: number;
        destination?: string;
        nexthop?: string;
    }[];
    status: 'ACTIVE' | 'DOWN' | 'BUILD' | 'ERROR';
    state: 'up' | 'down';
}

/**
 * 클러스터 테넌트 인터페이스
 */
export interface OpenStackTenant {
    id: number;
    cluster: OpenStackCluster;
    uuid: string;
    name: string;
    description?: string;
    enabled?: boolean;
    quotas?: {
        key: string;
        value: number;
    }[];
}

/**
 * 클러스터 가용구역 인터페이스
 */
export interface OpenStackAvZone {
    id: number;
    cluster: OpenStackCluster;
    name: string;
    available?: boolean;
}

/**
 * 클러스터 네트워크 인터페이스
 */
export interface OpenStackNetwork {
    id: number;
    cluster: OpenStackCluster;
    tenant: OpenStackTenant;
    type_code: NetworkTypeCode;
    uuid: string;
    name: string;
    description?: string;
    external_flag?: boolean;
    status: 'ACTIVE' | 'DOWN' | 'BUILD' | 'ERROR';
    state: 'up' | 'down';
    subnets?: OpenStackNetworkSubnet[];
    floating_ips?: OpenStackNetworkFloatingIP[];
}

/**
 * 오픈스택 스토리지
 */
export interface OpenSatckStorage {
    id: number;
    cluster: OpenStackCluster;
    uuid: string;
    name: string;
    description?: string;
    type_code: 'openstack.storage.type.lvm' | 'openstack.storage.type.nfs' | 'openstack.storage.type.ceph';
    capacity_bytes?: number;
    used_bytes?: number;
    status?: string;
}

/**
 * 클러스터 볼륨 인터페이스
 */
export interface OpenStackVolume {
    id: number;
    cluster: OpenStackCluster;
    tenant: OpenStackTenant;
    storage: OpenSatckStorage;
    snapshots: {
        id: number;
        uuid: string;
        cluster_volume_group_snapshot_uuid?: string;
        name: string;
        description?: string;
        size_bytes?: number;
        status: 'available' | 'error' | 'creating' | 'deleting' | 'error_deleting';
        created_at: number;
    };
    uuid: string;
    name: string;
    description?: string;
    size_bytes?: number;
    multiattach?: boolean;
    bootable?: boolean;
    readonly?: boolean;
    status:
        | 'available'
        | 'error'
        | 'creating'
        | 'deleting'
        | 'in-use'
        | 'attaching'
        | 'detaching'
        | 'error_deleting'
        | 'maintenance';
}

/**
 * 클러스터 보안그룹 인터페이스
 */
export interface OpenStackSecurityGroup {
    id: number;
    cluster: OpenStackCluster;
    tenant: OpenStackTenant;
    uuid: string;
    name: string;
    description?: string;
}
/**
 * 클러스터 보안그룹 rule 인터페이스
 */
export interface OpenStackSecurityGroupRule {
    id: number;
    remote_security_group?: OpenStackSecurityGroup;
    uuid: string;
    description?: string;
    ether_type?: 4 | 6;
    network_cidr?: string;
    direction?: 'ingress' | 'egress';
    port_range_max?: number;
    port_range_min?: number;
    protocol?: string;
}

/**
 * 클러스터 보안그룹 상세 인터페이스
 */
export interface OpenStackSecurityGroupDetail {
    id: number;
    cluster: OpenStackCluster;
    tenant: OpenStackTenant;
    uuid: string;
    name: string;
    description?: string;
    rules?: OpenStackSecurityGroupRule[];
}

/**
 * 클러스터 볼륨타입 메타데이터 수정 인터페이스
 */
export interface OpenStackStorageMetadataEdit {
    admin_client: string;
    admin_keyring: string;
}

/**
 * 클러스터 인스턴스 스펙 인터페이스
 */
export interface OpenStackInstanceSpec {
    id: number;
    cluster: OpenStackCluster;
    uuid: string;
    name: string;
    description?: string;
    vcpu_total_cnt?: number;
    mem_total_bytes?: number;
    disk_total_bytes?: number;
    swap_total_bytes?: number;
    ephemeral_total_bytes?: number;
    extra_specs?: {
        key: string;
        value: string;
    }[];
}

/**
 * 클러스터 인스턴스의 네트워크
 */
export interface OpenStackInstanceNetwork {
    id: number;
    network: OpenStackNetwork;
    subnet: OpenStackNetworkSubnet;
    floating_ip: OpenStackNetworkFloatingIP;
    dhcp_flag?: boolean;
    ip_address: string;
}
/**
 * 클러스터 인스턴스의 볼륨
 */
export interface OpenStackInstanceVolume {
    storage: OpenSatckStorage;
    volume: OpenStackVolume;
    device_path?: string;
    boot_index?: number;
}
/**
 * 클러스터 인스턴스 인터페이스
 */
export interface OpenStackInstance {
    id: number;
    cluster: OpenStackCluster;
    tenant: OpenStackTenant;
    availability_zone: OpenStackAvZone;
    hypervisor: OpenStackHyperviser;
    uuid: string;
    name: string;
    status:
        | 'ACTIVE'
        | 'BUILD'
        | 'DELETED'
        | 'ERROR'
        | 'HARD_REBOOT'
        | 'MIGRATING'
        | 'PASSWORD'
        | 'PAUSED'
        | 'REBOOT'
        | 'REBUILD'
        | 'RESCUE'
        | 'RESIZE'
        | 'REVERT_RESIZE'
        | 'SHELVED'
        | 'SHELVED_OFFLOADED'
        | 'SHUTOFF'
        | 'SHUTOFF'
        | 'SOFT_DELETED'
        | 'SUSPENDED'
        | 'UNKNOWN'
        | 'VERIFY_RESIZE';
    state: 'NOSTATE' | 'RUNNING' | 'PAUSED' | 'SHUTDOWN' | 'CRASHED' | 'SUSPENDED';
    keypair: {
        id: number;
        name: string;
        fingerprint?: string;
        publick_key?: string;
        type_code: 'ssh' | 'x509';
    };
    spec?: OpenStackInstanceSpec;
    networks?: OpenStackInstanceNetwork[];
    routers?: OpenStackRouter[];
    security_groups?: OpenStackSecurityGroup[];
    volumes?: OpenStackVolume[];
}
