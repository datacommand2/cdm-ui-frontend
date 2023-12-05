import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { PATHNAME } from '../constant/pathname';
import LoginPage from './pages/Cloud/Auth/LoginPage';
import EventPage from './pages/Cloud/Event/EventPage';
import GroupPage from './pages/Cloud/Group/GroupPage';
import ProfilePage from './pages/Cloud/Profile/ProfilePage';
import UserAddPage from './pages/Cloud/User/UserAddPage';
import UserEditPage from './pages/Cloud/User/UserEditPage';
import UserPage from './pages/Cloud/User/UserPage';
import Layout from './component/common/layout/Layout';
import ServiceConfigPage from './pages/Cloud/Setting/ServiceConfigPage';

// Cluster
import ClusterPage from './pages/OpenStackCenter/ClusterPage';
import ClusterAddPage from './pages/OpenStackCenter/ClusterAddPage';
import OpenStackClusterEditPage from './pages/OpenStackCenter/OpenStackClusterEditPage';
import OpenStackClusterDetailPage from './pages/OpenStackCenter/OpenStackClusterDetailPage';

// protection group
import ProtectionGroupAddPage from './pages/OpenStackDR/ProtectionGroup/ProtectionGroupAddPage';
import ProtectionGroupEditPage from './pages/OpenStackDR/ProtectionGroup/ProtectionGroupEditPage';
import ProtectionGroupDetailPage from './pages/OpenStackDR/ProtectionGroup/ProtectionGroupDetailPage';
import ProtectionGroupPage from './pages/OpenStackDR/ProtectionGroup/ProtectionGroupPage';

// recovery plan
import RecoveryPlanAddPage from './pages/OpenStackDR/RecoveryPlan/RecoveryPlanAddPage';
import RecoveryPlanEditPage from './pages/OpenStackDR/RecoveryPlan/RecoveryPlanEditPage';
import RecoveryPlanPage from './pages/OpenStackDR/RecoveryPlan/RecoveryPlanPage';
import RecoveryPlanDetailPage from './pages/OpenStackDR/RecoveryPlan/RecoveryPlanDetailPage';

import RecoveryJobAddPage from './pages/OpenStackDR/RecoveryJob/RecoveryJobAddPage';
import RecoveryJobEditPage from './pages/OpenStackDR/RecoveryJob/RecoveryJobEditPage';
import RecoveryJobMonitoringPage from './pages/OpenStackDR/RecoveryJob/RecoveryJobMonitoringPage';
import RecoveryJobPage from './pages/OpenStackDR/RecoveryJob/RecoveryJobPage';
import RecoveryJobDetailPage from './pages/OpenStackDR/RecoveryJob/RecoveryJobDetailPage';

// recovery result
import RecoveryResultDetailPage from './pages/OpenStackDR/RecoveryResult/RecoveryResultDetailPage';
import RecoveryResultPage from './pages/OpenStackDR/RecoveryResult/RecoveryResultPage';
import { useRecoilValue } from 'recoil';
import { authInfo } from '../recoil/atom/LoginUser';

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<ProtectedRoutes />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<Navigate replace to="/cluster" />} />
                    <Route path={PATHNAME.PROFILE} element={<ProfilePage />} />
                    <Route path={`${PATHNAME.USER_EDIT}/:id`} element={<UserEditPage />} />
                    <Route path={PATHNAME.USER_ADD} element={<UserAddPage />} />
                    <Route path={PATHNAME.USER} element={<UserPage />} />
                    <Route path={PATHNAME.GROUP} element={<GroupPage />} />
                    <Route path={PATHNAME.EVENT_LIST} element={<EventPage />} />

                    {/* cluster */}
                    <Route path={PATHNAME.CLUSTER_ADD} element={<ClusterAddPage />} />
                    <Route path={`${PATHNAME.OPENSTACK_CLUSTER_EDIT}/:id`} element={<OpenStackClusterEditPage />} />
                    <Route path={`${PATHNAME.OPENSTACK_CLUSTER_DETAIL}/:id`} element={<OpenStackClusterDetailPage />} />
                    <Route path={PATHNAME.CLUSTER} element={<ClusterPage />} />
                    {/* openstack plan */}
                    <Route path={PATHNAME.OPENSTACK_PLAN_ADD} element={<RecoveryPlanAddPage />} />
                    <Route path={`${PATHNAME.OPENSTACK_PLAN_EDIT}/:id`} element={<RecoveryPlanEditPage />} />
                    <Route path={`${PATHNAME.OPENSTACK_PLAN_DETAIL}/:id`} element={<RecoveryPlanDetailPage />} />
                    <Route path={PATHNAME.OPENSTACK_PLAN} element={<RecoveryPlanPage />} />
                    {/* openstack job */}
                    <Route path={PATHNAME.OPENSTACK_JOB_ADD} element={<RecoveryJobAddPage />} />
                    <Route path={`${PATHNAME.OPENSTACK_JOB_MONITORING}/:id`} element={<RecoveryJobMonitoringPage />} />
                    <Route path={`${PATHNAME.OPENSTACK_JOB_EDIT}/:id`} element={<RecoveryJobEditPage />} />
                    <Route path={`${PATHNAME.OPENSTACK_JOB_DETAIL}/:id`} element={<RecoveryJobDetailPage />} />
                    <Route path={PATHNAME.OPENSTACK_JOB} element={<RecoveryJobPage />} />
                    {/* openstack result */}
                    <Route path={`${PATHNAME.OPENSTACK_RESULT_DETAIL}/:id`} element={<RecoveryResultDetailPage />} />
                    <Route path={PATHNAME.OPENSTACK_RESULT} element={<RecoveryResultPage />} />
                    {/* openstack protection group */}
                    <Route path={PATHNAME.OPENSTACK_GROUP_ADD} element={<ProtectionGroupAddPage />} />
                    <Route path={`${PATHNAME.OPENSTACK_GROUP_DETAIL}/:id`} element={<ProtectionGroupDetailPage />} />
                    <Route path={`${PATHNAME.OPENSTACK_GROUP_EDIT}/:id`} element={<ProtectionGroupEditPage />} />
                    <Route path={PATHNAME.OPENSTACK_GROUP} element={<ProtectionGroupPage />} />

                    <Route path={PATHNAME.SERVICE_CONFIG} element={<ServiceConfigPage />} />
                </Route>
            </Route>

            <Route element={<PublicRoutes />}>
                <Route path="/auth/login" element={<LoginPage />} />
            </Route>
        </Routes>
    );
};

export default Router;

const ProtectedRoutes = () => {
    const isLoggedIn = useRecoilValue(authInfo);

    return isLoggedIn ? <Outlet /> : <Navigate to="/auth/login" />;
};

const PublicRoutes = () => {
    const isLoggedIn = useRecoilValue(authInfo);

    return isLoggedIn ? <Navigate to="/cluster" /> : <Outlet />;
};
