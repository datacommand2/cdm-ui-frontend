import React from 'react';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import styled from 'styled-components';
import { Card } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSignal } from '@preact/signals-react';

import CustomCardHeader from '@component/common/CardHeader/CustomCardHeader';

import { UserGroupList } from './list/UserGroupList';
import UserGroupDetail from './detail/UserGroupDetail';
import UserInGroup from './detail/UserInGroup';

/**
 * usergroup 컴포넌트
 */
export const UserGroup = () => {
    const { t } = useTranslation();
    // 클릭한 목록 id
    const selectedGroupId = useSignal(null);
    const initClick = useSignal(false);

    // List 그룹 목록 중 하나를 선택했을 때
    const onClickOneGroup = (e) => {
        const id = e.currentTarget.id;
        // 그룹 상세
        initClick.value = true;
        selectedGroupId.value = id;
    };

    return (
        <GridWrapper>
            <SideBar>
                <Card variant="outlined">
                    <UserGroupList onClickOneGroup={onClickOneGroup} selectedGroupId={selectedGroupId.value} />
                </Card>
            </SideBar>

            {initClick ? (
                <DataList style={{ display: 'flex', flexDirection: 'column' }}>
                    <Card sx={{ marginBottom: '1rem' }} variant="outlined">
                        <CustomCardHeader title={t('CLOUD.USER.GROUP.GROUP_DETAILS')} />
                        <UserGroupDetail
                            selectedGroupId={selectedGroupId.value}
                            setInitClick={value => (initClick.value = value)}
                        />
                    </Card>
                    <Card
                        variant="outlined"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: '1 1 auto',
                        }}
                    >
                        <CustomCardHeader title={t('CLOUD.USER.GROUP.USER_LIST')} />
                        <UserInGroup selectedGroupId={selectedGroupId.value} />
                    </Card>
                </DataList>
            ) : null}
        </GridWrapper>
    );
};

const GridWrapper = styled(Grid2).attrs({
    container: true,
    columns: { xs: 3, sm: 9, md: 12 },
    spacing: { xs: 1, md: 2 },
})`
    height: 100%;
`;

const SideBar = styled(Grid2).attrs({ xs: 3, sm: 9, md: 3 })`
    & > div {
        height: 100%;
    }
`;
const DataList = styled(Grid2).attrs({ xs: 3, sm: 9, md: 9 })``;
