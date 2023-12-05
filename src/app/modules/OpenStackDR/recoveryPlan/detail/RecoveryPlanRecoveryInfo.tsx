import React from 'react';
import { useLocation } from 'react-router-dom';
import TabList from '@mui/lab/TabList/TabList';
import { Tab, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import TabContext from '@mui/lab/TabContext/TabContext';
import styled from 'styled-components';
import TabPanel from '@mui/lab/TabPanel/TabPanel';

import { recoveryPlanKeys } from '../../../../../libs/utils/queryKeys';
import { _getRecoveryPlan } from '../../../../../api/dr/recoveryPlan';
import { Detail } from '../../../../component/common/Detail/Detail';
import RecoveryInfo from './RecoveryInfo';

/**
 * 복구계획의 복구정보를 보여주는 컴포넌트
 */
const RecoveryPlanRecoveryInfo = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const PlanID = location.state.PlanID;
    const GroupID = location.state.GroupID;

    const [value, setValue] = React.useState('1');
    const handleChange = (event: any, newValue: string) => {
        setValue(newValue);
    };

    // 복구계획을 조회하는 함수
    const { data: recoveryPlanDetail } = useQuery(
        recoveryPlanKeys.detail(GroupID, PlanID),
        () => _getRecoveryPlan(GroupID, PlanID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.plan;
                }
            },
            suspense: true,
        },
    );

    return (
        <Detail>
            <Detail.Title text={'복구정보'} />
            <Detail.Body>
                <TabContext value={value}>
                    <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                        scrollButtons="auto"
                        variant="scrollable"
                    >
                        <Tab label={<Typography>{t('DR.TENANT')}</Typography>} value="1" />
                        <Tab label={<Typography>{t('DR.AVAILABILITY_ZONE')}</Typography>} value="2" />
                        <Tab label={<Typography>{t('DR.VOLUME')}</Typography>} value="3" />
                        <Tab label={<Typography>{'스토리지'}</Typography>} value="4" />
                        <Tab label={<Typography>{t('DR.NETWORK')}</Typography>} value="5" />
                        <Tab label={<Typography>{t('DR.INSTANCE')}</Typography>} value="6" />
                    </TabList>
                    <StyledPanel value="1">
                        <RecoveryInfo detail={recoveryPlanDetail.detail?.tenants ?? []} value={'tenants'} />
                    </StyledPanel>
                    <StyledPanel value="2">
                        <RecoveryInfo
                            detail={recoveryPlanDetail.detail?.availability_zones ?? []}
                            value={'availability_zones'}
                        />
                    </StyledPanel>
                    <StyledPanel value="3">
                        <RecoveryInfo detail={recoveryPlanDetail.detail?.volumes ?? []} value={'volumes'} />
                    </StyledPanel>
                    <StyledPanel value="4">
                        <RecoveryInfo detail={recoveryPlanDetail.detail?.storages ?? []} value={'storages'} />
                    </StyledPanel>
                    <StyledPanel value="5">
                        <RecoveryInfo
                            detail={recoveryPlanDetail.detail?.external_networks ?? []}
                            value={'external_networks'}
                        />
                    </StyledPanel>
                    <StyledPanel value="6">
                        <RecoveryInfo detail={recoveryPlanDetail.detail?.instances ?? []} value={'instances'} />
                    </StyledPanel>
                </TabContext>
            </Detail.Body>
        </Detail>
    );
};

export default RecoveryPlanRecoveryInfo;

const StyledPanel = styled(TabPanel)`
    display: flex;
    padding: 0;
    flex-direction: column;
    height: 100%;

    & > .MuiCardContent-root {
        height: 100%;
        display: flex;
        flex-direction: column;

        & > div {
            height: 100%;
            display: flex;
            flex-direction: column;

            & > .MuiBox-root {
                height: 100%;
                padding-bottom: 0;
            }
        }
    }
`;
