import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import { LoginUser } from '../../../../recoil/atom/LoginUser';

const AddButton = ({ loading, url }) => {
    const { t } = useTranslation();
    const authInfo = useRecoilValue(LoginUser);
    const role = authInfo?.roles?.[0]?.role ?? 'user';

    let buttonStyle;
    if (url.pathname.includes('recovery-job')) {
        if (role !== 'admin' && role !== 'manager' && role !== 'operator') {
            buttonStyle = { display: 'none' };
        } else {
            buttonStyle = undefined;
        }
    } else {
        if (role !== 'admin' && role !== 'manager') {
            buttonStyle = { display: 'none' };
        } else {
            buttonStyle = undefined;
        }
    }

    const navigate = useNavigate();
    const onClick = e => {
        navigate(url.pathname, {
            state: url?.state,
        });
    };
    return (
        <StyledAddButton onClick={onClick} disabled={loading} style={buttonStyle}>
            <AddIcon />
            <Typography>{t('BUTTON.ADD')}</Typography>
        </StyledAddButton>
    );
};

export default AddButton;

const StyledAddButton = styled(Button).attrs({ variant: 'contained', color: 'primary' })`
    height: 100%;
`;
