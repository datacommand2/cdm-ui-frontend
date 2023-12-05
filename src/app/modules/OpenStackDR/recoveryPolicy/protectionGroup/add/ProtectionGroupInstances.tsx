import { useQuery } from '@tanstack/react-query';
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import PageviewIcon from '@mui/icons-material/Pageview';
import styled from 'styled-components';
import { Divider, FormGroup, IconButton, Typography, useTheme } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import { useTranslation } from 'react-i18next';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { UseFormGetValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';

import { clusterTenantKeys, unprotectedInstanceKeys } from '../../../../../../libs/utils/queryKeys';
import { _getClusterTenant } from '../../../../../../api/center/cluster';
import { _getUnprotectedInstance } from '../../../../../../api/dr/protectionGroup';
import DefaultSelect from '../../../../../component/common/Select/DefaultSelect';
import TableChip from '../../../../../component/common/Chip/TableChip';
import IndeterminateCheckBox from '../../../../../component/common/IndeterminateCheckBox';
import TableHeader from '../../../../../component/common/Table/TableHeader';
import NoPageTable from '../../../../../component/common/Table/NoPageTable';
import { OptionType, RPOs, SnapShotIntervals } from '../../../../../../@types';
import DetailDrawerSkeleton from '../../../../../component/common/Skeleton/DetailDrawerSkeleton';
import InstanceDetail from '../../../../OpenStackCenter/detail/InstanceTab/InstanceDetail';
import useDrawer from '@/hooks/useDrawer';

let options = [
    { value: '', label: '프로젝트', isDisabled: true },
    { value: 'all', label: '전체' },
];

interface Instance {
    id: number;
    name: string;
    tenant: {
        name: string;
    };
    availability_zone: {
        name: string;
    };
    status: string;
    state: string;
}

const columnHelper = createColumnHelper<Instance>();

interface IForm {
    protection_cluster: {
        id: number;
    };
    name: string;
    remarks?: string;
    recovery_point_objective_type: RPOs;
    recovery_point_objective: number;
    recovery_time_objective: number;
    snapshot_interval_type: SnapShotIntervals;
    snapshot_interval: number;
    instances: any[];
}

interface ProtectionGroupInstancesProps {
    watch: UseFormWatch<IForm>;
    setValue: UseFormSetValue<IForm>;
    getValues: UseFormGetValues<IForm>;
}

/**
 * 보호그룹의 보호 인스턴스를 설정하는 컴포넌트
 */
const ProtectionGroupInstances = ({ watch, setValue, getValues }: ProtectionGroupInstancesProps) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [selectedTenantID, setSeletedTenantID] = useState('');

    // 보호대상과 비보호 대상인스턴스의 아이디 값만 저장
    const [unProtectedInstances, setUnprotectedInstances] = useState<number[]>([]);

    // 보호대상과 비보호 대상인스턴스 중 체크된 인스턴스의 아이디 값만 저장
    const [checkedProtectedInstances, setCheckedProtectedInstances] = useState<any[]>([]);
    const [checkedUnprotectedInstances, setCheckedUnprotectedInstances] = useState<any[]>([]);

    const { openDrawer } = useDrawer();

    const handleClick = useCallback(
        (instanceID: number) => {
            openDrawer(
                <Suspense fallback={<DetailDrawerSkeleton />}>
                    <InstanceDetail clusterID={getValues('protection_cluster.id')} instanceID={instanceID} />
                </Suspense>,
            );
        },
        [getValues, openDrawer],
    );

    useEffect(() => {
        setCheckedProtectedInstances([]);
        setCheckedUnprotectedInstances([]);
        if (selectedTenantID !== null) {
            setSeletedTenantID('all');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch('protection_cluster.id')]);

    // 클러스터 테넌트 목록을 불러오는 함수
    const { data: clusterTenants } = useQuery(
        clusterTenantKeys.list({ clusterID: watch('protection_cluster.id') }),
        () => _getClusterTenant(watch('protection_cluster.id')),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    const tenants = data?.tenants?.filter(v => v.name !== 'services' && v.name !== 'demo');
                    const tenantsMap = tenants.map(tenant => {
                        return { value: tenant.id, label: tenant.name };
                    });
                    return [...options, ...tenantsMap];
                } else if (status === 204) {
                    return [{ value: '', label: '프로젝트', isDisabled: true }];
                }
            },
            enabled: watch('protection_cluster.id') !== 0,
        },
    );

    // 비보호 인스턴스를 조회하는 함수
    const { data: unprotectedInstances, isFetching: instanceLoading } = useQuery(
        unprotectedInstanceKeys.list({ clusterID: watch('protection_cluster.id'), tenantID: selectedTenantID }),
        () => _getUnprotectedInstance(watch('protection_cluster.id'), selectedTenantID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.instances;
                } else if (status === 204) {
                    return [];
                } else throw new Error();
            },
            enabled: !!selectedTenantID && watch('protection_cluster.id') !== 0,
            keepPreviousData: true,
        },
    );

    // 비보호 인스턴스가 존재하면 비보호 인스턴스 목록 구성
    useEffect(() => {
        if (unprotectedInstances) {
            if (unprotectedInstances.legnth !== 0) {
                const instances = unprotectedInstances.filter(
                    (v: any) => getValues('instances').find(({ id }) => id === v.id) === undefined,
                );
                // 비보호 인스턴스 목록은 현재 보호 인스턴스 목록 제외하고 구성
                setUnprotectedInstances(instances);
            } else {
                setUnprotectedInstances([]);
            }
        }
    }, [getValues, unprotectedInstances]);
    const moveLeft = () => {
        if (checkedProtectedInstances.length > 0) {
            setUnprotectedInstances([...unProtectedInstances, ...checkedProtectedInstances]);
            setValue(
                'instances',
                getValues('instances').filter((instance: any) => !checkedProtectedInstances.includes(instance)),
            );
            setCheckedProtectedInstances([]);
        }
    };

    const moveLeftAll = () => {
        if (getValues('instances').length > 0) {
            setUnprotectedInstances([...unProtectedInstances, ...getValues('instances')]);
            setValue('instances', []);
            setCheckedProtectedInstances([]);
        }
    };

    const moveRight = () => {
        if (checkedUnprotectedInstances.length > 0) {
            // Protected Instance에 기존 protected + 체크되어 있던 unprotected
            setValue('instances', [...getValues('instances'), ...checkedUnprotectedInstances]);
            // unprotected는 filter 함수로 체크되어 있던 instance 는 제외하고 다시 구성
            setUnprotectedInstances(
                unProtectedInstances.filter(instance => !checkedUnprotectedInstances.includes(instance)),
            );
            // 체크된 인스턴스의 아이디 값 배열은 초기 상태로
            setCheckedUnprotectedInstances([]);
        }
    };

    const moveRightAll = () => {
        if (unProtectedInstances.length > 0) {
            // protected instance에 기존 protected + 모든 unprotected
            setValue('instances', [...getValues('instances'), ...unProtectedInstances]);
            // unprotected는 빈 배열로(전부 protected로 이동)
            setUnprotectedInstances([]);
            // 체크된 인스턴스의 아이디 값 배열은 초기 상태로
            setCheckedUnprotectedInstances([]);
        }
    };

    const tenantChange = (e: OptionType) => {
        setCheckedUnprotectedInstances([]);
        // setTenant(e.target.value);
        setSeletedTenantID(e.value);
    };

    // 비보호 인스턴스 테이블에서 row를 클릭할 때 실행
    const onCheckUnprotectedInstance1 = useCallback(
        (instance: any) => {
            if (checkedUnprotectedInstances.findIndex(({ id }) => id === instance.id) >= 0) {
                setCheckedUnprotectedInstances(checkedUnprotectedInstances.filter(({ id }) => id !== instance.id));
            } else {
                // 체크되어 있지 않은 경우
                setCheckedUnprotectedInstances([...checkedUnprotectedInstances, instance]);
            }
        },
        [checkedUnprotectedInstances],
    );

    // 보호 인스턴스 테이블에서 row를 클릭할 때 실행
    // 위의 코드와 동일하게 동작함
    const onCheckProtectedInstance1 = useCallback(
        (instance: any) => {
            // 체크되어 있는 경우
            if (checkedProtectedInstances.findIndex(({ id }) => id === instance.id) >= 0) {
                setCheckedProtectedInstances(checkedProtectedInstances.filter(({ id }) => id !== instance.id));
            } else {
                // 체크되어 있지 않은 경우
                setCheckedProtectedInstances([...checkedProtectedInstances, instance]);
            }
        },
        [checkedProtectedInstances],
    );

    const unProtectedColumns = useMemo(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <IndeterminateCheckBox
                        {...{
                            checked:
                                checkedUnprotectedInstances.length > 0 &&
                                checkedUnprotectedInstances.length === unProtectedInstances?.length,
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler(),
                        }}
                        onClick={() => {
                            if (checkedUnprotectedInstances.length === unProtectedInstances?.length) {
                                // table.getIsAllRowsSelected === true 면
                                // 전체 선택 해제
                                setCheckedUnprotectedInstances([]);
                            } else {
                                // table.getIsAllRowsSelected === false 면
                                // 전체 선택
                                const rows = table.getRowModel().rows.map(ins => ins.original);
                                setCheckedUnprotectedInstances(rows);
                            }
                        }}
                    />
                ),
                cell: ({ row }) => (
                    <IndeterminateCheckBox
                        {...{
                            id: row.original.id,
                            checked: checkedUnprotectedInstances.includes(row.original),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                        onClick={() => {
                            onCheckUnprotectedInstance1(row.original);
                        }}
                    />
                ),
            },
            columnHelper.accessor('name', {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('tenant.name', {
                header: () => <TableHeader text={'프로젝트'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('availability_zone.name', {
                header: () => <TableHeader text={'가용구역'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('status', {
                header: () => <TableHeader text={'Status'} />,
                cell: props => <TableChip color={props?.row.original?.status} label={props?.row.original?.status} />,
            }),
            columnHelper.accessor('state', {
                header: () => <TableHeader text={'State'} />,
                cell: props => <TableChip color={props?.row.original?.state} label={props?.row.original?.state} />,
            }),
            columnHelper.display({
                id: 'actions',
                header: () => <TableHeader text={'상세'} />,
                cell: ({ row }) => (
                    <IconButton
                        sx={{ padding: 0 }}
                        onClick={() => {
                            handleClick(row.original.id);
                        }}
                    >
                        <PageviewIcon />
                    </IconButton>
                ),
            }),
        ],
        [checkedUnprotectedInstances, handleClick, onCheckUnprotectedInstance1, unProtectedInstances?.length],
    );

    const protectedColumns = useMemo(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <IndeterminateCheckBox
                        {...{
                            checked:
                                checkedProtectedInstances.length > 0 &&
                                checkedProtectedInstances.length === getValues('instances')?.length,
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler(),
                        }}
                        onClick={() => {
                            if (checkedProtectedInstances.length === getValues('instances')?.length) {
                                // table.getIsAllRowsSelected === true 면
                                // 전체 선택 해제
                                // setCheckedUnprotectedInstances([]);
                                setCheckedProtectedInstances([]);
                            } else {
                                // table.getIsAllRowsSelected === false 면
                                // 전체 선택
                                const rows = table.getRowModel().rows.map(ins => ins.original);
                                setCheckedProtectedInstances(rows);
                            }
                        }}
                    />
                ),
                cell: ({ row }) => (
                    <IndeterminateCheckBox
                        {...{
                            id: row.original.id,
                            checked: checkedProtectedInstances.includes(row.original),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                        onClick={() => {
                            onCheckProtectedInstance1(row.original);
                        }}
                    />
                ),
            },
            columnHelper.accessor('name', {
                header: () => <TableHeader text={'이름'} />,
                cell: ({ getValue }) => <Typography key={`protected-name-name`}>{getValue()}</Typography>,
            }),
            columnHelper.accessor('tenant.name', {
                header: () => <TableHeader text={'프로젝트'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('availability_zone.name', {
                header: () => <TableHeader text={'가용구역'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('status', {
                header: () => <TableHeader text={'Status'} />,
                cell: props => <TableChip color={props?.row.original?.status} label={props?.row.original?.status} />,
            }),
            columnHelper.accessor('state', {
                header: () => <TableHeader text={'State'} />,
                cell: props => <TableChip color={props?.row.original?.state} label={props?.row.original?.state} />,
            }),
            columnHelper.display({
                id: 'actions',
                header: () => <TableHeader text={'상세'} />,
                cell: ({ row }) => (
                    <IconButton
                        sx={{ padding: 0 }}
                        onClick={() => {
                            handleClick(row.original.id);
                        }}
                    >
                        <PageviewIcon />
                    </IconButton>
                ),
            }),
        ],
        [checkedProtectedInstances, getValues, handleClick, onCheckProtectedInstance1],
    );

    return (
        <>
            <InstanceGridWrapper>
                <InstnaceGrid>
                    <Title>{t('DR.UNPROTECTED_INSTANCE')}</Title>
                    <div style={{ display: 'flex', flex: '1 1 30%', justifyContent: 'flex-end' }}>
                        <FormGroup>
                            <DefaultSelect
                                name="tenant"
                                options={clusterTenants ?? [{ value: '', label: '프로젝트', isDisabled: true }]}
                                label={t('DR.TENANT')}
                                onChange={(e: OptionType) => tenantChange(e)}
                                value={
                                    clusterTenants?.filter(option => {
                                        return option.value === selectedTenantID;
                                    })[0]
                                }
                            />
                        </FormGroup>
                    </div>
                    <NoPageTable
                        columns={unProtectedColumns}
                        data={unProtectedInstances ?? []}
                        isLoading={instanceLoading}
                        noDataMessage={'비보호 인스턴스가 존재하지 않습니다.'}
                        onClick={(event: React.KeyboardEvent | React.MouseEvent, data: any) => {
                            handleClick(data.id);
                        }}
                    />
                </InstnaceGrid>
                <ButtonGrid>
                    <MoveButton
                        sx={{ border: `1px solid ${theme.palette.divider}` }}
                        disabled={checkedUnprotectedInstances.length === 0}
                        onClick={moveRight}
                    >
                        <KeyboardArrowRightOutlinedIcon />
                    </MoveButton>
                    <MoveButton
                        sx={{ border: `1px solid ${theme.palette.divider}` }}
                        onClick={moveRightAll}
                        disabled={unProtectedInstances.length === 0}
                    >
                        <KeyboardDoubleArrowRightOutlinedIcon />
                    </MoveButton>
                    <MoveButton
                        sx={{ border: `1px solid ${theme.palette.divider}` }}
                        onClick={moveLeftAll}
                        disabled={getValues('instances').length === 0}
                    >
                        <KeyboardDoubleArrowLeftOutlinedIcon />
                    </MoveButton>
                    <MoveButton
                        sx={{ border: `1px solid ${theme.palette.divider}` }}
                        onClick={moveLeft}
                        disabled={checkedProtectedInstances.length === 0}
                    >
                        <KeyboardArrowLeftOutlinedIcon />
                    </MoveButton>
                </ButtonGrid>
                <InstnaceGrid>
                    <Title>{t('DR.PROTECTED_INSTANCE')}</Title>
                    <div style={{ display: 'flex', flex: '1 1 30%', justifyContent: 'flex-end' }}>
                        <div style={{ visibility: 'hidden' }}>
                            <FormGroup>
                                <DefaultSelect name="tenant" label={t('DR.TENANT')} />
                            </FormGroup>
                        </div>
                    </div>

                    <NoPageTable
                        columns={protectedColumns}
                        data={getValues('instances') ?? []}
                        noDataMessage={'보호 인스턴스가 존재하지 않습니다.'}
                        onClick={(event: React.KeyboardEvent | React.MouseEvent, data: any) => {
                            handleClick(data.id);
                        }}
                    />
                </InstnaceGrid>
            </InstanceGridWrapper>
            <Divider />
        </>
    );
};

export default ProtectionGroupInstances;

const Title = styled(Typography).attrs({ variant: 'h6' })`
    font-weight: 700;
`;

const InstanceGridWrapper = styled(Grid2).attrs({ container: true, columns: 19 })`
    display: flex;
    padding-left: 2rem;
    padding-right: 2rem;

    ${({ theme }) => theme.breakpoints.down.md} {
        flex-direction: column;
    }
`;

const InstnaceGrid = styled(Grid2).attrs({ xs: 9 })`
    & .no-page-table {
        padding: 0;
        min-height: 350px;
    }

    & .no-page-table-container {
        padding: 0 !important;
    }
    ${({ theme }) => theme.breakpoints.down.md} {
        width: 100%;
        & .no-page-table {
            padding: 0;
            min-height: 200px;
        }
    }
`;
const ButtonGrid = styled(Grid2).attrs({ xs: 1 })`
    display: flex;
    flex-direction: column;

    ${({ theme }) => theme.breakpoints.up.md} {
        margin-top: 100px;
    }
    ${({ theme }) => theme.breakpoints.down.md} {
        flex-direction: row;
        width: 100%;
    }
    justify-content: center;
    align-items: center;
`;

const MoveButton = styled(IconButton)`
    border-radius: 5px;
`;
