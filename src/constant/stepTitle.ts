type TitleType = {
    [key: number]: string;
};

const OPENSHIFT_STEP_TITLE: TitleType = {
    1: '복구계획 정보',
    2: '워크로드 기동계획',
    3: '워크로드 DNS Config 설정',
    4: '리소스 설정',
    5: '볼륨 설정',
};

const OPENSTACK_STEP_TITLE: TitleType = {
    1: `복구계획 정보`,
    2: `복구인스턴스 기동계획`,
    3: `리소스 매핑`,
    4: `컴퓨트 노드 매핑`,
};

export { OPENSHIFT_STEP_TITLE, OPENSTACK_STEP_TITLE };
