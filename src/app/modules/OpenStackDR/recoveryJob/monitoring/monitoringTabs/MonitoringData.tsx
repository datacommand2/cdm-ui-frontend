import { Card, CardContent, Typography } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import TableChip from '../../../../../component/common/Chip/TableChip';
import NewDateFormatter from '../../../../../component/common/Table/formatter/NewDateFormatter';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../../component/common/ListToolBar/ListToolBar';
import ListTableForm from '../../../../../component/common/ListTableForm/ListTableForm';
import { findLastWord } from '../../../../../../libs/utils/commonFunction';
import TableHeader from '../../../../../component/common/Table/TableHeader';
import NoPageTable from '../../../../../component/common/Table/NoPageTable';

const columnHelper = createColumnHelper<any>();

const monitoringTitle = {
    floating_ip: '플로팅 아이피',
    instance_spec: '인스턴스 스펙',
    instance: '인스턴스',
    network: '네트워크',
    router: '라우터',
    security_group: '보안그룹',
    subnet: '서브넷',
    tenant: '테넌트',
    keypair: '키페어',
    volume: '볼륨',
};

type MonitoringType =
    | 'floating_ip'
    | 'instance_spec'
    | 'instance'
    | 'network'
    | 'router'
    | 'security_group'
    | 'subnet'
    | 'tenant'
    | 'keypair'
    | 'volume';

interface MonitoringDataProps {
    data: any;
    type: MonitoringType;
}

/**
 * 복구작업 데이터 모니터링 정보를 보여주는 컴포넌트
 */
const MonitoringData = ({ data, type }: MonitoringDataProps) => {
    const { t } = useTranslation();
    const [inputData, setInputData] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [searchFlag, setSearchFlag] = useState(false);

    const getStateText = (type: MonitoringType, stateCode: string | undefined, resultCode: string | undefined) => {
        const state = findLastWord(stateCode);
        const result = findLastWord(resultCode);

        if (state === '' && result === '') {
            return 'preparing';
        }
        if (!resultCode) {
            return state;
        }
        if (type === 'instance' || type === 'volume') {
            if (result === 'failed') {
                if (state === 'failed') {
                    return result;
                } else {
                    return state;
                }
            } else {
                return result;
            }
        } else {
            if (resultCode) {
                return result;
            } else {
                return state;
            }
        }
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor(`${type}.id`, {
                header: () => <TableHeader text={'순서'} />,
                cell: ({ row }) => <Typography>{row.index + 1}</Typography>,
            }),
            columnHelper.accessor(`${type}.name`, {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ row }) => (
                    <Typography>
                        {row.original?.[type]?.name ? row.original?.[type]?.name : row.original?.[type]?.uuid}
                    </Typography>
                ),
            }),
            columnHelper.accessor('state_code', {
                header: () => <TableHeader text={'상태'} />,
                cell: props => (
                    <TableChip
                        color={getStateText(type, props.row.original.state_code, props.row.original.result_code)}
                        label={getStateText(type, props.row.original.state_code, props.row.original.result_code)}
                    />
                ),
            }),
            columnHelper.accessor('failed_reason.code', {
                header: () => <TableHeader text={'원인'} />,
                cell: ({ row }) => <Typography>{row.original?.failed_reason?.code}</Typography>,
            }),
            columnHelper.accessor('started_at', {
                header: () => <TableHeader text={'시작시간'} />,
                cell: props => <NewDateFormatter data={props} type={'started_at'} />,
            }),
            columnHelper.accessor('finished_at', {
                header: () => <TableHeader text={'종료시간'} />,
                cell: props => <NewDateFormatter data={props} type={'finished_at'} />,
            }),
        ],
        [type],
    );

    // 검색 버튼을 눌렀을 때 검색된 결과를 보여준다.
    const inputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTableLoading(true);
        if (inputData !== '') {
            setFilteredData(data.filter((v: any) => v[type].name.includes(inputData)));
        } else {
            setFilteredData(data);
        }

        // 검색결과 데이터를 따로 저장하고 플래그를 true
        setTimeout(() => {
            setTableLoading(false);
            setSearchFlag(true);
        }, 500);
    };

    // input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target.value);
    };

    return (
        <Card variant="outlined" className="table-list">
            <CardContent>
                <DetailTitle>{monitoringTitle[type]} 진행 상황</DetailTitle>
                <ListToolBarWrapper>
                    <ListToolBar>
                        <ListButtonWrapper>{}</ListButtonWrapper>
                        <ListSearchBarWrapper>
                            <ListTableForm inputSubmit={inputSubmit}>
                                <ListTableForm.Search
                                    placeholder={t('DR.NAME')}
                                    value={inputData}
                                    onChange={handleChange}
                                />
                            </ListTableForm>
                        </ListSearchBarWrapper>
                    </ListToolBar>
                </ListToolBarWrapper>

                <NoPageTable
                    columns={columns}
                    data={!searchFlag ? data : filteredData ?? []}
                    isLoading={tableLoading}
                    noDataMessage={'데이터가 존재하지 않습니다.'}
                />
            </CardContent>
        </Card>
    );
};

export default MonitoringData;

const DetailTitle = styled(Typography).attrs({ variant: 'h6' })`
    font-weight: 700;
    margin-bottom: 1rem;
`;
