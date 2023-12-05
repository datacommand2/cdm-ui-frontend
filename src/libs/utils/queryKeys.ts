import { Dayjs } from 'dayjs';

interface filterProps {
    limit?: number;
    offset?: number;
    clusterID?: string | number | null;
    nodeID?: number;
    workloadID?: string | number;
    protectionGroupID?: string | number;
    searchFilterValue?: string;
    isLogin?: boolean;
    selectedGroupId?: string | number;
    inputData?: string;
    uuid?: string;
    name?: string;
    hostname?: string;
    tenantID?: string | number;
    type?: string;
    result?: string;
    solution?: string | undefined;
    class1?: string | undefined;
    class3?: string | undefined;
    level?: string | undefined;
    startDate?: Dayjs | number | undefined;
    endDate?: Dayjs | number | undefined;
    namespace?: string;
    protectionGroupResourceName?: string | null;
    recoveryPlanResourceName?: string | null;
    recoveryJobResourceName?: string | null;
    recoveryJobTaskResourceName?: string | null;
}
// CLOUD
export const userKeys = {
    all: ['users'],
    lists: () => [...userKeys.all, 'list'],
    list: (filters: filterProps) => [...userKeys.lists(), filters],
    details: () => [...userKeys.all, 'detail'],
    detail: (id: number) => [...userKeys.details(), id],
};

export const userGroupKeys = {
    all: ['userGroups'],
    lists: () => [...userGroupKeys.all, 'list'],
    list: (filters: filterProps) => [...userGroupKeys.lists(), filters],
    details: () => [...userGroupKeys.all, 'detail'],
    detail: (id: number) => [...userGroupKeys.details(), id],
    userListsInGroup: () => [...userGroupKeys.all, 'userListInGroup'],
    userListInGroup: (filters: filterProps) => [...userGroupKeys.userListsInGroup(), filters],
    userListsOutGroup: () => [...userGroupKeys.all, 'userListOutGroup'],
    userListOutGroup: (filters: filterProps) => [...userGroupKeys.userListsOutGroup(), filters],
};

export const solutionKeys = {
    all: ['solutions'],
};

export const uuidKeys = {
    all: ['productUUID'],
};

export const licenseKeys = {
    all: ['license'],
};

// CENTER
export const clusterKeys = {
    all: ['clusters'],
    lists: () => [...clusterKeys.all, 'list'],
    list: (filters: filterProps) => [...clusterKeys.lists(), filters],
    details: () => [...clusterKeys.all, 'detail'],
    detail: (id: number) => [...clusterKeys.details(), id],
};

export const openShiftClusterKeys = {
    all: ['openShiftClusters'],
    lists: () => [...openShiftClusterKeys.all, 'list'],
    list: (filters: filterProps) => [...openShiftClusterKeys.lists(), filters],
    details: () => [...openShiftClusterKeys.all, 'detail'],
    detail: (id: number) => [...openShiftClusterKeys.details(), id],
};

export const openShiftNamespaceKeys = {
    all: ['openShiftNamespace'],
    lists: () => [...openShiftNamespaceKeys.all, 'list'],
    list: (filters: filterProps) => [...openShiftNamespaceKeys.lists(), filters],
    details: () => [...openShiftNamespaceKeys.all, 'detail'],
    detail: (id: number) => [...openShiftNamespaceKeys.details(), id],
};

export const openShiftRegistryKeys = {
    all: ['openShiftRegistry'],
    lists: () => [...openShiftRegistryKeys.all, 'list'],
    list: (filters: filterProps) => [...openShiftRegistryKeys.lists(), filters],
    details: () => [...openShiftRegistryKeys.all, 'detail'],
    detail: (id: number) => [...openShiftRegistryKeys.details(), id],
};

export const openShiftSchedulerKeys = {
    all: ['openShiftScheduler'],
    lists: () => [...openShiftSchedulerKeys.all, 'list'],
    list: (filters: filterProps) => [...openShiftSchedulerKeys.lists(), filters],
    details: () => [...openShiftSchedulerKeys.all, 'detail'],
    detail: (id: number) => [...openShiftSchedulerKeys.details(), id],
};

