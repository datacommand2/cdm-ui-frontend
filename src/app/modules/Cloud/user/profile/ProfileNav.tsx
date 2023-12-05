import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import {
    Box,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { User } from '@/@types/Cloud/user';
import CustomDivider from '@component/common/Divider/CustomDivider';

interface ProfileNav {
    userInfo: User | undefined;
    changeComponent: (value: string) => void;
    renderComponent: string;
}

/**
 * 내 정보 사이드바 컴포넌트
 */
const ProfileNav = ({ userInfo, changeComponent, renderComponent }: ProfileNav) => {
    const { t } = useTranslation();
    const handleSelect = (value: string) => {
        changeComponent(value);
    };
    return (
        <Card variant="outlined">
            <CardContent sx={{ padding: '2rem' }}>
                <LogoWrapper>
                    <AccountCircleIcon color="disabled" sx={{ width: '80px', height: '80px' }} />
                    <Typography sx={{ fontWeight: 700 }}>{userInfo?.name}</Typography>
                </LogoWrapper>
                <InfoWrapper>
                    <Typography sx={{ fontWeight: 600 }}>{t('CLOUD.USER_MENU.USER_INFO.EMAIL')}</Typography>
                    <Typography className="muted-text">{userInfo?.email}</Typography>
                </InfoWrapper>
                <InfoWrapper>
                    <Typography sx={{ fontWeight: 600 }}>{t('CLOUD.USER_MENU.USER_INFO.CONTACT')}:</Typography>
                    <Typography className="muted-text">{userInfo?.contact}</Typography>
                </InfoWrapper>

                <CustomDivider />

                <Box sx={{ width: '100%', maxWidth: 360 }}>
                    <nav aria-label="main mailbox folders">
                        <List>
                            <CustomListitem onClick={() => handleSelect('profile_info')}>
                                <CustomListButton selected={renderComponent === 'profile_info'}>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={t('CLOUD.USER_MENU.USER_INFO.MODIFY_ACCOUNT')} />
                                </CustomListButton>
                            </CustomListitem>
                            <CustomListitem onClick={() => handleSelect('change_password')}>
                                <CustomListButton selected={renderComponent === 'change_password'}>
                                    <ListItemIcon>
                                        <LockIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={t('CLOUD.USER_MENU.USER_INFO.CHANGE_PASSWORD')} />
                                </CustomListButton>
                            </CustomListitem>
                        </List>
                    </nav>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProfileNav;

const LogoWrapper = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const InfoWrapper = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const CustomListitem = styled(ListItem)`
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0;
`;
const CustomListButton = styled(ListItemButton)``;
