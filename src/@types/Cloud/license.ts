/**
 * 라이선스 인터페이스
 */
export interface LicenseInterface {
    'cdm-cloud-license-key'?: string;
    'cdm-cloud-provider'?: string;
    'cdm-cloud-customer'?: string;
    'cdm-dr-issue-dt'?: number;
    'cdm-dr-expiry-dt'?: number;
    'cdm-dr-limits-platform'?: 'openstack' | 'openshift' | 'kubernetes' | 'vmware';
    'cdm-dr-limits-storage'?: 'lvm' | 'nfs' | 'ceph' | 'netapp';
    'cdm-dr-limits-cluster'?: number;
    'cdm-dr-limits-tenant'?: number;
    'cdm-dr-limits-instance'?: number;
    'cdm-dr-limits-volume'?: number;
    'cdm-dr-issue-date'?: number;
    'cdm-dr-expiry-date'?: number;
    'cdm-dr-limits-agent'?: number;
    'cdm-dr-limits-group'?: number;
    // [key: string]: number | string | undefined;
}
