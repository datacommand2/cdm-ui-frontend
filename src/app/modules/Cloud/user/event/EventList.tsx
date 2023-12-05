import React, { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { Box, Typography } from '@mui/material';

import { _getEvent, _getEventClassification } from '../../../../../api/cloud/notification';
import { eventClassificationKeys, eventKeys } from '../../../../../libs/utils/queryKeys';
import ListTableForm from '../../../../component/common/ListTableForm/ListTableForm';
import NewDateFormatter from '../../../../component/common/Table/formatter/NewDateFormatter';
import TableChip from '../../../../component/common/Chip/TableChip';
import EventDetail from './EventDetail';
import {
    ListEventWrapper,
    ListToolBar,
    ListToolBarWrapper,
} from '../../../../component/common/ListToolBar/ListToolBar';
import TableHeader from '../../../../component/common/Table/TableHeader';
import ListTable from '../../../../component/common/Table/ListTable';
import { EventListInterface } from '../../../../../@types/Cloud/event';
import { OptionType } from '../../../../../@types';
import { EventLevelOptions } from '../../../../../constant/selectOptions';
import CustomDateTimePicker from '../../../../component/common/DateTimePicker/CustomDateTimePicker';
import DetailDrawerSkeleton from '../../../../component/common/Skeleton/DetailDrawerSkeleton';
import ActionsFormatter from '../../../../component/common/Table/formatter/ActionsFormatter';
import useDrawer from '@/hooks/useDrawer';

const columnHelper = createColumnHelper<EventListInterface>();

/**
 * 이벤트 목록을 보여주는 컴포넌트
 */
const EventList = () => {
    const [solutionList, setSolutionList] = useState<string[]>([]);

    // 한 페이지에 표시할 항목 개수
    const [limit, setLimit] = useState(10);
    // 페이지에 표시할 인덱스
    const [offset, setOffset] = useState(0);
    //
    const [solution, setSolution] = useState('default');
    //
    // const [class1, setClass1] = useState('');
    // const [class3, setClass3] = useState('');
    const [level, setLevel] = useState('default');
    const [startDate, setStartDate] = useState(dayjs().startOf('day'));
    const [endDate, setEndDate] = useState(dayjs());

    const [solutionOptions, setSolutionOptions] = useState([
        {
            value: '',
            label: 'solution',
            isDisabled: true,
        },
        {
            value: 'all',
            label: 'all',
        },
    ]);

    const { openDrawer } = useDrawer();

    const handleClick = useCallback(
        (id: number) => {
            openDrawer(
                <Suspense fallback={<DetailDrawerSkeleton />}>
                    <EventDetail eventID={id} />
                </Suspense>,
            );
        },
        [openDrawer],
    );

    useEffect(() => {
        if (solutionList.length > 0) {
            let list: { value: string; label: string }[] = [];
            let prevSolutions = [...solutionOptions];
            solutionList.map(solution => {
                list.push({ value: solution, label: solution });
                return solution;
            });

            setSolutionOptions(prevSolutions.concat(list));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [solutionList]);

    // 이벤트 목록을 불러오는 함수
    const {
        data: eventList,
        isFetching: eventFetching,
        isLoading: eventLoading,
        refetch: eventListRefresh,
    } = useQuery(
        eventKeys.list({ limit, offset, solution, class1: '', class3: '', level, startDate, endDate }),
        () =>
            _getEvent(
                limit,
                offset,
                solution === 'default' ? '' : solution,
                // class1,
                // class3,
                '',
                '',
                level === 'default' ? '' : level,
                startDate === null ? 0 : Number(dayjs(startDate).format('YYYYMMDDHHmm')),
                endDate === null ? 0 : Number(dayjs(endDate).format('YYYYMMDDHHmm')),
            ),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return {
                        events: data.events as EventListInterface[],
                        pagination: data.pagination,
                        status,
                    };
                } else if (status === 204) {
                    return {
                        events: [],
                        pagination: {},
                        status,
                    };
                } else throw new Error();
            },
            keepPreviousData: true,
            cacheTime: 0,
        },
    );

    // 이벤트 코드 분류 목록 조회 (솔루션 필터링 용)
    const { data: eventClassifications, isLoading: eventClassificationLoading } = useQuery(
        eventClassificationKeys.all,
        () => _getEventClassification(),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data?.event_classifications;
                } else if (status === 204) {
                    return [];
                } else throw new Error();
            },
        },
    );

    useEffect(() => {
        let list: string[] = [];
        if (eventClassifications && !eventClassificationLoading) {
            if (eventClassifications) {
                eventClassifications.map(v => {
                    if (!list.includes(v.solution)) {
                        list.push(v.solution);
                    }
                    return v;
                });
                setSolutionList(list);
            }
        }
    }, [eventClassificationLoading, eventClassifications]);

    // 페이지 당 보여주는 데이터 수를 변경했을 때
    const changePageSize = (value: number) => {
        setLimit(value);
    };

    // 페이지가 바뀔 때
    const changePage = (value: number) => {
        setOffset(value);
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor('created_at', {
                header: () => <TableHeader text={'발생일시'} />,
                cell: props => <NewDateFormatter data={props} type={'created_at'} />,
            }),
            columnHelper.accessor('solution', {
                header: () => <TableHeader text={'솔루션'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('level', {
                header: () => <TableHeader text={'레벨'} />,
                cell: props => <TableChip color={props?.row.original?.level} label={props?.row.original?.level} />,
            }),
            columnHelper.accessor('class_1', {
                header: () => <TableHeader text={'대분류'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('class_3', {
                header: () => <TableHeader text={'소분류'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.accessor('code', {
                header: () => <TableHeader text={'이벤트 코드'} />,
                cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
            }),
            columnHelper.display({
                id: 'actions',
                header: () => <TableHeader text={'동작'} />,
                cell: props => (
                    <ActionsFormatter
                        monitoringEvent={() => {}}
                        addEvent={() => {}}
                        data={props?.row?.original}
                        type={`events`}
                        title={'이벤트'}
                        detailEvent={() => {
                            handleClick(props.row.original.id);
                        }}
                        editEvent={() => {}}
                        treeId={''}
                    />
                ),
            }),
        ],
        [handleClick],
    );

    return (
        <>
            <ListToolBarWrapper>
                <ListToolBar>
                    <ListEventWrapper>
                        <ListTableForm inputSubmit={() => {}}>
                            <DateButtonWrapper>
                                <DateButton>
                                    <CustomDateTimePicker
                                        onChange={newValue => {
                                            if (newValue) {
                                                setStartDate(newValue);
                                            }
                                        }}
                                        value={startDate}
                                        disablePast={false}
                                        disableFuture={true}
                                        minDateTime={undefined}
                                    />
                                </DateButton>
                                <DateButton>
                                    <CustomDateTimePicker
                                        onChange={newValue => {
                                            if (newValue) {
                                                setEndDate(newValue);
                                            }
                                        }}
                                        value={endDate}
                                        disablePast={false}
                                        disableFuture={true}
                                        minDateTime={startDate}
                                    />
                                </DateButton>
                            </DateButtonWrapper>
                            <ListTableForm.Filter
                                disabled={eventFetching}
                                name="level-option"
                                className="list-select"
                                defaultValue={EventLevelOptions[0]}
                                options={EventLevelOptions}
                                onChange={(e: OptionType) => {
                                    setOffset(0);
                                    setLevel(e.value);
                                }}
                            />
                            <ListTableForm.Filter
                                name="solution-option"
                                disabled={eventFetching}
                                className="list-select"
                                defaultValue={solutionOptions[0]}
                                options={solutionOptions}
                                onChange={(e: OptionType) => {
                                    setOffset(0);
                                    setSolution(e.value);
                                }}
                            />
                            <ListTableForm.RefreshButton refreshFn={eventListRefresh} isLoading={eventLoading} />
                        </ListTableForm>
                    </ListEventWrapper>
                </ListToolBar>
            </ListToolBarWrapper>
            <ListTable
                data={eventList?.events ?? []}
                pagination={eventList?.pagination ?? {}}
                columns={columns}
                limit={limit}
                offset={offset}
                onChangeLimit={changePageSize}
                onChangePage={changePage}
                isFetching={eventFetching}
                isLoading={eventLoading}
                statusCode={eventList?.status}
                type={'event-list'}
                onClick={(data: EventListInterface) => {
                    handleClick(data.id);
                }}
            />
        </>
    );
};

export default EventList;

const DateButton = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    flex-direction: column;
    align-items: flex-start;

    & .MuiFormControl-root {
        width: 100%;
    }

    & .MuiInputBase-input {
        padding: 10.5px 14px;
    }
`;

const DateButtonWrapper = styled(Box)`
    display: flex;
    column-gap: 8px;
    padding-right: 8px;

    ${({ theme }) => theme.breakpoints.down.md} {
        row-gap: 5px;
    }
`;
