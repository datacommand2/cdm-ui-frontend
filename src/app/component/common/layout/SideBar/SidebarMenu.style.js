import { ListItemText, Typography } from '@mui/material';
import styled from 'styled-components';

const LogoWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 12px;
    cursor: pointer;
`;

const Logo = styled.img.attrs({
    src: '/images/logos/logo-removebg.png',
    alt: 'logo',
})`
    width: 35px;
    margin-right: 10px;
`;

const LogoText = styled(Typography).attrs({ variant: 'h5' })`
    color: var(--dark-font);
`;

const Text = styled(ListItemText)`
    & > .MuiTypography-root {
    }
`;

export { LogoWrapper, Logo, LogoText, Text };
