import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Tab,
    Typography,
    useTheme,
} from '@mui/material';
import styled from 'styled-components';
import TabPanel from '@mui/lab/TabPanel/TabPanel';
import TabContext from '@mui/lab/TabContext/TabContext';
import TabList from '@mui/lab/TabList/TabList';
import { useTranslation } from 'react-i18next';

import { clusterInstanceKeys } from '../../../../libs/utils/queryKeys';
import { _getClusterInstanceDetail } from '../../../../api/center/cluster';
import TableHeader from '../Table/TableHeader';
import DefaultSpinner from '../Skeleton/DefaultSpinner';
import TableChip from '../Chip/TableChip';
import NoPageTable from '../Table/NoPageTable';
import ActionButton from '../Button/ActionButton';
import { formatBytes } from '../../../../libs/utils/commonFunction';

const columnHelper = createColumnHelper();

/**
 * 상세 인스턴스 정보 Dialog
 */
const InstanceDialog = ({ clusterID, instanceID, open, onClose, loading }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    console.log(instanceID);
    console.log(clusterID);

    // 클러스터 인스턴스의 상세 정보를 가져오는 함수
    const { data: instanceDetail, isLoading: detailLoading } = useQuery(
        clusterInstanceKeys.detail({ clusterId: clusterID, instanceID }),
        () => _getClusterInstanceDetail(Number(clusterID), instanceID),
        {
            select: ([data, error, status]) => {
                if (status === 200 || status === 201) {
                    return data.instance;
                }
            },
            enabled: !!instanceID,
        },
    );

    const networkColumns = useMemo(
        () => [
            columnHelper.accessor('network.name', {
                header: <TableHeader text={'이름'} />,
                cell: ({ row, getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('subnet.name', {
                header: <TableHeader text={'서브넷'} />,
                cell: ({ row, getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('dhcp_flag', {
                header: <TableHeader text={'DHCP'} />,
                cell: ({ row, getValue }) => <Typography>{row.original?.dhcp_flag ? 'O' : 'X'}</Typography>,
            }),
            columnHelper.accessor('ip_address', {
                header: <TableHeader text={'내부 IP'} />,
                cell: ({ row, getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('floating_ip.ip_address', {
                header: <TableHeader text={'Floating IP'} />,
                cell: ({ row, getValue }) => (
                    <Typography>{row.original?.floating_ip?.ip_address ? 'O' : 'X'}</Typography>
                ),
            }),
        ],
        [],
    );

    const volumeColumns = useMemo(
        () => [
            columnHelper.accessor('volume.name', {
                header: <TableHeader text={'이름'} />,
                cell: ({ row, getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('volume.uuid', {
                header: <TableHeader text={'UUID'} />,
                cell: ({ row, getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('volume.size_bytes', {
                header: <TableHeader text={'크기'} />,
                cell: ({ row, getValue }) => <Typography>{formatBytes(getValue())}</Typography>,
            }),
        ],
        [],
    );

    const securityColumns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: <TableHeader text={'이름'} />,
                cell: ({ row, getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('uuid', {
                header: <TableHeader text={'UUID'} />,
                cell: ({ row, getValue }) => <Typography>{getValue()}</Typography>,
            }),
        ],
        [],
    );
    return (
        <Dialog open={open} fullWidth maxWidth="lg">
            <DialogTitle>{t('DR.DETAILS_INFO')}</DialogTitle>
            <Divider />
            <DialogContent>
                {detailLoading ? (
                    <DefaultSpinner />
                ) : (
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label={<Typography>{t('DR.INSTANCE_INFO')}</Typography>} value="1" />
                                <Tab label={<Typography>{t('DR.NETWORK')}</Typography>} value="2" />
                                <Tab label={<Typography>{t('DR.VOLUME_SECURITY_GROUP')}</Typography>} value="3" />
                            </TabList>
                        </Box>
                        <StyledPanel value="1">
                            <Wrapper sx={{ border: `1px solid ${theme.palette.divider}` }}>
                                <Title>{t('DR.INSTANCE_INFO')}</Title>
                                <ContentWrapper>
                                    <ContentRow>
                                        <Content>
                                            <ContentTitle>{t('DR.NAME')}</ContentTitle>
                                            <ContentBody>{instanceDetail.name}</ContentBody>
                                        </Content>
                                    </ContentRow>
                                    <ContentRow>
                                        <Content>
                                            <ContentTitle>{t('DR.TENANT')}</ContentTitle>
                                            <ContentBody>{instanceDetail.tenant?.name}</ContentBody>
                                        </Content>
                                        <Content>
                                            <ContentTitle>{t('DR.NODE')}</ContentTitle>
                                            <ContentBody>{instanceDetail.hypervisor?.hostname}</ContentBody>
                                        </Content>
                                    </ContentRow>
                                    <ContentRow>
                                        <Content>
                                            <ContentTitle>{t('DR.AVAILABILITY_ZONE')}</ContentTitle>
                                            <ContentBody>{instanceDetail.availability_zone?.name}</ContentBody>
                                        </Content>
                                        <Content>
                                            <ContentTitle>keypair</ContentTitle>
                                            <ContentBody>{instanceDetail.keypair?.name}</ContentBody>
                                        </Content>
                                    </ContentRow>
                                </ContentWrapper>
                                <Title>{t('DR.STATUS_INFO')}</Title>
                                <ContentWrapper>
                                    <ContentRow>
                                        <Content>
                                            <ContentTitle>status</ContentTitle>
                                            <TableChip color={instanceDetail.status} label={instanceDetail.status} />
                                        </Content>
                                        <Content>
                                            <ContentTitle>state</ContentTitle>
                                            <TableChip color={instanceDetail.state} label={instanceDetail.state} />
                                        </Content>
                                    </ContentRow>
                                    <ContentRow>
                                        <Content>
                                            <ContentTitle>VCPUs</ContentTitle>
                                            <ContentBody>{instanceDetail.spec?.vcpu_total_cnt ?? 0}(core)</ContentBody>
                                        </Content>
                                        <Content>
                                            <ContentTitle>RAM</ContentTitle>
                                            <ContentBody>
                                                {formatBytes(instanceDetail.spec?.mem_total_bytes ?? 0)}
                                            </ContentBody>
                                        </Content>
                                        <Content>
                                            <ContentTitle>DISK</ContentTitle>
                                            <ContentBody>
                                                {formatBytes(instanceDetail.spec?.disk_total_bytes ?? 0)}
                                            </ContentBody>
                                        </Content>
                                    </ContentRow>
                                </ContentWrapper>
                            </Wrapper>
                        </StyledPanel>
                        <StyledPanel value="2">
                            <Wrapper sx={{ border: `1px solid ${theme.palette.divider}` }}>
                                <Title>{t('DR.NETWORK_INFO')}</Title>
                                <NoPageTable columns={networkColumns} data={instanceDetail?.networks ?? []} />
                            </Wrapper>
                        </StyledPanel>
                        <StyledPanel value="3">
                            <Wrapper sx={{ border: `1px solid ${theme.palette.divider}` }}>
                                <VolumeSecurityWrapper>
                                    <Title>{t('DR.VOLUME_INFO')}</Title>
                                    <NoPageTable columns={volumeColumns} data={instanceDetail?.volumes ?? []} />
                                    <Title>{t('DR.SECURITY_GROUP_INFO')}</Title>
                                    <NoPageTable
                                        columns={securityColumns}
                                        data={instanceDetail?.security_groups ?? []}
                                    />
                                </VolumeSecurityWrapper>
                            </Wrapper>
                        </StyledPanel>
                    </TabContext>
                )}
            </DialogContent>
            <Divider />
            <DialogActions>
                <ActionButton buttonType="close" onClick={onClose} />
            </DialogActions>
        </Dialog>
    );
};

export default InstanceDialog;

const StyledPanel = styled(TabPanel)`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const VolumeSecurityWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Wrapper = styled(Box)`
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 2rem;
`;

const Title = styled(Typography).attrs({ variant: 'h6' })`
    font-weight: 700;
    margin-bottom: 1rem;
`;

const ContentWrapper = styled(Box)`
    margin-bottom: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
`;

const ContentRow = styled(Box)`
    display: flex;

    ${({ theme }) => theme.breakpoints.down.md} {
        flex-direction: column;
    }
`;

const Content = styled.div`
    display: flex;
    gap: 15px;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
`;

const ContentTitle = styled(Typography)`
    font-weight: 700;
`;

const ContentBody = styled(Typography)``;
