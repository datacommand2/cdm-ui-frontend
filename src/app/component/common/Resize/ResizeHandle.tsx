import { PanelResizeHandle } from 'react-resizable-panels';
import { styled as MuiStyled } from '@mui/material';

export default function ResizeHandle({ id }: { className?: string; collapsed?: boolean; id?: string }) {
    return (
        <StyledPanelResizeHandle id={id} style={{ display: 'flex', alignItems: 'center' }}></StyledPanelResizeHandle>
    );
}

const StyledPanelResizeHandle = MuiStyled(PanelResizeHandle)(({ theme }) => ({
    width: '0.13rem',
    borderRadius: '3px',
    padding: '1px',
    backgroundColor: theme.palette.divider,

    '&:hover': {
        width: '0.25rem',
    },
}));
