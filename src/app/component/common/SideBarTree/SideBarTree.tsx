import { Box, Typography, useTheme } from '@mui/material';
import { TreeView } from '@mui/x-tree-view/TreeView';
import StorageIcon from '@mui/icons-material/Storage';
import React, { ReactNode } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import styled from 'styled-components';
import { getKoreanAffix } from '@/libs/utils/commonFunction';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SideBarTreeItemParams } from '@/@types';

interface SideBarTreeProps {
    EndIcon?: ReactNode;
    CollapseIcon?: ReactNode;
    ExpandIcon?: ReactNode;
    ChildIcon?: ReactNode;
    parentList: any[] | undefined;
    childrenList?: any[];
    parentTitle: string;
    parentSelect?: (params: SideBarTreeItemParams) => void;
    childrenSelect?: (params: SideBarTreeItemParams) => void;
}

/**
 * 데이터 목록화면의 왼쪽에 위치하는 트리 형태의 리스트 컴포넌트
 * @description 최대 2deps라고 가정한다. (1deps 또는 2deps 가능)
 */
const SideBarTree = ({
    EndIcon = <StorageIcon />,
    CollapseIcon = <StorageIcon />,
    ExpandIcon = <StorageIcon />,
    ChildIcon = <LockIcon />,
    parentSelect = () => {},
    childrenSelect = () => {},
    parentList,
    childrenList,
    parentTitle,
}: SideBarTreeProps) => {
    const theme = useTheme();

    return (
        <TreeView
            className={theme.palette.mode === 'light' ? 'light-tree-view' : 'dark-tree-view'}
            aria-label="file system navigator"
            sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            defaultEndIcon={EndIcon}
            defaultCollapseIcon={CollapseIcon}
            defaultExpandIcon={ExpandIcon}
        >
            {(!parentList || parentList.length === 0) && (
                <TreeNoContent>
                    <Typography>
                        {parentTitle}
                        {getKoreanAffix(parentTitle, '이가')} 존재하지 않습니다.
                    </Typography>
                </TreeNoContent>
            )}
            {parentList &&
                parentList.length > 0 &&
                parentList.map(parent => {
                    return (
                        <TreeItem
                            key={parent.id}
                            // childrenList가 없으면 아래 onClick 실행
                            onClick={() => {
                                if (childrenList && childrenList.length !== 0) return;
                                parentSelect({
                                    id: parent.id,
                                    name: parent.name,
                                    resource_name: parent.resource_name,
                                });
                            }}
                            nodeId={parent.id.toString()}
                            label={parent.name}
                        >
                            {childrenList &&
                                childrenList.length > 0 &&
                                childrenList.map(child => {
                                    if (child.data?.[0] === parent.id) {
                                        return child.data[1].map((v: any) => {
                                            return (
                                                <TreeItem
                                                    key={`children_${v.id}_${v.resource_name}`}
                                                    nodeId={`children_${v.id}_${v.resource_name}`}
                                                    endIcon={ChildIcon}
                                                    label={v.name}
                                                    onClick={() => {
                                                        childrenSelect({
                                                            id: v.id,
                                                            name: v.name,
                                                            resource_name: v.resource_name,
                                                        });
                                                    }}
                                                />
                                            );
                                        });
                                    }
                                })}
                        </TreeItem>
                    );
                })}
        </TreeView>
    );
};

export default SideBarTree;

const TreeNoContent = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
`;
