import React from 'react';
import Chip from '@mui/material/Chip';
import styled from 'styled-components';

import { chipColor, chipText } from '../../../../constant/chipdata';
import { Tooltip } from '@mui/material';

/**
 * TableChip 컴포넌트
 */
const TableChip = ({ id = 0, color, label, action = () => {}, type = 'none' }) => {
    if (
        chipColor[color] === 'warning' ||
        (chipColor[color] === 'error' && !label?.includes('failed')) ||
        chipText[label] === 'PREPARE'
    ) {
        return <CustomChip label={chipText[label]} color={chipColor[color]} size="small" onClick={action} />;
    } else {
        if (type === 'recovery-result') {
            return (
                <Tooltip title={`Result ID : ${id}`}>
                    <CustomChip label={chipText[label]} color={chipColor[color]} size="small" onClick={action} />
                </Tooltip>
            );
        } else {
            return <CustomChip label={chipText[label]} color={chipColor[color]} size="small" />;
        }
    }
};

export default TableChip;

const CustomChip = styled(Chip)``;
