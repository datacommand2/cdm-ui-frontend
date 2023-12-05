import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { clusterSecurityGroupKeys } from '../../../../../libs/utils/queryKeys';
import { _getClusterSecurityGroupDetail } from '../../../../../api/center/cluster';
import TableHeader from '../../../../component/common/Table/TableHeader';
import NoPageTable from '../../../../component/common/Table/NoPageTable';
import { OpenStackSecurityGroupRule } from '../../../../../@types/Cluster/clusterService';
import { DetailDrawer } from '../../../../component/common/DetailDrawer/DetailDrawer';

const columnHelper = createColumnHelper<OpenStackSecurityGroupRule>();

interface SecurityGroupDetail {
    securityGroupID: number;
    clusterID: number;
}
/**
 * 클러스터 아이디와 보안그룹 아이디를 받아와서 보안그룹 상세정보를 출력하는 컴포넌트
 */
const SecurityDetail = ({ securityGroupID, clusterID }: SecurityGroupDetail) => {
    const { t } = useTranslation();

    // 클러스터 보안그룹 상세 정보를 불러오는 함수
    const { data: securityGroupDetail } = useQuery(
        clusterSecurityGroupKeys.detail(clusterID, securityGroupID),
        () => _getClusterSecurityGroupDetail(clusterID, securityGroupID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.security_group;
                }
            },
            suspense: true,
        },
    );

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: () => <TableHeader text={'규칙'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('uuid', {
                header: () => <TableHeader text={'UUID'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('description', {
                header: () => <TableHeader text={'설명'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('direction', {
                header: () => <TableHeader text={'규칙 방향'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('network_cidr', {
                header: () => <TableHeader text={'원격 IP 접두사'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('port_range_min', {
                header: () => <TableHeader text={'포트 범위'} />,
                cell: ({ row }) => (
                    <Typography>{`${row.original?.port_range_min ?? ''} ~ ${
                        row.original?.port_range_max ?? ''
                    }`}</Typography>
                ),
            }),
            columnHelper.accessor('protocol', {
                header: () => <TableHeader text={'프로토콜'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
        ],
        [],
    );

    return (
        <DetailDrawer>
            <DetailDrawer.Title text={securityGroupDetail?.name} />
            <DetailDrawer.ContentHeader text={t('DR.SECURITY_GROUP_INFO')} />
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={'UUID'} />
                <DetailDrawer.ContentBody>{securityGroupDetail?.uuid}</DetailDrawer.ContentBody>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentTitle text={t('TABLE.DESCRIPTION')} />
                <DetailDrawer.ContentBody>{securityGroupDetail?.description}</DetailDrawer.ContentBody>
            </DetailDrawer.ContentWrapper>
            <DetailDrawer.ContentHeader text={t('GLOBAL.RULE')} />
            <StyledBox>
                <NoPageTable
                    columns={columns}
                    data={securityGroupDetail?.rules ?? []}
                    noDataMessage={'보안그룹 규칙이 존재하지 않습니다.'}
                />
            </StyledBox>
        </DetailDrawer>
    );
};

export default SecurityDetail;

const StyledBox = styled(Box)`
    & > div {
        padding: 0;
    }
`;
