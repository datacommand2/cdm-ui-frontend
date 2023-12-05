import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import { Button, CardContent, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { _getUserGroupList } from '../../../../../../../api/cloud/identity';
import { userGroupKeys } from '../../../../../../../libs/utils/queryKeys';
import CustomCardHeader from '../../../../../../component/common/CardHeader/CustomCardHeader';
import TreeListSkeleton from '../../../../../../component/common/Skeleton/TreeListSkeleton';
import { CreateGroup } from './CreateGroup';

export function UserGroupList({ onClickOneGroup, selectedGroupId }) {
    const { t } = useTranslation();
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

    const {
        data: userGroupList,
        isLoading: groupLoading,
        refetch: getUserGroupList,
    } = useQuery(userGroupKeys.lists(), () => _getUserGroupList(), {
        select: ([data, error, status]) => {
            if (status === 200 || status === 201) {
                return data.groups;
            } else if (status === 204) {
                toast.warn(t('CLOUD.USER.ACCOUNT.NO_GROUP'));
                return [];
            } else {
                throw new Error('');
            }
        },
        // staleTime: StaleTime, // 5 mins,
    });

    // List 그룹 목록을 렌더링하는 함수
    const renderGroups = selectedGroupId => {
        if (userGroupList) {
            const list = userGroupList.map(group => {
                return (
                    <ListItemButton
                        key={group.id}
                        id={group.id}
                        onClick={e => {
                            e.preventDefault();
                            onClickOneGroup(e);
                        }}
                        selected={selectedGroupId === group.id}
                        name={group.name}
                    >
                        <ListItemText primary={group.name} />
                    </ListItemButton>
                );
            });
            return list;
        }
    };

    return (
        <>
            <CustomCardHeader
                title={t('CLOUD.USER.GROUP.USER_GROUP')}
                headerAction={
                    <StyledAddButton
                        color="primary"
                        onClick={() => {
                            setShowCreateGroupModal(true);
                        }}
                    >
                        <AddIcon />
                        <Typography>{t('BUTTON.ADD')}</Typography>
                    </StyledAddButton>
                }
            />
            <CardContent>
                <List component="nav">{!groupLoading ? renderGroups(selectedGroupId) : <TreeListSkeleton />}</List>
            </CardContent>

            {showCreateGroupModal && (
                <CreateGroup
                    open={showCreateGroupModal}
                    onClose={() => {
                        setShowCreateGroupModal(false);
                    }}
                    onConfirm={() => getUserGroupList()}
                />
            )}
        </>
    );
}
const StyledAddButton = styled(Button).attrs({ variant: 'contained' })`
    height: 100%;
`;
