import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { styled as MuiStyled, Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import styled from 'styled-components';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useTranslation } from 'react-i18next';
import { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';

import TableChip from '../../../../component/common/Chip/TableChip';
import { findLastWord, formatBytes, formatTime } from '../../../../../libs/utils/commonFunction';
import ExecutionTypeFormatter from '../../../../component/common/Table/formatter/ExecutionTypeFormatter';

interface SummaryTabProps {
    resultDetail: any;
}
/**
 * 복구결과 페이지의 요약 탭
 */
const SummaryTab = ({ resultDetail }: SummaryTabProps) => {
    const theme = useTheme();
    const { t } = useTranslation();

    const getStartTime = dayjs.unix(resultDetail.started_at).format('YYYY.MM.DD HH:mm:ss');
    const getFinishTime = dayjs.unix(resultDetail.finished_at).format('YYYY.MM.DD HH:mm:ss');

    const numberAllInstance = resultDetail.instances?.length ?? 0;
    const numberAllVolumes = resultDetail.volumes?.length ?? 0;

    // 성공한 인스턴스의 수
    const numberOfSuccessInstances = () => {
        let count = 0;
        if (resultDetail.instances) {
            resultDetail.instances.forEach((item: any) => {
                if (item.result_code.split('.')[4] === 'success') {
                    count = count + 1;
                } else {
                    count = count + 0;
                }
            });
        }
        return count;
    };

    // 실패한 인스턴스의 수
    const numberOfFaliureInstance = () => {
        let count = 0;
        if (resultDetail.instances) {
            resultDetail.instances.forEach((item: any) => {
                if (item.result_code.split('.')[4] === 'failed') {
                    count = count + 1;
                } else {
                    count = count + 0;
                }
            });
        }
        return count;
    };

    // 성공한 볼륨의 수
    const numberOfRecoverySuccess = () => {
        let count = 0;
        if (resultDetail.volumes) {
            resultDetail.volumes.forEach((item: any) => {
                if (item.result_code.split('.')[4] === 'success') {
                    count = count + 1;
                } else {
                    count = count + 0;
                }
            });
        }
        return count;
    };

    // 실패한 볼륨의 수
    const numberOfVolumeFailed = () => {
        let count = 0;
        if (resultDetail.volumes) {
            resultDetail.volumes.forEach((item: any) => {
                if (item.result_code.split('.')[4] === 'failed') {
                    count = count + 1;
                } else {
                    count = count + 0;
                }
            });
        }
        return count;
    };

    const totalVolumeSize = () => {
        let size = 0;
        if (resultDetail.volumes) {
            resultDetail.volumes.map((volume: any) => {
                return (size += Number(volume.protection_cluster_volume.size_bytes));
            });
        }
        return formatBytes(size);
    };

    const state = {
        instanceSeries: [
            {
                name: 'Instance',
                data: [numberAllInstance, numberOfSuccessInstances(), numberOfFaliureInstance()],
            },
        ],
        volumeSeries: [
            {
                name: 'Volume',
                data: [numberAllVolumes, numberOfRecoverySuccess(), numberOfVolumeFailed()],
            },
        ],
        instanceOptions: {
            chart: {
                height: 150,
            },
            plotOptions: {
                bar: {
                    distributed: true,
                    borderRadius: 10,
                    columnWidth: '20%',
                    colors: {
                        backgroundBarColors: ['transparent', 'transparent', 'transparent'],
                    },
                    dataLabels: {
                        position: 'bottom', // top, center, bottom
                    },
                },
            },
            colors: ['#02C080', theme.palette.primary[theme.palette.mode], theme.palette.error[theme.palette.mode]],
            dataLabels: {
                enabled: true,
                formatter: function (val: any) {
                    return val;
                },
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: [theme.palette.mode === 'light' ? '#121212' : '#fff'],
                },
            },
            legend: {
                show: false,
            },
            yaxis: {
                labels: {
                    formatter(val) {
                        Math.floor(val);
                    },
                    style: {
                        colors: [theme.palette.mode === 'light' ? '#121212' : '#fff'],
                    },
                },
            },
            xaxis: {
                categories: [
                    t('DR.RECOVERY_TARGET'),
                    t('DR.RECOVERY_SUCCESS'),
                    t('DR.RECOVERY_FAIL'),
                    // t('DR.RECOVERY_RUNNING'),
                ],
                labels: {
                    style: {
                        colors:
                            theme.palette.mode === 'light'
                                ? ['#121212', '#121212', '#121212']
                                : ['#fff', '#fff', '#fff'],
                    },
                },
                position: 'bottom',
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
            },
        } as ApexOptions,
        volumeOptions: {
            chart: {
                height: 150,
            },
            plotOptions: {
                bar: {
                    distributed: true,
                    borderRadius: 10,
                    columnWidth: '20%',
                    colors: {
                        backgroundBarColors: ['transparent', 'transparent', 'transparent'],
                    },
                    dataLabels: {
                        position: 'bottom', // top, center, bottom
                    },
                },
            },
            colors: ['#02C080', theme.palette.primary[theme.palette.mode], theme.palette.error[theme.palette.mode]],
            dataLabels: {
                enabled: true,
                formatter: function (val: any) {
                    return val;
                },
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: [theme.palette.mode === 'light' ? '#121212' : '#fff'],
                },
            },
            legend: {
                show: false,
            },
            yaxis: {
                labels: {
                    formatter(val) {
                        Math.floor(val);
                    },
                    style: {
                        colors: [theme.palette.mode === 'light' ? '#121212' : '#fff'],
                    },
                },
            },
            xaxis: {
                labels: {
                    style: {
                        colors:
                            theme.palette.mode === 'light'
                                ? ['#121212', '#121212', '#121212']
                                : ['#fff', '#fff', '#fff'],
                    },
                },
                categories: [t('DR.RECOVERY_TARGET'), t('DR.RECOVERY_SUCCESS'), t('DR.RECOVERY_FAIL')],
                position: 'bottom',
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
            },
        } as ApexOptions,
    };

    return (
        <Card variant="outlined">
            <TItleWrapper>
                <Typography>
                    {findLastWord(resultDetail?.recovery_type_code) === 'migration'
                        ? t('DR.RP.DISASTER_RECOVERY_SUMMARY_OF_RESULTS')
                        : t('DR.RP.SIMULATION_TRAINING_SUMMARY_OF_RESULTS')}
                </Typography>
            </TItleWrapper>
            <CardContent>
                <InfoWrapper>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography>
                            {t('DR.DEPARTMENT')} : {resultDetail.operator_department ?? ''}
                        </Typography>
                        <Typography>
                            {t('DR.POSITION')} :{resultDetail.operator_position ?? ''}
                        </Typography>
                        <Typography>
                            {t('DR.NAME')} : {resultDetail.operator_name ?? ''}
                        </Typography>
                    </Box>
                </InfoWrapper>
                <InfoWrapper>
                    <Typography variant="h6">
                        {findLastWord(resultDetail?.recovery_type_code) === 'migration'
                            ? t('DR.RP.DISASTER_RECOVERY_SUMMARY_OF_RESULTS')
                            : t('DR.RP.SIMULATION_TRAINING_SUMMARY_OF_RESULTS')}
                        &nbsp;
                        {t('DR.RP.INFORMATION')}
                    </Typography>
                    <GridWrapper>
                        <DetailGrid>
                            <GridTitle xs={6} md={2}>
                                <Title>
                                    {findLastWord(resultDetail?.recovery_type_code) === 'migration'
                                        ? t('DR.RP.DISASTER_RECOVERY_SUMMARY_OF_RESULTS')
                                        : t('DR.RP.SIMULATION_TRAINING_SUMMARY_OF_RESULTS')}
                                </Title>
                            </GridTitle>
                            <GridContent xs={6} md={2}>
                                <TableChip label={resultDetail.result_code} color={resultDetail.result_code} />
                            </GridContent>
                            <GridContent xs={6} md={2}></GridContent>
                            <GridContent xs={6} md={2}></GridContent>
                            <GridContent xs={6} md={2}></GridContent>
                            <GridContent xs={6} md={2}></GridContent>
                        </DetailGrid>
                        <DetailGrid>
                            <GridTitle xs={6} md={2}>
                                <Title>{t('DR.ORI_CLUSTER')}</Title>
                            </GridTitle>
                            <GridContent xs={6} md={2}>
                                <Content>{`${resultDetail.protection_cluster_name}`}</Content>
                            </GridContent>
                            <GridTitle xs={6} md={2}>
                                <Title>{t('DR.RECOVERY_TARGET_CLUSTER')}</Title>
                            </GridTitle>
                            <GridContent xs={6} md={2}>
                                <Content>{`${resultDetail.recovery_cluster_name}`}</Content>
                            </GridContent>
                            <GridTitle xs={6} md={2}>
                                <Title>{t('DR.WORK_CLASS')}</Title>
                            </GridTitle>
                            <GridContent xs={6} md={2}>
                                <Content>
                                    {findLastWord(resultDetail?.recovery_type_code) === 'migration'
                                        ? t('DR.DISASTER_RECOVERY')
                                        : t('DR.SIMULATION')}
                                </Content>
                            </GridContent>
                        </DetailGrid>
                    </GridWrapper>
                    <GridWrapper>
                        <DetailGrid>
                            {/* 시작일시 */}
                            <GridTitle xs={6} md={2}>
                                <Title>
                                    {findLastWord(resultDetail?.recovery_type_code) === 'migration'
                                        ? t('DR.DISASTER_RECOVERY_START_DATE')
                                        : t('DR.SIMULATION_START_DATE')}
                                </Title>
                            </GridTitle>
                            <GridContent xs={6} md={2}>
                                <Content>{`${getStartTime}`}</Content>
                            </GridContent>
                            {/* 완료일시 */}
                            <GridTitle xs={6} md={2}>
                                <Title>
                                    {findLastWord(resultDetail?.recovery_type_code) === 'migration'
                                        ? t('DR.DISASTER_RECOVERY_COMPLETION_DATE')
                                        : t('DR.SIMULATION_COMPLETION_DATE')}
                                </Title>
                            </GridTitle>
                            <GridContent xs={6} md={2}>
                                <Content>{`${getFinishTime}`}</Content>
                            </GridContent>
                            {/* 소요시간 */}
                            <GridTitle xs={6} md={2}>
                                <Title>{t('DR.RP.TOTAL_TIME')}</Title>
                            </GridTitle>
                            <GridContent xs={6} md={2}>
                                {/* {`${elaspedTime}`} */}
                                <Content>{formatTime(resultDetail?.elapsed_time)}</Content>
                            </GridContent>
                        </DetailGrid>
                        <DetailGrid>
                            {/* 데이터 시점 */}
                            <GridTitle xs={6} md={2}>
                                <Title>{t('DR.RP.THE_POINT_OF_DATA')}</Title>
                            </GridTitle>
                            <GridContent xs={6} md={2}>
                                <Content>
                                    {resultDetail.recovery_point_type_code.split('.')[4] === 'latest' && (
                                        <>{t('DR.LATEST_DATA')}</>
                                    )}
                                    {resultDetail.recovery_point_type_code.split('.')[4] === 'latest_snapshot' && (
                                        <>{t('DR.LATEST_SNAPSHOT')}</>
                                    )}
                                    {resultDetail.recovery_point_type_code.split('.')[4] === 'snapshot' && (
                                        <>{t('DR.SPECIFIC_SNAPSHOT')}</>
                                    )}
                                </Content>
                            </GridContent>
                            <GridTitle xs={6} md={2}>
                                <Title>실행 정보</Title>
                            </GridTitle>
                            <GridContent xs={6} md={2}>
                                <Content>
                                    <ExecutionTypeFormatter data={resultDetail?.schedule_type} />
                                </Content>
                            </GridContent>
                            <GridContent xs={6} md={2}></GridContent>
                            <GridContent xs={6} md={2}></GridContent>
                        </DetailGrid>
                        <DetailGrid>
                            {/* 목표 복구시간 */}
                            <GridTitle xs={6} md={2}>
                                <Title>{t('DR.RP.TARGET_RECOVERY_TIME')}</Title>
                            </GridTitle>
                            <GridContent xs={6} md={2}>
                                <Content>{`${resultDetail.recovery_time_objective} ${t('DR.RP.MINUTE')}`}</Content>
                            </GridContent>
                            {/* 목표 준수여부 */}
                            <GridTitle xs={6} md={2}>
                                <Title>{t('DR.RP.COMPLIANCE_WITH_GOAL')}</Title>
                            </GridTitle>
                            <GridContent xs={6} md={2}>
                                <Content>
                                    {resultDetail.recovery_time_objective * 60 >= resultDetail.elapsed_time
                                        ? 'YES'
                                        : 'NO'}
                                </Content>
                            </GridContent>
                            <GridContent xs={6} md={2}></GridContent>
                            <GridContent xs={6} md={2}></GridContent>
                        </DetailGrid>
                        <DetailGrid>
                            {/* 인스턴스 개수 */}
                            <GridTitle xs={6} md={2}>
                                <Title>인스턴스 개수</Title>
                            </GridTitle>
                            <GridContent xs={6} md={2}>
                                <Content>{numberAllInstance} 개</Content>
                            </GridContent>
                            {/* 볼륨 개수 */}
                            <GridTitle xs={6} md={2}>
                                <Title>볼륨 개수</Title>
                            </GridTitle>
                            <GridContent xs={6} md={2}>
                                <Content>{numberAllVolumes} 개</Content>
                            </GridContent>
                            {/* 볼륨 전체 크기 */}
                            <GridTitle xs={6} md={2}>
                                <Title>볼륨 전체 크기</Title>
                            </GridTitle>
                            <GridContent xs={6} md={2}>
                                <Content>{totalVolumeSize()}</Content>
                            </GridContent>
                        </DetailGrid>
                    </GridWrapper>

                    <ChartWrapper sx={{ border: `1px solid ${theme.palette.divider}` }}>
                        <Chart>
                            <Typography variant="h6">{t('DR.INSTANCE')}</Typography>
                            <ReactApexChart options={state.instanceOptions} series={state.instanceSeries} type="bar" />
                        </Chart>
                        <Chart>
                            <Typography variant="h6">{t('DR.VOLUME')}</Typography>
                            <ReactApexChart options={state.volumeOptions} series={state.volumeSeries} type="bar" />
                        </Chart>
                    </ChartWrapper>
                    <ResonWrapper sx={{ border: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="h6">{t('DR.RESON_FAILURE')}</Typography>
                        {resultDetail?.failed_reasons && (
                            <Reason>
                                {resultDetail.failed_reasons.map((reason: any, idx: number) => {
                                    return <Typography key={idx}>◾ {reason?.code ?? '-'}</Typography>;
                                })}
                            </Reason>
                        )}
                    </ResonWrapper>
                </InfoWrapper>
            </CardContent>
        </Card>
    );
};
export default SummaryTab;

const InfoWrapper = styled(Box)`
    padding: 1rem;
`;

const ChartWrapper = styled(Box)`
    border-radius: 10px;
    display: flex;
    margin-bottom: 2rem;

    ${({ theme }) => theme.breakpoints.down.md} {
        flex-direction: column;
    }
`;

const Chart = styled(Box)`
    padding: 2rem;
    flex: 1;
`;

const ResonWrapper = MuiStyled(Box)(() => ({
    padding: '2rem',
    borderRadius: '10px',
}));

const Reason = MuiStyled(Box)(({ theme }) => ({
    padding: '1rem',
    border: `0.5px solid ${theme.palette.divider}`,
    borderRadius: '10px',
}));

const TItleWrapper = MuiStyled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary[theme.palette.mode],
    color: theme.palette.primary.contrastText,
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    margin: '1rem',
    borderRadius: '10px',
    textAlign: 'center',
}));

const GridWrapper = MuiStyled(Box)(({ theme }) => ({
    marginBottom: '1rem',
    borderWidth: '0.5px',
    borderStyle: 'solid',
    borderTop: 'none',
    borderRight: `0.5px solid ${theme.palette.divider}`,
    borderLeft: `0.5px solid ${theme.palette.divider}`,
    borderBottom: `0.5px solid ${theme.palette.divider}`,
}));

const DetailGrid = styled(Grid2).attrs({ container: true })``;

const GridTitle = MuiStyled(Grid2)(({ theme }) => ({
    padding: '0.5rem',
    borderTop: `0.5px solid ${theme.palette.divider}`,
}));

const GridContent = MuiStyled(Grid2)(({ theme }) => ({
    padding: '0.5rem',
    borderTop: `0.5px solid ${theme.palette.divider}`,
}));
const Title = styled(Typography)`
    font-weight: 700;
`;
const Content = styled(Typography)``;
