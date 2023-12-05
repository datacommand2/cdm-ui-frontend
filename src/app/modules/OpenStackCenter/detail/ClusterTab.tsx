import React from 'react';
import styled from 'styled-components';
import TabPanel from '@mui/lab/TabPanel/TabPanel';
import TabContext from '@mui/lab/TabContext/TabContext';
import { Tab, Typography } from '@mui/material';
import TabList from '@mui/lab/TabList/TabList';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { clusterKeys } from '../../../../libs/utils/queryKeys';
import { _getClusterDetail } from '../../../../api/center/cluster';
import { Detail } from '../../../component/common/Detail/Detail';
import NodeTab from './NodeTab/NodeTab';
import RouterTab from './RouterTab/RouterTab';
import TenantTab from './TenantTab/TenantTab';
import AvZoneTab from './AvZoneTab/AvZoneTab';
import NetworkTab from './NetworkTab/NetworkTab';
import InstacneTab from './InstanceTab/InstacneTab';
import VolumeTab from './VolumeTab/VolumeTab';
import SecurityTab from './SecurityTab/SecurityTab';
import VolumeTypeTab from './VolumeType/VolumeTypeTab';

/**
 * 클러스터 서비스 목록 탭 컴포넌트
 */
const ClusterTab = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const [value, setValue] = React.useState('1');

    const ClusterID = Number(location.state.clusterID);
    const handleChange = (event: React.SyntheticEvent, newValue: any) => {
        setValue(newValue);
    };

    // 클러스터 정보를 불러오는 함수
    const { data: clusterDetail } = useQuery(clusterKeys.detail(ClusterID), () => _getClusterDetail(ClusterID), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                return data.cluster;
            }
        },
        suspense: true,
    });

    return (
        <Detail>
            <Detail.Title text={'클러스터 서비스 목록'} />
            <Detail.Body>
                <TabContext value={value}>
                    <TabList
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                        scrollButtons="auto"
                        variant="scrollable"
                    >
                        <Tab label={<Typography>{t('DR.NODE')}</Typography>} value="1" />
                        <Tab label={<Typography>{t('DR.ROUTER')}</Typography>} value="2" />
                        <Tab label={<Typography>{t('DR.TENANT')}</Typography>} value="3" />
                        <Tab label={<Typography>{t('DR.AVAILABILITY_ZONE')}</Typography>} value="4" />
                        <Tab label={<Typography>{t('DR.NETWORK')}</Typography>} value="5" />
                        <Tab label={<Typography>{t('DR.INSTANCE')}</Typography>} value="6" />
                        <Tab label={<Typography>{t('DR.VOLUME')}</Typography>} value="7" />
                        <Tab label={<Typography>{t('DR.SECURITY_GOURP')}</Typography>} value="8" />
                        <Tab label={<Typography>{t('DR.VOLUME_TYPE')}</Typography>} value="9" />
                    </TabList>
                    {clusterDetail && (
                        <>
                            <StyledPanel value="1">
                                <NodeTab id={ClusterID} cluster={clusterDetail} />
                            </StyledPanel>
                            <StyledPanel value="2">
                                <RouterTab id={ClusterID} />
                            </StyledPanel>
                            <StyledPanel value="3">
                                <TenantTab id={ClusterID} />
                            </StyledPanel>
                            <StyledPanel value="4">
                                <AvZoneTab id={ClusterID} />
                            </StyledPanel>
                            <StyledPanel value="5">
                                <NetworkTab id={ClusterID} cluster={clusterDetail} />
                            </StyledPanel>
                            <StyledPanel value="6">
                                <InstacneTab id={ClusterID} cluster={clusterDetail} />
                            </StyledPanel>
                            <StyledPanel value="7">
                                <VolumeTab id={ClusterID} />
                            </StyledPanel>
                            <StyledPanel value="8">
                                <SecurityTab id={ClusterID} cluster={clusterDetail} />
                            </StyledPanel>
                            <StyledPanel value="9">
                                <VolumeTypeTab id={ClusterID} cluster={clusterDetail} />
                            </StyledPanel>
                        </>
                    )}
                </TabContext>
            </Detail.Body>
        </Detail>
    );
};

export default ClusterTab;

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
