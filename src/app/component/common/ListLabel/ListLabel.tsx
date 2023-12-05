import { Box, IconButton, Tooltip, Typography, styled as MuiStyled } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import styled from 'styled-components';
import { DragEvent } from 'react';

type LabelType = {
    isHover: boolean;
    name: string;
    id: number;
    clickDetail: (event: React.KeyboardEvent | React.MouseEvent) => void;
    movable?: boolean;
};

const onDragStart = (event: DragEvent<HTMLDivElement>, id: string | number, name: string) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow/id', id.toString());
    event.dataTransfer.setData('application/reactflow/name', name);
    event.dataTransfer.setData('application/reactflow', 'default');
};

const ListLabel = ({ isHover, name, id, clickDetail, movable = true }: LabelType) => {
    if (isHover) {
        return (
            <StyledBox
                draggable={movable}
                style={movable ? { cursor: 'grab' } : { cursor: 'pointer' }}
                onDragStart={e => {
                    if (movable) {
                        onDragStart(e, id, name);
                    }
                }}
            >
                <Tooltip key={id} title={<Typography>{name}</Typography>}>
                    <Typography>{name}</Typography>
                </Tooltip>
                <Tooltip title={<Typography>상세보기</Typography>}>
                    <StyledIconButton onClick={clickDetail}>
                        <VisibilityOutlinedIcon />
                    </StyledIconButton>
                </Tooltip>
            </StyledBox>
        );
    } else {
        return (
            <StyledBox
                draggable={movable}
                style={movable ? { cursor: 'grab' } : { cursor: 'pointer' }}
                onDragStart={e => {
                    if (movable) {
                        onDragStart(e, id, name);
                    }
                }}
            >
                <Tooltip key={id} title={<Typography>{name}</Typography>}>
                    <Typography>{name}</Typography>
                </Tooltip>
            </StyledBox>
        );
    }
};

export default ListLabel;

const StyledBox = styled(Box)`
    display: flex;
    justify-content: space-between;
`;
const StyledIconButton = MuiStyled(IconButton)(({ theme }) => ({
    padding: '0 5px 0 0',

    '& svg': {
        color: `${theme.palette.text.primary} !important`,
    },
}));
