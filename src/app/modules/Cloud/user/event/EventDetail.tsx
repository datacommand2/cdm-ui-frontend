import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React from 'react';

import { _getEventDetail } from '../../../../../api/cloud/notification';
import { eventKeys } from '../../../../../libs/utils/queryKeys';
import TableChip from '../../../../component/common/Chip/TableChip';
import { DetailDrawer } from '../../../../component/common/DetailDrawer/DetailDrawer';

interface EventDetailProps {
    eventID: number;
}

/**
 * 이벤트 상세 정보를 보여주는 컴포넌트
 */
const EventDetail = ({ eventID }: EventDetailProps) => {
    /**
     * 이벤트 상세정보
     */
    const { data: eventDetail } = useQuery(eventKeys.detail(eventID), () => _getEventDetail(eventID), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                return data?.event;
            }
        },
        suspense: true,
    });

    return (
        <>
            <DetailDrawer>
                <DetailDrawer.Title text={'이벤트 상세 정보'} />
                <DetailDrawer.ContentHeader text={''} />
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'이벤트 코드'} />
                    <DetailDrawer.ContentBody>{eventDetail?.code ?? ''}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'이벤트 내용'} />
                    <DetailDrawer.ContentBody>{eventDetail?.contents ?? ''}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'에러 내용'} />
                    <DetailDrawer.ContentBody>{eventDetail?.error_code ?? ''}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'발생 일시'} />
                    <DetailDrawer.ContentBody>
                        {eventDetail?.created_at
                            ? dayjs.unix(eventDetail?.created_at).format('YYYY.MM.DD HH:mm:ss')
                            : ''}
                    </DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'대분류'} />
                    <DetailDrawer.ContentBody>{eventDetail?.class_1 ?? ''}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'소분류'} />
                    <DetailDrawer.ContentBody>{eventDetail?.class_3 ?? ''}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'이벤트 레벨'} />
                    <DetailDrawer.ContentBody>
                        <TableChip label={eventDetail?.level} color={eventDetail?.level} />
                    </DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
                <DetailDrawer.ContentWrapper>
                    <DetailDrawer.ContentTitle text={'솔루션'} />
                    <DetailDrawer.ContentBody>{eventDetail?.solution ?? ''}</DetailDrawer.ContentBody>
                </DetailDrawer.ContentWrapper>
            </DetailDrawer>
        </>
    );
};

export default EventDetail;
