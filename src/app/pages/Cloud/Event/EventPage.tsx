import React from 'react';
import { useTranslation } from 'react-i18next';

import EventList from '../../../modules/Cloud/user/event/EventList';
import ContentLayout from '@/app/component/common/layout/ContentLayout';

/**
 * 이벤트 목록을 보여주는 페이지
 */
const EventPage = () => {
    const { t } = useTranslation();
    return <ContentLayout type="list" header={t('CLOUD.EVENT_LIST')} content={<EventList />} />;
};

export default EventPage;
