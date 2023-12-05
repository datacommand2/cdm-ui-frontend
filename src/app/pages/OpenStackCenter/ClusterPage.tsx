import { useTranslation } from 'react-i18next';

import ClusterList from '../../modules/Center/list/ClusterList';
import ContentLayout from '@/app/component/common/layout/ContentLayout';

/**
 * 클러스터 목록을 보여주는 페이지
 */
const ClusterPage = () => {
    const { t } = useTranslation();
    return <ContentLayout type="list" header={t('DR.CLUSTER_LIST')} content={<ClusterList />} />;
};

export default ClusterPage;
