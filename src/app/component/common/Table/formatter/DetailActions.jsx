import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from '@mui/material';
import React, { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const DetailActions = ({ onClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-haspopup="true"
                onClick={handleClick}
                sx={{ padding: '5px' }}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu id="long-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuList sx={{ padding: 0 }}>
                    <MenuItem
                        onClick={e => {
                            onClick(e);
                            handleClose();
                        }}
                    >
                        <ListItemIcon>
                            <VisibilityOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText>상세보기</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    );
};

export default DetailActions;