export const openShiftRuntimeClassKeys = {
    all: ['openShiftRuntimeClass'],
    lists: () => [...openShiftRuntimeClassKeys.all, 'list'],
    list: (filters: filterProps) => [...openShiftRuntimeClassKeys.lists(), filters],
    details: () => [...openShiftRuntimeClassKeys.all, 'detail'],
    detail: (id: number) => [...openShiftRuntimeClassKeys.details(), id],
};

export const openShiftServiceKeys = {
    all: ['openShiftService'],
    lists: () => [...openShiftServiceKeys.all, 'list'],
    list: (filters: filterProps) => [...openShiftServiceKeys.lists(), filters],
    details: () => [...openShiftServiceKeys.all, 'detail'],
    detail: (id: number) => [...openShiftServiceKeys.details(), id],
};

export const openShiftServiceAccountKeys = {
    all: ['openShiftServiceAccount'],
    lists: () => [...openShiftServiceAccountKeys.all, 'list'],
    list: (filters: filterProps) => [...openShiftServiceAccountKeys.lists(), filters],
    details: () => [...openShiftServiceAccountKeys.all, 'detail'],
    detail: (id: number) => [...openShiftServiceAccountKeys.details(), id],
};

export const openShiftPriorityClassKeys = {
    all: ['openShiftPriorityClass'],
    lists: () => [...openShiftPriorityClassKeys.all, 'list'],
    list: (filters: filterProps) => [...openShiftPriorityClassKeys.lists(), filters],
    details: () => [...openShiftPriorityClassKeys.all, 'detail'],
    detail: (id: number) => [...openShiftPriorityClassKeys.details(), id],
};

export const openShiftFinalizerKeys = {
    all: ['openShiftFinalizer'],
    lists: () => [...openShiftFinalizerKeys.all, 'list'],
    list: (filters: filterProps) => [...openShiftFinalizerKeys.lists(), filters],
    details: () => [...openShiftFinalizerKeys.all, 'detail'],
    detail: (id: number) => [...openShiftFinalizerKeys.details(), id],
};

export const openShiftStorageClassKeys = {
    all: ['openShiftStorageClass'],
    lists: () => [...openShiftStorageClassKeys.all, 'list'],
    list: (filters: filterProps) => [...openShiftStorageClassKeys.lists(), filters],
    details: () => [...openShiftStorageClassKeys.all, 'detail'],
    detail: (id: number) => [...openShiftStorageClassKeys.details(), id],
};

export const openShiftVolumeSnapshotClassKeys = {
    all: ['openShiftVolumeSnapshotClass'],
    lists: () => [...openShiftVolumeSnapshotClassKeys.all, 'list'],
    list: (filters: filterProps) => [...openShiftVolumeSnapshotClassKeys.lists(), filters],
    details: () => [...openShiftVolumeSnapshotClassKeys.all, 'detail'],
    detail: (id: number) => [...openShiftVolumeSnapshotClassKeys.details(), id],
};

export const openShiftWorkloadKeys = {
    all: ['openShiftWorkload'],
    lists: () => [...openShiftWorkloadKeys.all, 'list'],
    list: (filters: filterProps) => [...openShiftWorkloadKeys.lists(), filters],
    details: () => [...openShiftWorkloadKeys.all, 'detail'],
    detail: (id: number) => [...openShiftWorkloadKeys.details(), id],
};

export const openShiftProtectionGroupWorkloadKeys = {
    all: ['openShiftProtectionGroupWorkload'],
    lists: () => [...openShiftProtectionGroupWorkloadKeys.all, 'list'],
    list: (filters: filterProps) => [...openShiftProtectionGroupWorkloadKeys.lists(), filters],
    details: () => [...openShiftProtectionGroupWorkloadKeys.all, 'detail'],
    detail: (id: number) => [...openShiftProtectionGroupWorkloadKeys.details(), id],
};

export const openShiftRecoveryPlanKeys = {
    all: ['openshiftRecoveryPlans'],
    lists: () => [...openShiftRecoveryPlanKeys.all, 'list'],
    list: (filters: filterProps) => [...openShiftRecoveryPlanKeys.lists(), filters],
    details: () => [...openShiftRecoveryPlanKeys.all, 'detail'],
    detail: (groupResourceName: string, planResourceName: string) => [
        ...openShiftRecoveryPlanKeys.details(),
        groupResourceName,
        planResourceName,
    ],
};

