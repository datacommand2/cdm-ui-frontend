import { useMutation } from '@tanstack/react-query';

import { _deleteCluster } from '@api/center/cluster';
import { _deleteUser } from '@api/cloud/identity';
import { _deleteProtectionGroup } from '@api/dr/protectionGroup';
import { _deleteForceRecoveryJob, _deleteRecoveryJob } from '@api/dr/recoveryJob';
import { _deleteRecoveryPlan } from '@api/dr/recoveryPlan';
import { _deleteRecoveryReport } from '@api/dr/recoveryResult';

/**
 * 삭제하는 custom hook
 */
const useDelete = (successCallback, type) => {
    const del = (id, subId, name, type) => {
        if (type === 'openstack-cluster') {
            return _deleteCluster(subId);
        } else if (type === 'openstack-protection-group') {
            return _deleteProtectionGroup(subId);
        } else if (type === 'openstack-recovery-plan') {
            return _deleteRecoveryPlan(id, subId);
        } else if (type === 'openstack-recovery-job-force') {
            return _deleteForceRecoveryJob(id, subId);
        } else if (type === 'openstack-recovery-job') {
            return _deleteRecoveryJob(id, subId);
        } else if (type === 'openstack-recovery-result') {
            return _deleteRecoveryReport(id, subId);
        } else if (type === 'user') {
            return _deleteUser(subId);
        }
    };
    const { isLoading: deleteLoading, mutate: deleteFn } = useMutation(
        // id는 복구계획, 복구작업, 복구결과에서의 보호그룹 ID
        payload => del(payload.id, payload.subId, payload.name, type),
        {
            onSuccess: successCallback,
        },
    );
    return { deleteLoading, deleteFn };
};

export default useDelete;
