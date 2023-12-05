// notification 관련 api

import { AxiosError } from 'axios';
import { EventClassification, EventDetail } from '../../@types/Cloud/event';
import { GET, PUT } from '../../libs/utils/axios';

// 이벤트 설정 조회하는 함수
export const _getEventConfig = async () => {
    return await GET(`/notification/config`);
};

// 이벤트 설정 변경하는 함수
export const _modifyEventConfig = async (config: any) => {
    return await PUT(`/notification/config`, { event_config: config });
};

// 이벤트 수신 여부 조회하는 함수(테넌트)
export const _getReceiveEventTenantConfig = async () => {
    return await GET('/notification/config/receivers/tenant');
};

// 이벤트 수신 여부 조회하는 함수(사용자)
export const _getReceiveEventUserConfig = async () => {
    return await GET('/notification/config/receivers/user');
};

// 이벤트 목록 조회하는 함수
export const _getEvent = async (
    limit: number | undefined,
    offset: number | undefined,
    solution: string,
    class_1: string,
    class_3: string,
    level: string,
    start_date: number,
    end_date: number,
) => {
    if (!limit) {
        return await GET(`/notification/events?start_date=${start_date}&end_date=${end_date}`);
    } else {
        return await GET(
            `/notification/events?limit=${limit}&offset=${offset}&solution=${
                solution === 'all' ? '' : solution
            }&class_1=${class_1}&class_3=${class_3}&level=${
                level === 'all' ? '' : level
            }&start_date=${start_date}&end_date=${end_date}`,
        );
    }
};

// 이벤트 상세정보를 조회하는 함수
export const _getEventDetail = async (
    eventID: number,
): Promise<[{ event: EventDetail } | null, Error | AxiosError, number]> => {
    return await GET(`/notification/events/${eventID}`);
};

// 이벤트 코드 분류 목록 조회하는 함수
export const _getEventClassification = async (): Promise<
    [{ event_classifications: EventClassification[] } | null, Error | AxiosError, number]
> => {
    return await GET(`/notification/event-classifications`);
};
