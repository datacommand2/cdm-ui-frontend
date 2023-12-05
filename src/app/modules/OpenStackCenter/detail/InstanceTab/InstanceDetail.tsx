import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { clusterInstanceKeys } from '../../../../../libs/utils/queryKeys';
import { _getClusterInstanceDetail } from '../../../../../api/center/cluster';
import TableHeader from '../../../../component/common/Table/TableHeader';
import TableChip from '../../../../component/common/Chip/TableChip';
import NoPageTable from '../../../../component/common/Table/NoPageTable';
import { formatBytes } from '../../../../../libs/utils/commonFunction';
import InstanceScript from './InstanceScript';
import {
    OpenStackInstanceNetwork,
    OpenStackInstanceVolume,
    OpenStackSecurityGroupDetail,
} from '../../../../../@types/Cluster/clusterService';
import { DetailDrawer } from '../../../../component/common/DetailDrawer/DetailDrawer';
import CustomDivider from '../../../../component/common/Divider/CustomDivider';
import styled from 'styled-components';

const networkColumnHelper = createColumnHelper<OpenStackInstanceNetwork>();
const volumeColumnHelper = createColumnHelper<OpenStackInstanceVolume>();
const securityGroupColumnHelper = createColumnHelper<OpenStackSecurityGroupDetail>();
interface NetworkDetailProps {
    instanceID: number;
    clusterID: number;
}

/**
 * 클러스터 아이디와 인스턴스 아이디를 받아와서 인스턴스 상세정보를 출력하는 컴포넌트
 */
const InstanceDetail = ({ instanceID, clusterID }: NetworkDetailProps) => {
    const { t } = useTranslation();

    const [alignment, setAlignment] = React.useState('network');

    const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
        setAlignment(newAlignment);
    };

    // 클러스터 인스턴스 상세 정보를 불러오는 함수
    const { data: instanceDetail } = useQuery(
        clusterInstanceKeys.detail(clusterID, instanceID),
        () => _getClusterInstanceDetail(clusterID, instanceID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.instance;
                }
            },
            suspense: true,
        },
    );

    const networkColumns = useMemo(
        () => [
            networkColumnHelper.accessor('network.name', {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            networkColumnHelper.accessor('subnet.name', {
                header: () => <TableHeader text={'서브넷'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            networkColumnHelper.accessor('dhcp_flag', {
                header: () => <TableHeader text={'DHCP'} />,
                cell: props => <Typography>{props.row.original?.dhcp_flag ? 'O' : 'X'}</Typography>,
            }),
            networkColumnHelper.accessor('ip_address', {
                header: () => <TableHeader text={'내부 IP'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            networkColumnHelper.accessor('floating_ip.ip_address', {
                header: () => <TableHeader text={'Floating IP'} />,
                cell: props => <Typography>{props.row.original?.floating_ip?.ip_address ? 'O' : 'X'}</Typography>,
            }),
        ],
        [],
    );

    const volumeColumns = useMemo(
        () => [
            volumeColumnHelper.accessor('volume.name', {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            volumeColumnHelper.accessor('volume.uuid', {
                header: () => <TableHeader text={'UUID'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            volumeColumnHelper.accessor('volume.size_bytes', {
                header: () => <TableHeader text={'크기'} />,
                cell: ({ getValue }) => <Typography>{formatBytes(getValue())}</Typography>,
            }),
        ],
        [],
    );

    const securityColumns = useMemo(
        () => [
            securityGroupColumnHelper.accessor('name', {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            securityGroupColumnHelper.accessor('uuid', {
                header: () => <TableHeader text={'UUID'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            securityGroupColumnHelper.accessor('description', {
                header: () => <TableHeader text={'설명'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
        ],
        [],
    );

    return (
        <>
            <DetailDrawer>
                <DetailDrawer.Title text={instanceDetail?.name} />
                <DetailDrawer.ContentHeader text={t('DR.INSTANCE_INFO')} />
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={t('DR.TENANT')} />
                    <DetailDrawer.ContentBody>{instanceDetail?.tenant.name}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={t('DR.NODE')} />
                    <DetailDrawer.ContentBody>{instanceDetail?.hypervisor.hostname}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={t('DR.AVAILABILITY_ZONE')} />
                    <DetailDrawer.ContentBody>{instanceDetail?.availability_zone.name}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'키페어'} />
                    <DetailDrawer.ContentBody>{instanceDetail?.keypair.name}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentHeader text={t('DR.STATUS_INFO')} />
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'Status'} />
                    <DetailDrawer.ContentBodyDiv>
                        <TableChip label={instanceDetail?.status} color={instanceDetail?.status} />
                    </DetailDrawer.ContentBodyDiv>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'State'} />
                    <DetailDrawer.ContentBodyDiv>
                        <TableChip label={instanceDetail?.state} color={instanceDetail?.state} />
                    </DetailDrawer.ContentBodyDiv>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'VCPUs'} />
                    <DetailDrawer.ContentBody>{instanceDetail?.spec?.vcpu_total_cnt ?? 0}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'RAM'} />
                    <DetailDrawer.ContentBody>
                        {formatBytes(instanceDetail?.spec?.mem_total_bytes)}
                    </DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'DISK'} />
                    <DetailDrawer.ContentBody>
                        {formatBytes(instanceDetail?.spec?.disk_total_bytes)}
                    </DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentHeader text={'사용자 정의 스크립트'} />
                <InstanceScript clusterID={clusterID} instanceID={instanceID} />

                <CustomDivider />
                <StyledBox>
                    <ToggleButtonGroup color="primary" value={alignment} exclusive onChange={handleChange}>
                        <ToggleButton value="network">
                            <Typography>네트워크</Typography>
                        </ToggleButton>
                        <ToggleButton value="volume">
                            <Typography>볼륨</Typography>
                        </ToggleButton>
                        <ToggleButton value="securitygroup">
                            <Typography>보안그룹</Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </StyledBox>
                {alignment === 'network' && (
                    <NoPageTable
                        columns={networkColumns}
                        data={instanceDetail?.networks ?? []}
                        noDataMessage={'네트워크 목록이 존재하지 않습니다.'}
                    />
                )}
                {alignment === 'volume' && (
                    <NoPageTable
                        columns={volumeColumns}
                        data={instanceDetail?.volumes ?? []}
                        noDataMessage={'볼륨 목록이 존재하지 않습니다.'}
                    />
                )}
                {alignment === 'securitygroup' && (
                    <NoPageTable
                        columns={securityColumns}
                        data={instanceDetail?.security_groups ?? []}
                        noDataMessage={'보안그룹 목록이 존재하지 않습니다.'}
                    />
                )}
            </DetailDrawer>
        </>
    );
};

export default InstanceDetail;

const StyledBox = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
`;
