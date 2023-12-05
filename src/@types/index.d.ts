export type OptionType = {
    label: string;
    value: string;
    isDisabled?: boolean;
};

/**
 * 인스턴스 템플릿 인터페이스
 */
export interface InstanceTemplateProps {
    id: number;
    name: string;
    remarks?: string;
    created_at?: number;
    instances: TemplateInstance[];
}

/**
 * 인스턴스 템플릿 추가 인터페이스
 */
export interface AddInstanceTemplateProps {
    name: string;
    remarks?: string;
    instances?: TemplateInstance[];
    owner_group: {
        id: number;
    };
}
/**
 * 인스턴스 템플릿 상세 타입
 */
export type TemplateInstance = {
    protection_cluster_instance_name: string;
    auto_start_flag?: boolean;
    diagnosis_flag?: boolean;
    diagnosis_method_code?: string;
    diagnosis_method_data?: string;
    diagnosis_timeout?: number;
    dependencies?: { id?: string; name?: string }[];
};

/**
 * 인스턴스 템플릿 상세정보에 존재하는 인스턴스 타입
 */
export type TemplateDetailInstance = {
    auto_start_flag?: boolean;
    protection_cluster_instance_name: string;
    dependencies?: { name: string }[];
};

/**
 * 오픈시프트 워크로드 타입
 */
export type Workload = {
    id: number;
    group?: string;
    version: string;
    kind?: string;
    namespace?: string;
    name: string;
    resources?: Resource[];
};

/**
 * 오픈시프트 워크로드의 리소스 타입
 */
export type Resource = {
    id: number;
    uid: number;
    group?: string;
    version: string;
    kind?: string;
    namespace?: string;
    name: string;
    resource_version?: string;
    manifest?: string;
};

/**
 * Recovery Point Objective 타입
 */
export type RPOs =
    | 'recovery.point.objective.type.minute'
    | 'recovery.point.objective.type.hour'
    | 'recovery.point.objective.type.day';

/**
 * Snapshot Interval Type 타입
 */
export type SnapShotIntervals =
    | 'snapshot.interval.type.minutely'
    | 'snapshot.interval.type.hourly'
    | 'snapshot.interval.type.daily';

export interface Pagination {
    page: number;
    total_page: number;
    total_items: number;
}

// useQuery 함수의 select 함수의 반환 타입
export type QueryCallback = (data?: any) => void;

export interface SideBarTreeItemParams {
    id?: number;
    name?: string;
    resource_name?: string;
}

/**
 * 메시지
 * @export
 * @interface Message
 */
export interface Message {
    /**
     * 메시지 코드
     * @type {string}
     * @memberof Message
     */
    code?: string;
    /**
     * 메시지 상세 내용 데이터
     * @type {string}
     * @memberof Message
     */
    contents?: string;
}

/**
 * 목록조회 페이지 정보
 * @export
 * @interface Pagination
 */
export interface Pagination {
    /**
     * 현재 페이지
     * @type {number}
     * @memberof Pagination
     */
    page?: number;
    /**
     * 전체 페이지의 수
     * @type {number}
     * @memberof Pagination
     */
    total_page?: number;
    /**
     * 검색된 아이템 전체 아이템 수
     * @type {number}
     * @memberof Pagination
     */
    total_items?: number;
}
