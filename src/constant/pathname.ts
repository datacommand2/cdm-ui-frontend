const PATHNAME = {
    // cluster
    CLUSTER: '/cluster',
    CLUSTER_ADD: '/cluster/add',
    OPENSTACK_CLUSTER_EDIT: '/openstack-cluster/edit',
    OPENSTACK_CLUSTER_DETAIL: '/openstack-cluster/detail',

    // protection group
    OPENSTACK_GROUP: '/openstack/protection-group',
    OPENSTACK_GROUP_ADD: '/openstack/protection-group/add',
    OPENSTACK_GROUP_EDIT: '/openstack/protection-group/edit',
    OPENSTACK_GROUP_DETAIL: '/openstack/protection-group/detail',

    // recovery plan
    OPENSTACK_PLAN: '/openstack/recovery-plan',
    OPENSTACK_PLAN_ADD: '/openstack/recovery-plan/add',
    OPENSTACK_PLAN_EDIT: '/openstack/recovery-plan/edit',
    OPENSTACK_PLAN_DETAIL: '/openstack/recovery-plan/detail',

    // recovery job
    OPENSTACK_JOB: '/openstack/recovery-job',
    OPENSTACK_JOB_ADD: '/openstack/recovery-job/add',
    OPENSTACK_JOB_EDIT: '/openstack/recovery-job/edit',
    OPENSTACK_JOB_FLOW: '/openstack/recovery-job/flow',
    OPENSTACK_JOB_MONITORING: '/openstack/recovery-job/monitoring',
    OPENSTACK_JOB_DETAIL: '/openstack/recovery-job/detail',

    // recovery result
    OPENSTACK_RESULT: '/openstack/recovery-result',
    OPENSTACK_RESULT_DETAIL: '/openstack/recovery-result/detail',

    // cloud
    EVENT_LIST: '/cloud/user/event-list',
    USER: '/cloud/admin/users/userAccount',
    USER_ADD: '/cloud/admin/users/userAccount/add',
    USER_EDIT: '/cloud/admin/users/userAccount/edit',
    PROFILE: '/cloud/account',
    GROUP: '/cloud/admin/users/userGroup',
    LICENSE: '/cloud/admin/license',
    SERVICE_CONFIG: '/setting/service-config',
} as const;

export { PATHNAME };
