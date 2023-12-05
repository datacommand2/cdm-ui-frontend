import { Box, Skeleton, Typography, useTheme } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

import { ServiceConfigKey } from '@/@types/Cloud/config';

import Services from './Services';
import { useServiceConfigQuery } from './common/hooks';

const ServiceConfigs = [
    { name: '로그 타입', key: 'service_log_type' },
    { name: '로그 레벨', key: 'service_log_level' },
    { name: '로그 보유 기간', key: 'service_log_store_period' },
] as { name: string; key: ServiceConfigKey }[];

const Title = styled(Typography).attrs({ variant: 'h5' })`
    margin-bottom: 1rem;
`;

export const SkeletonTable = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Skeleton width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
            <Skeleton width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
            <Skeleton width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
            <Skeleton width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
            <Skeleton width="100%" variant="rounded" animation="wave" sx={{ marginBottom: '0.5em' }} />
        </Box>
    );
};

/**
 * 서비스 설정을 조회하는 컴포넌트
 */
export const ServiceConfig = () => {
    const theme = useTheme();

    // 서비스 설정을 불러온다.
    const { data: serviceConfigs } = useServiceConfigQuery();

    return (
        <Wrapper>
            {ServiceConfigs.map(service => {
                return (
                    <React.Fragment key={service.key}>
                        <Title>{service.name}</Title>
                        <ConfigWrapper sx={{ border: `1px solid ${theme.palette.divider}` }}>
                            {serviceConfigs ? (
                                <Services services={serviceConfigs} type={service.key} title={service.name} />
                            ) : (
                                <SkeletonTable />
                            )}
                        </ConfigWrapper>
                    </React.Fragment>
                );
            })}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 2rem;
`;

const ConfigWrapper = styled(Box)`
    display: flex;
    margin-bottom: 1rem;
    overflow-x: auto;
    flex-direction: column;
    padding: 20px;
    border-radius: 5px;

    & .no-page-table-container {
        padding: 0;
    }
    & .no-page-table {
        padding-top: 0;
    }

    & .MuiTableCell-root {
        padding: 0 16px;
    }

    & #table-checkbox-select {
        width: 48px;
    }

    & #table-checkbox-name {
        width: 50%;
    }
`;
