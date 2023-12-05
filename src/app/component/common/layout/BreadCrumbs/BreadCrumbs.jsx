import React from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { useSelectedMenu } from '../../../../../recoil/atom/Global';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

import * as S from './BreadCrumbs.style';
import { PATHNAME } from '../../../../../constant/pathname';

const breadcrumbNameMap = {
    [PATHNAME.CLUSTER]: '클러스터',
    [PATHNAME.CLUSTER_ADD]: '클러스터 추가',
    [PATHNAME.OPENSTACK_CLUSTER_EDIT]: '클러스터 수정',
    [PATHNAME.OPENSTACK_CLUSTER_DETAIL]: '클러스터 상세',
    [PATHNAME.OPENSTACK_GROUP]: '보호그룹',
    [PATHNAME.OPENSTACK_GROUP_ADD]: '보호그룹 추가',
    [PATHNAME.OPENSTACK_GROUP_EDIT]: '보호그룹 수정',
    [PATHNAME.OPENSTACK_GROUP_DETAIL]: '보호그룹 상세',
    [PATHNAME.OPENSTACK_PLAN]: '복구계획',
    [PATHNAME.OPENSTACK_PLAN_ADD]: '복구계획 추가',
    [PATHNAME.OPENSTACK_PLAN_EDIT]: '복구계획 수정',
    [PATHNAME.OPENSTACK_PLAN_DETAIL]: '복구계획 상세',
    [PATHNAME.OPENSTACK_JOB]: '복구작업',
    [PATHNAME.OPENSTACK_JOB_ADD]: '복구작업 추가',
    [PATHNAME.OPENSTACK_JOB_EDIT]: '복구작업 수정',
    [PATHNAME.OPENSTACK_JOB_FLOW]: '복구작업 워크플로우',
    [PATHNAME.OPENSTACK_JOB_MONITORING]: '복구작업 모니터링',
    [PATHNAME.OPENSTACK_JOB_DETAIL]: '복구작업 상세',
    [PATHNAME.OPENSTACK_RESULT]: '복구결과',
    [PATHNAME.OPENSTACK_RESULT_DETAIL]: '복구결과 상세',
    [PATHNAME.USER]: '사용자 계정',
    [PATHNAME.USER_ADD]: '사용자 계정 추가',
    [PATHNAME.USER_EDIT]: '사용자 계정 수정',
    [PATHNAME.GROUP]: '사용자 그룹',
    [PATHNAME.EVENT_LIST]: '이벤트 목록',
    [PATHNAME.PROFILE]: '내 정보',
    [PATHNAME.SERVICE_CONFIG]: '서비스 설정',
};

// 현재 페이지가 detail, edit 일 때는 전 페이지(리스트 페이지)로 갈 때 id값을 뺀다.
// 현재 페이지가 detail, edit이 아닌 경우
// ex) 클러스터 상세 - 노드 상세인 경우 클러스터 id 값을 같이 보내서
// 이전에 있던 클러스터 페이지로 이동하게끔
const LinkRouter = props => {
    const location = useLocation();
    return (
        <Link
            color="inherit"
            underline="hover"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            {...props}
            component={RouterLink}
            state={{ id: location.state?.id, name: location.state?.name }}
        />
    );
};

const Page = () => {
    const [, setSelectedMenu] = useSelectedMenu();
    const location = useLocation();

    let pathnames = location.pathname.split('/').filter(x => x.length !== 0);

    // 마지막 값이 int 면 제거
    // if (!isNaN(parseInt(pathnames[pathnames.length - 1]))) {
    //     pathnames = pathnames.slice(0, pathnames.length - 1);
    // }
    if (
        pathnames[pathnames.length - 2] === 'edit' ||
        pathnames[pathnames.length - 2] === 'detail' ||
        pathnames[pathnames.length - 2] === 'monitoring'
    ) {
        pathnames = pathnames.slice(0, pathnames.length - 1);
    }

    return (
        <Breadcrumbs
            sx={{ marginLeft: '12px' }}
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
        >
            <LinkRouter to="/cluster" onClick={() => setSelectedMenu('클러스터')}>
                <HomeRoundedIcon sx={{ mr: 0.5 }} />
            </LinkRouter>
            {location.pathname !== '/cluster' &&
                pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    if (last) {
                        return (
                            <Typography color="primary" sx={{ display: 'flex', alignItems: 'center' }} key={to}>
                                {breadcrumbNameMap[to]}
                            </Typography>
                        );
                    } else {
                        if (breadcrumbNameMap[to]) {
                            return (
                                <LinkRouter navi={value} to={to} key={to}>
                                    {breadcrumbNameMap[to]}
                                </LinkRouter>
                            );
                        } else {
                            return null;
                        }
                    }
                })}
        </Breadcrumbs>
    );
};

/**
 * BreadCrumbs 컴포넌트
 */
const BreadCrumbs = () => {
    const location = useLocation();

    let pathnames = location.pathname.split('/').filter(x => x.length !== 0);
    // // 마지막 값이 int 면 제거
    // if (!isNaN(parseInt(pathnames[pathnames.length - 1]))) {
    //     pathnames = pathnames.slice(0, pathnames.length - 1);
    // }
    // 마지막 값이 int 면 제거
    if (pathnames.includes('edit') || pathnames.includes('detail') || pathnames.includes('monitoring')) {
        pathnames = pathnames.slice(0, pathnames.length - 1);
    }
    const pathname = `/${pathnames.slice(0, pathnames.length).join('/')}`;

    return (
        <S.Layout>
            <div style={{ display: 'flex' }}>
                <S.PageTitle>{breadcrumbNameMap[pathname]}</S.PageTitle>
            </div>
            <Page />
        </S.Layout>
    );
};

export default React.memo(BreadCrumbs);
