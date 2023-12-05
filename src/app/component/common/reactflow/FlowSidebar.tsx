import React, { DragEvent } from 'react';
import styled from 'styled-components';
import { Box, Tooltip, Typography, styled as MuiStyled, IconButton } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { findLastWord } from '../../../../libs/utils/commonFunction';

const onDragStart = (e: DragEvent<any>, id: string | number, name: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/reactflow/id', id.toString());
    e.dataTransfer.setData('application/reactflow/name', name);
    e.dataTransfer.setData('application/reactflow', 'default');
};
interface FlowSidebarProps {
    itemList: any[];
    headerNodeID: string;
    headerTitle?: string;
    movable?: boolean;
    onClick?: any;
}

const FlowSidebar = ({ itemList = [], headerNodeID, headerTitle, movable = true, onClick }: FlowSidebarProps) => {
    return (
        <Wrapper>
            <TreeItem
                key={`${headerNodeID}_${headerTitle}`}
                nodeId={headerNodeID}
                label={<HeaderTitle>{headerTitle}</HeaderTitle>}
            >
                {itemList.length === 0
                    ? null
                    : itemList?.map((item, idx) => {
                          return (
                              <TreeItem
                                  id={item.id ?? 0}
                                  onFocusCapture={e => e.stopPropagation()}
                                  className={findLastWord(item?.result_code) === 'failed' ? 'error-text' : ''}
                                  endIcon={<GroupWorkIcon />}
                                  key={`item_${item?.id ?? idx}`}
                                  nodeId={`item_${item?.id ?? idx}`}
                                  label={
                                      <StyledLabel>
                                          <Typography
                                              draggable={movable}
                                              onDragStart={e => {
                                                  if (movable && item?.id) {
                                                      onDragStart(e, item?.id, item.name);
                                                  }
                                              }}
                                              style={movable ? { cursor: 'grab' } : { cursor: 'pointer' }}
                                          >
                                              {item.name}
                                          </Typography>
                                          {onClick && (
                                              <Tooltip title={<Typography>상세보기</Typography>}>
                                                  <StyledIconButton id={item.id ?? 0} onClick={onClick ?? null}>
                                                      <VisibilityOutlinedIcon />
                                                  </StyledIconButton>
                                              </Tooltip>
                                          )}
                                      </StyledLabel>
                                  }
                              />
                          );
                      })}
            </TreeItem>
        </Wrapper>
    );
};

export default FlowSidebar;

const StyledIconButton = MuiStyled(IconButton)(({ theme }) => ({
    padding: '0 5px 0 0',

    '& svg': {
        color: `${theme.palette.text.primary} !important`,
    },
}));

const StyledLabel = styled(Box)`
    display: flex;
    justify-content: space-between;
`;

const HeaderTitle = styled(Box)`
    font-size: ${({ theme }) => theme.fontSize.lg};
`;
const Wrapper = styled(Box)`
    width: inherit;
    display: flex;
    flex-direction: column;
    flex: 1;

    ${({ theme }) => theme.breakpoints.down.md} {
        & .MuiTreeView-root {
            max-width: initial;
        }
    }
`;
