import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Divider, Tooltip, Typography } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import ErrorIcon from '@mui/icons-material/Error';
import { useTranslation } from 'react-i18next';

import { clusterNetworkKeys } from '../../../../../libs/utils/queryKeys';
import { _getClusterNetworkDetail } from '../../../../../api/center/cluster';
import TableHeader from '../../../../component/common/Table/TableHeader';
import TableChip from '../../../../component/common/Chip/TableChip';
import NoPageTable from '../../../../component/common/Table/NoPageTable';
import { OpenStackNetworkSubnet } from '../../../../../@types/Cluster/clusterService';
import { DetailDrawer } from '../../../../component/common/DetailDrawer/DetailDrawer';
import { findLastWord } from '../../../../../libs/utils/commonFunction';

const columnHelper = createColumnHelper<OpenStackNetworkSubnet>();

interface NetworkDetailProps {
    networkID: number;
    clusterID: number;
}

/**
 * 네트워크 아이디를 받아와서 상세 정보를 출력한다.
 */
const NetworkDetail = ({ networkID, clusterID }: NetworkDetailProps) => {
    const { t } = useTranslation();
    // 클러스터 네트워크 상세 정보를 불러오는 함수

    const { data: networkDetail } = useQuery(
        clusterNetworkKeys.detail(clusterID, networkID),
        () => _getClusterNetworkDetail(clusterID, networkID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return {
                        network: data.network,
                        subnets: data.network?.subnets ?? [],
                        status,
                    };
                }
            },
            suspense: true,
        },
    );

    const columns = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('uuid', {
                header: () => <TableHeader text={'UUID'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('network_cidr', {
                header: () => <TableHeader text={'네트워크 주소'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('gateway_ip_address', {
                header: () => <TableHeader text={'게이트웨이 주소'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('gateway_enabled', {
                header: () => {
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <TableHeader text={'라우팅 여부'} />
                            <Tooltip title={<Typography>외부 네트워크 연결 여부</Typography>}>
                                <div style={{ display: 'flex' }}>
                                    <ErrorIcon />
                                </div>
                            </Tooltip>
                        </div>
                    );
                },
                cell: props => {
                    return <Typography>{props.row.original?.gateway_enabled ? 'O' : 'X'}</Typography>;
                },
            }),
        ],
        [],
    );

    return (
        <DetailDrawer>
            <DetailDrawer.Title text={networkDetail?.network.name} />
            <DetailDrawer.ContentHeader text={t('DR.NETWORK_INFO')} />
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={'UUID'} />
                <DetailDrawer.ContentBody>{networkDetail?.network.uuid}</DetailDrawer.ContentBody>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={t('DR.TENANT')} />
                <DetailDrawer.ContentBody>{networkDetail?.network.tenant.name}</DetailDrawer.ContentBody>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={t('DR.TYPE')} />
                <DetailDrawer.ContentBody>{findLastWord(networkDetail?.network.type_code)}</DetailDrawer.ContentBody>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={t('DR.EXTERNAL')} />
                <DetailDrawer.ContentBody>{networkDetail?.network?.external_flag ? 'O' : 'X'}</DetailDrawer.ContentBody>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={'Status'} />
                <DetailDrawer.ContentBodyDiv>
                    <TableChip label={networkDetail?.network.status} color={networkDetail?.network.status} />
                </DetailDrawer.ContentBodyDiv>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={'State'} />
                <DetailDrawer.ContentBodyDiv>
                    <TableChip label={networkDetail?.network.state} color={networkDetail?.network.state} />
                </DetailDrawer.ContentBodyDiv>
            </DetailDrawer.ContentWrapper>
            <Divider />
            <DetailDrawer.ContentHeader text={'라우터 목록'} />
            <NoPageTable
                columns={columns}
                data={networkDetail?.subnets ?? []}
                noDataMessage={'라우터 목록이 존재하지 않습니다.'}
            />
        </DetailDrawer>
    );
};

export default NetworkDetail;
