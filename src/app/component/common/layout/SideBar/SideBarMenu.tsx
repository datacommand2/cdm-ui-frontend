import React, { useState } from 'react';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
import Toolbar from '@mui/material/Toolbar';
import { useLocation, useNavigate } from 'react-router-dom';
import Collapse from '@mui/material/Collapse';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import StorageIcon from '@mui/icons-material/Storage';
import LockIcon from '@mui/icons-material/Lock';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import NoteIcon from '@mui/icons-material/Note';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { useIsMenuOpen, useSelectedMenu } from '../../../../../recoil/atom/Global';

import * as S from './SidebarMenu.style';
import { PATHNAME } from '../../../../../constant/pathname';
import { LoginUser } from '../../../../../recoil/atom/LoginUser';

interface SidebarMenu {
    title: string;
    list: SidebarMenuItem[];
}

interface SidebarMenuItem {
    name: string;
    icon: JSX.Element;
    value: string;
    children?: {
        name: string;
        icon: JSX.Element;
        value: string;
        children?: {
            name: string;
            icon: JSX.Element;
            value: string;
        }[];
    }[];
}

// const DashBoard = {
//     title: '대시보드',
//     list: [{ name: '대시보드', icon: <InboxIcon fontSize="small" />, value: '/dashboard' }],
// } as SidebarMenu;

const Cluster = {
    title: '클러스터',
    list: [{ name: '클러스터', icon: <StorageIcon />, value: '/cluster' }],
} as SidebarMenu;

const OpenStack = {
    title: '재해복구(OpenStack)',
    list: [
        { name: '보호그룹', icon: <LockIcon />, value: PATHNAME.OPENSTACK_GROUP },
        { name: '복구계획', icon: <AccountTreeIcon />, value: PATHNAME.OPENSTACK_PLAN },
        { name: '복구작업', icon: <RestorePageIcon />, value: PATHNAME.OPENSTACK_JOB },
        { name: '복구결과', icon: <NoteIcon />, value: PATHNAME.OPENSTACK_RESULT },
    ],
} as SidebarMenu;

const Admin = {
    title: '관리자',
    list: [
        {
            name: '관리자',
            icon: <SupervisorAccountIcon />,
            value: 'firstNestedMenu',
            children: [
                {
                    name: '사용자',
                    icon: <PersonIcon />,
                    value: 'secondNestedMenu1',
                    children: [
                        {
                            name: '사용자 계정',
                            icon: <FiberManualRecordRoundedIcon />,
                            value: PATHNAME.USER,
                        },
                        // TODO: 2023-09-07 기준
                        // 현재 owner group 정의가 완벽하지 않아서 default group의 id : 1 을 하드코딩으로 넣어줌
                        // 추후 owner group 정의가 완벽하게 되거나, 변경되면 이 코드를 수정해야한다.
                        // {
                        //     name: '사용자 그룹',
                        //     icon: <FiberManualRecordRoundedIcon />,
                        //     value: PATHNAME.GROUP,
                        // },
                    ],
                },
                {
                    name: '설정',
                    icon: <SettingsOutlinedIcon />,
                    value: 'settingNestedMenu',
                    children: [
                        {
                            name: '서비스 설정',
                            icon: <FiberManualRecordRoundedIcon />,
                            value: PATHNAME.SERVICE_CONFIG,
                        },
                    ],
                },
            ],
        },
    ],
} as SidebarMenu;

/**
 * 사이드바 메뉴 리스트
 */