export const openShiftRecoveryPlanStatusKeys = {
    all: ['openshiftRecoveryPlanStatus'],
    details: () => [...openShiftRecoveryPlanStatusKeys.all, 'detail'],
    detail: (groupResourceName: string, planResourceName: string) => [
        ...openShiftRecoveryPlanStatusKeys.details(),
        groupResourceName,
        planResourceName,
    ],
};

export const openShiftRecoveryPlanRecoveryInfoKeys = {
    all: ['openshiftRecoveryPlanRecoveryInfo'],
    details: () => [...openShiftRecoveryPlanRecoveryInfoKeys.all, 'detail'],
    detail: (groupResourceName: string, planResourceName: string) => [
        ...openShiftRecoveryPlanRecoveryInfoKeys.details(),
        groupResourceName,
        planResourceName,
    ],
};

// DR
export const protectionGroupKeys = {
    all: ['protectionGroups'],
    lists: () => [...protectionGroupKeys.all, 'list'],
    list: (filters: filterProps) => [...protectionGroupKeys.lists(), filters],
    details: () => [...protectionGroupKeys.all, 'detail'],
    detail: (id: number | string) => [...protectionGroupKeys.details(), id],
};

export const protectionSnapShotKeys = {
    all: ['protectionSnapShots'],
    lists: () => [...protectionSnapShotKeys.all, 'list'],
    list: (filters: filterProps) => [...protectionSnapShotKeys.lists(), filters],
    details: () => [...protectionSnapShotKeys.all, 'detail'],
    detail: (id: number) => [...protectionSnapShotKeys.details(), id],
};

export const recoveryPlanKeys = {
    all: ['recoveryPlans'],
    lists: () => [...recoveryPlanKeys.all, 'list'],
    list: (filters: filterProps) => [...recoveryPlanKeys.lists(), filters],
    details: () => [...recoveryPlanKeys.all, 'detail'],
    detail: (groupID: number, planID: number) => [...recoveryPlanKeys.details(), groupID, planID],
};

export const clusterNetworkKeys = {
    all: ['clusterNetwork'],
    lists: () => [...clusterNetworkKeys.all, 'list'],
    list: (filters: filterProps) => [...clusterNetworkKeys.lists(), filters],
    details: () => [...clusterNetworkKeys.all, 'detail'],
    detail: (networkID: number, clusterID: number) => [...clusterNetworkKeys.details(), clusterID, networkID],
};

export const clusterHypervisorKeys = {
    all: ['clusterHypervisor'],
    lists: () => [...clusterHypervisorKeys.all, 'list'],
    list: (filters: filterProps) => [...clusterHypervisorKeys.lists(), filters],
    details: () => [...clusterHypervisorKeys.all, 'detail'],
    detail: (clusterID: number, nodeID: number) => [...clusterHypervisorKeys.details(), clusterID, nodeID],
};

export const clusterRouterKeys = {
    all: ['clusterRouter'],
    lists: () => [...clusterRouterKeys.all, 'list'],
    list: (filters: filterProps) => [...clusterRouterKeys.lists(), filters],
};

export const clusterTenantKeys = {
    all: ['clusterTenant'],
    lists: () => [...clusterTenantKeys.all, 'list'],
    list: (filters: filterProps) => [...clusterTenantKeys.lists(), filters],
};

export const clusterAvZoneKeys = {
    all: ['clusterAvZone'],
    lists: () => [...clusterAvZoneKeys.all, 'list'],
    list: (filters: filterProps) => [...clusterAvZoneKeys.lists(), filters],
};

export const clusterInstanceKeys = {
    all: ['clusterInstance'],
    lists: () => [...clusterInstanceKeys.all, 'list'],
    list: (filters: filterProps) => [...clusterInstanceKeys.lists(), filters],
    details: () => [...clusterInstanceKeys.all, 'detail'],
    detail: (clusterID: number, instanceID: number) => [...clusterInstanceKeys.details(), clusterID, instanceID],
};

export const clusterInstanceScriptKeys = {
    all: ['clusterInstanceScript'],
    details: () => [...clusterInstanceScriptKeys.all, 'detail'],
    detail: (id: number) => [...clusterInstanceScriptKeys.details(), id],
};

export const clusterVolumeKeys = {
    all: ['clusterVolume'],
    lists: () => [...clusterVolumeKeys.all, 'list'],
    list: (filters: filterProps) => [...clusterVolumeKeys.lists(), filters],
    details: () => [...clusterVolumeKeys.all, 'detail'],
    detail: (id: number) => [...clusterVolumeKeys.details(), id],
};

