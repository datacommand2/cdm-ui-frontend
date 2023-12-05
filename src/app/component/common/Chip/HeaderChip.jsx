import { Chip, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { chipColor, chipText } from '../../../../constant/chipdata';

const HeaderChip = ({ label, color, size = 'medium' }) => {
    return <StyledChip label={<Typography>{chipText[label]}</Typography>} color={chipColor[color]} size={size} />;
};

export default HeaderChip;

const StyledChip = styled(Chip)`
    border-radius: 10px;
    margin-right: 0.5rem;
`;