const SideBarMenu = () => {
    const [firstNestedMenuOpen, setFirstNestedMenuOpen] = useState(false);
    const [secondNestedMenuOpen, setSecondNestedMenuOpen] = useState(false);
    const [settingNestedMenuOpen, setSettingNestedMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const authInfo = useRecoilValue(LoginUser);
    const role = authInfo?.roles?.[0]?.role ?? 'user';

    // const queryClient = useQueryClient();

    /**
     * 메뉴 클릭
     */
    const [, setIsMenuOpen] = useIsMenuOpen();
    const [, setSelectedMenu] = useSelectedMenu();
    const onClick = (e: React.SyntheticEvent) => {
        const menu = e.currentTarget.id;
        navigate(`${menu}`, { state: { page: 'list' } });
        setIsMenuOpen(false);
        setSelectedMenu(menu);
    };

    const onFirstNestedClick = () => {
        setFirstNestedMenuOpen(!firstNestedMenuOpen);
    };
    const onSecondNestedClick = () => {
        setSecondNestedMenuOpen(!secondNestedMenuOpen);
    };
    const onSettingNestedClick = () => {
        setSettingNestedMenuOpen(!settingNestedMenuOpen);
    };

    /**
     * 사이드바 메뉴 렌더링
     */
    const sideBarMenuList = (menu: SidebarMenu) => {
        return (
            <MenuList>
                <Typography tabIndex={-1} variant="body2" sx={{ padding: '8px 0', fontWeight: '700' }}>
                    {menu.title}
                </Typography>
                {menu.list.map(item => {
                    if (item.value === 'firstNestedMenu') {
                        return (
                            <div key={item.name}>
                                <MenuItem
                                    tabIndex={0}
                                    sx={{ marginTop: '3px' }}
                                    key={item.name}
                                    id={item.value}
                                    onClick={onFirstNestedClick}
                                    selected={location.pathname.includes(item.value.replace('/', ''))}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.name} />
                                    {firstNestedMenuOpen ? <ExpandLess /> : <ExpandMore />}
                                </MenuItem>
                                <Collapse in={firstNestedMenuOpen} unmountOnExit>
                                    {nestedMenuRender(item)}
                                </Collapse>
                            </div>
                        );
                    } else {
                        return (
                            <MenuItem
                                tabIndex={0}
                                sx={{ marginTop: '3px' }}
                                key={item.name}
                                id={item.value}
                                onClick={onClick}
                                selected={location.pathname.includes(item.value.replace('/', ''))}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.name} />
                            </MenuItem>
                        );
                    }
                })}
            </MenuList>
        );
    };

    const nestedMenuRender = (item: SidebarMenuItem) => {
        return (
            <MenuList>
                {item.children
                    ? item.children.map(i => {
                          if (i.value === 'secondNestedMenu1') {
                              return (
                                  <div key={i.name}>
                                      <MenuItem
                                          tabIndex={0}
                                          sx={{ marginTop: '3px', paddingLeft: '36px' }}
                                          key={i.name}
                                          id={i.value}
                                          onClick={onSecondNestedClick}
                                      >
                                          <ListItemIcon>{i.icon}</ListItemIcon>
                                          <ListItemText primary={i.name} />
                                          {secondNestedMenuOpen ? <ExpandLess /> : <ExpandMore />}
                                      </MenuItem>
                                      <Collapse in={secondNestedMenuOpen} unmountOnExit>
                                          <MenuList>
                                              {i.children
                                                  ? i.children.map(v => {
                                                        return (
                                                            <MenuItem
                                                                tabIndex={0}
                                                                sx={{ marginTop: '3px', paddingLeft: '36px' }}
                                                                key={v.name}
                                                                id={v.value}
                                                                onClick={onClick}
                                                                selected={location.pathname.includes(v.value)}
                                                            >
                                                                <ListItemIcon sx={{ scale: '0.4' }}>
                                                                    {v.icon}
                                                                </ListItemIcon>
                                                                <ListItemText primary={v.name} />
                                                            </MenuItem>
                                                        );
                                                    })
                                                  : null}
                                          </MenuList>
                                      </Collapse>
                                  </div>
                              );
                          } else if (i.value === 'settingNestedMenu') {
                              return (
                                  <div key={i.name}>
                                      <MenuItem
                                          tabIndex={0}
                                          sx={{ marginTop: '3px', paddingLeft: '36px' }}
                                          key={i.name}
                                          id={i.value}
                                          onClick={onSettingNestedClick}
                                      >
                                          <ListItemIcon>{i.icon}</ListItemIcon>
                                          <ListItemText primary={i.name} />
                                          {settingNestedMenuOpen ? <ExpandLess /> : <ExpandMore />}
                                      </MenuItem>
                                      <Collapse in={settingNestedMenuOpen} unmountOnExit>
                                          <MenuList>
                                              {i.children
                                                  ? i.children.map(v => {
                                                        return (
                                                            <MenuItem
                                                                tabIndex={0}
                                                                sx={{ marginTop: '3px', paddingLeft: '36px' }}
                                                                key={v.name}
                                                                id={v.value}
                                                                onClick={onClick}
                                                                selected={location.pathname.includes(v.value)}
                                                            >
                                                                <ListItemIcon sx={{ scale: '0.4' }}>
                                                                    {v.icon}
                                                                </ListItemIcon>
                                                                <ListItemText primary={v.name} />
                                                            </MenuItem>
                                                        );
                                                    })
                                                  : null}
                                          </MenuList>
                                      </Collapse>
                                  </div>
                              );
                          } else {
                              return (
                                  <MenuItem
                                      tabIndex={0}
                                      sx={{ marginTop: '3px', paddingLeft: '36px' }}
                                      key={i.name}
                                      id={i.value}
                                      onClick={onClick}
                                      selected={location.pathname.includes(i.value)}
                                  >
                                      <ListItemIcon>{i.icon}</ListItemIcon>
                                      <ListItemText primary={i.name} />
                                  </MenuItem>
                              );
                          }
                      })
                    : null}
            </MenuList>
        );
    };
    // => MenuList Component
    return (
        <div>
            <StyledToolbar>
                <S.LogoWrapper onClick={() => navigate('/cluster')}>
                    <S.Logo />
                    <S.LogoText>CDM CLOUD</S.LogoText>
                </S.LogoWrapper>
            </StyledToolbar>
            {/* {sideBarMenuList(DashBoard)} */}
            {sideBarMenuList(Cluster)}
            {sideBarMenuList(OpenStack)}

            {(role === 'admin' || role === 'manager') && sideBarMenuList(Admin)}
        </div>
    );
};

export default SideBarMenu;

const StyledToolbar = styled(Toolbar)`
    margin-bottom: 1rem;
    padding-left: 0;
`;