export const clusterSecurityGroupKeys = {
    all: ['clusterSecurityGroup'],
    lists: () => [...clusterSecurityGroupKeys.all, 'list'],
    list: (filters: filterProps) => [...clusterSecurityGroupKeys.lists(), filters],
    details: () => [...clusterSecurityGroupKeys.all, 'detail'],
    detail: (clusterID: number, securityGroupID: number) => [
        ...clusterSecurityGroupKeys.details(),
        clusterID,
        securityGroupID,
    ],
};

export const clusterVolumeTypeKeys = {
    all: ['clusterVolumeType'],
    lists: () => [...clusterVolumeTypeKeys.all, 'list'],
    list: (filters: filterProps) => [...clusterVolumeTypeKeys.lists(), filters],
    details: () => [...clusterVolumeTypeKeys.all, 'detail'],
    detail: (clusterID: number, volumeTypeID: number) => [...clusterVolumeTypeKeys.details(), clusterID, volumeTypeID],
};

export const unprotectedInstanceKeys = {
    all: ['unprotectedInstances'],
    lists: () => [...unprotectedInstanceKeys.all, 'list'],
    list: (filters: filterProps) => [...unprotectedInstanceKeys.lists(), filters],
};

export const recoveryJobKeys = {
    all: ['recoveryJob'],
    lists: () => [...recoveryJobKeys.all, 'list'],
    list: (filters: filterProps) => [...recoveryJobKeys.lists(), filters],
    details: () => [...recoveryJobKeys.all, 'detail'],
    detail: (groupID: number, jobID: number) => [...recoveryJobKeys.details(), groupID, jobID],
};
export const recoveryResultKeys = {
    all: ['recoveryResult'],
    lists: () => [...recoveryResultKeys.all, 'list'],
    list: (filters: filterProps) => [...recoveryResultKeys.lists(), filters],
    details: () => [...recoveryResultKeys.all, 'detail'],
    detail: (groupID: number, resultID: number) => [...recoveryResultKeys.details(), groupID, resultID],
};

export const protectionGroupHistoryKeys = {
    all: ['protectionGroupHistory'],
    lists: () => [...protectionGroupHistoryKeys.all, 'list'],
    list: (filters: filterProps) => [...protectionGroupHistoryKeys.lists(), filters],
    details: () => [...protectionGroupHistoryKeys.all, 'detail'],
    detail: (id: number) => [...protectionGroupHistoryKeys.details(), id],
};

export const eventKeys = {
    all: ['event'],
    lists: () => [...eventKeys.all, 'list'],
    list: (filters: filterProps) => [...eventKeys.lists(), filters],
    details: () => [...eventKeys.all, 'detail'],
    detail: (id: number) => [...eventKeys.details(), id],
};

export const eventClassificationKeys = {
    all: ['eventClassification'],
    lists: () => [...eventClassificationKeys.all, 'list'],
    list: (filters: filterProps) => [...eventClassificationKeys.lists(), filters],
    details: () => [...eventClassificationKeys.all, 'detail'],
    detail: (id: number) => [...eventClassificationKeys.details(), id],
};

export const clusterConfigKeys = {
    all: ['clusterConfig'],
    details: () => [...clusterConfigKeys.all, 'detail'],
    detail: (id: number) => [...clusterConfigKeys.details(), id],
};

export const clusterStatusKeys = {
    all: ['clusterStatus'],
    details: () => [...clusterStatusKeys.all, 'detail'],
    detail: (id: number) => [...clusterStatusKeys.details(), id],
};

export const serviceConfigKeys = {
    all: ['serviceConfig'],
    lists: () => [...serviceConfigKeys.all, 'list'],
    list: (filters: filterProps) => [...serviceConfigKeys.lists(), filters],
};

