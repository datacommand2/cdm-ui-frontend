import React, { useState, useMemo, ChangeEvent } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Card, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import NewDateFormatter from '../../../../component/common/Table/formatter/NewDateFormatter';
import TableChip from '../../../../component/common/Chip/TableChip';
import {
    ListButtonWrapper,
    ListSearchBarWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../component/common/ListToolBar/ListToolBar';
import ListTableForm from '../../../../component/common/ListTableForm/ListTableForm';
import TableHeader from '../../../../component/common/Table/TableHeader';
import ListTable from '../../../../component/common/Table/ListTable';
import { findLastWord } from '../../../../../libs/utils/commonFunction';
import { OptionType } from '../../../../../@types';

const columnHelper = createColumnHelper<any>();

interface VolumeTabProps {
    volumes: any[];
}
/**
 * 복구결과 페이지의 볼륨 탭
 */
const VolumeTab = ({ volumes }: VolumeTabProps) => {
    const { t } = useTranslation();

    const [filteredResultVolumes, setFilteredResultVolumes] = useState(volumes);
    const [filterFlag, setFilterFlag] = useState(false);

    const [inputData, setInputData] = useState('');

    // state로 filtering
    const selectState = (e: OptionType) => {
        if (e.value === '') {
            setFilterFlag(false);
        } else {
            setFilterFlag(true);
            setFilteredResultVolumes(volumes.filter(volume => findLastWord(volume.result_code) === e.value));
        }
    };

    // input으로 filtering
    const inputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFilterFlag(true);
        setFilteredResultVolumes(volumes.filter(volume => volume.protection_cluster_volume.name.includes(inputData)));
    };

    // input change
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target.value);
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor('id', {
                header: () => <TableHeader text={'순서'} />,
                cell: ({ row }) => <Typography>{row.index + 1}</Typography>,
            }),
            columnHelper.accessor('protection_cluster_volume.name', {
                header: () => <TableHeader text={'볼륨 이름'} />,
                cell: ({ row }) => (
                    <Typography>
                        {row.original?.protection_cluster_volume.name
                            ? row.original?.protection_cluster_volume.name
                            : row.original.protection_cluster_volume.uuid}
                    </Typography>
                ),
            }),
            columnHelper.accessor('result_code', {
                header: () => <TableHeader text={'상태'} />,
                cell: props => (
                    <TableChip color={props.row.original?.result_code} label={props.row.original?.result_code} />
                ),
            }),
            columnHelper.accessor('failed_reason', {
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
        [],
    );

    const volumeStateOptions = [
        { value: 'state', label: '상태', isDisabled: true },
        { value: '', label: '전체' },
        { value: 'success', label: t('DR.SUCCESS') },
        { value: 'failed', label: t('DR.FAIL') },
        { value: 'canceled', label: t('DR.CANCELED') },
    ];

    return (
        <Card variant="outlined" className="table-list">
            <CardContent>
                <ListToolBarWrapper>
                    <ListToolBar>
                        <ListButtonWrapper>{}</ListButtonWrapper>
                        <ListSearchBarWrapper>
                            <ListTableForm inputSubmit={inputSubmit}>
                                <ListTableForm.Filter
                                    className="list-select"
                                    name="result-volumes"
                                    defaultValue={volumeStateOptions[0]}
                                    onChange={selectState}
                                    options={volumeStateOptions}
                                    disabled={false}
                                />
                                <ListTableForm.Search
                                    placeholder={t('DR.NAME')}
                                    value={inputData}
                                    onChange={handleChange}
                                />
                            </ListTableForm>
                        </ListSearchBarWrapper>
                    </ListToolBar>
                </ListToolBarWrapper>
                <ListTable
                    columns={columns}
                    data={filterFlag ? filteredResultVolumes : volumes ?? []}
                    defaultPagination={true}
                    type="openstack-result-volumes"
                />
            </CardContent>
        </Card>
    );
};

export default VolumeTab;
