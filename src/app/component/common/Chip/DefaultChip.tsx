import { Chip, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface DefaultChipProps {
    label: string | ReactNode;
    color?: any;
    onClick?: any;
    style?: any;
    disabled?: boolean;
}
const DefaultChip = ({ label, color, onClick, style = {}, disabled = false }: DefaultChipProps) => {
    if (onClick) {
        return (
            <StyledChip
                style={style}
                disabled={disabled}
                label={<Typography>{label}</Typography>}
                color={color}
                onClick={onClick}
            />
        );
    } else {
        return <StyledChip style={style} disabled={disabled} label={<Typography>{label}</Typography>} color={color} />;
    }
};

export default DefaultChip;

const StyledChip = styled(Chip)`
    border-radius: 10px;
    margin-right: 0.5rem;
`;