export const openshiftProtectionGroupKeys = {
    all: ['openshiftProtectionGroup'],
    lists: () => [...openshiftProtectionGroupKeys.all, 'list'],
    list: (filters: filterProps) => [...openshiftProtectionGroupKeys.lists(), filters],
    details: () => [...openshiftProtectionGroupKeys.all, 'detail'],
    detail: (clusterID: number, resourceName: string) => [
        ...openshiftProtectionGroupKeys.details(),
        clusterID,
        resourceName,
    ],
};
export const openshiftProtectionGroupInfoKeys = {
    all: ['openshiftProtectionGroupInfo'],
    lists: () => [...openshiftProtectionGroupInfoKeys.all, 'list'],
    list: (filters: filterProps) => [...openshiftProtectionGroupInfoKeys.lists(), filters],
    details: () => [...openshiftProtectionGroupInfoKeys.all, 'detail'],
    detail: (clusterID: number, resourceName: string) => [
        ...openshiftProtectionGroupInfoKeys.details(),
        clusterID,
        resourceName,
    ],
};

export const instanceTemplateKeys = {
    all: ['instasnceTemplate'],
    lists: () => [...instanceTemplateKeys.all, 'list'],
    list: (filters: filterProps) => [...instanceTemplateKeys.lists(), filters],
    details: () => [...instanceTemplateKeys.all, 'detail'],
    detail: (id: number) => [...instanceTemplateKeys.details(), id],
};

export const OpenShiftRecoveryJobScheduleKeys = {
    all: ['OpenShiftRecoveryJobSchedules'],
    lists: () => [...OpenShiftRecoveryJobScheduleKeys.all, 'list'],
    list: (filters: filterProps) => [...OpenShiftRecoveryJobScheduleKeys.lists(), filters],
    details: () => [...OpenShiftRecoveryJobScheduleKeys.all, 'detail'],
    detail: (groupResourceName: string, jobScheduleResourceName: string) => [
        ...OpenShiftRecoveryJobScheduleKeys.details(),
        groupResourceName,
        jobScheduleResourceName,
    ],
};

export const OpenShiftRecoveryJobKeys = {
    all: ['OpenShiftRecoveryJobs'],
    lists: () => [...OpenShiftRecoveryJobKeys.all, 'list'],
    list: (filters: filterProps) => [...OpenShiftRecoveryJobKeys.lists(), filters],
    details: () => [...OpenShiftRecoveryJobKeys.all, 'detail'],
    detail: (groupResourceName: string, jobResourceName: string) => [
        ...OpenShiftRecoveryJobKeys.details(),
        groupResourceName,
        jobResourceName,
    ],
};

export const OpenShiftRecoveryJobStatusKeys = {
    all: ['OpenShiftRecoveryJobStatus'],
    lists: () => [...OpenShiftRecoveryJobStatusKeys.all, 'list'],
    list: (filters: filterProps) => [...OpenShiftRecoveryJobStatusKeys.lists(), filters],
    details: () => [...OpenShiftRecoveryJobStatusKeys.all, 'detail'],
    detail: (groupResourceName: string, jobResourceName: string) => [
        ...OpenShiftRecoveryJobStatusKeys.details(),
        groupResourceName,
        jobResourceName,
    ],
};

export const OpenShiftRecoveryJobInfoKeys = {
    all: ['OpenShiftRecoveryJobInfo'],
    lists: () => [...OpenShiftRecoveryJobInfoKeys.all, 'list'],
    list: (filters: filterProps) => [...OpenShiftRecoveryJobInfoKeys.lists(), filters],
    details: () => [...OpenShiftRecoveryJobInfoKeys.all, 'detail'],
    detail: (groupResourceName: string, jobResourceName: string) => [
        ...OpenShiftRecoveryJobInfoKeys.details(),
        groupResourceName,
        jobResourceName,
    ],
};

export const OpenShiftRecoveryJobTaskKeys = {
    all: ['OpenShiftRecoveryJobTask'],
    lists: () => [...OpenShiftRecoveryJobTaskKeys.all, 'list'],
    list: (filters: filterProps) => [...OpenShiftRecoveryJobTaskKeys.lists(), filters],
    details: () => [...OpenShiftRecoveryJobTaskKeys.all, 'detail'],
    detail: (groupResourceName: string, jobResourceName: string) => [
        ...OpenShiftRecoveryJobTaskKeys.details(),
        groupResourceName,
        jobResourceName,
    ],
};

export const OpenShiftRecoveryJobTaskLogKeys = {
    all: ['OpenShiftRecoveryJobTaskLog'],
    lists: () => [...OpenShiftRecoveryJobTaskLogKeys.all, 'list'],
    list: (filters: filterProps) => [...OpenShiftRecoveryJobTaskLogKeys.lists(), filters],
};
