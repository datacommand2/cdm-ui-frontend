import { Tenant } from './user';

/**
 * 이벤트 목록 인터페이스
 */
export interface EventListInterface {
    id: number;
    tenant: Tenant;
    solution: string;
    level: string;
    code: string;
    error_code?: string;
    contents?: string;
    created_at: number;
    class_1: string;
    class_3?: string;
}

/**
 * 이벤트 코드 분류 목록
 */
export interface EventClassification {
    solution: string;
    class_1: string;
    class_2?: string;
    class_3?: string;
}

/**
 * 이벤트 상세 인터페이스
 */
export interface EventDetail {
    id: number;
    tenant: {
        id: number;
        name?: string;
    };
    code: string;
    error_code?: string;
    contents?: string;
    created_at: number;
    solution?: string;
    level?: string;
    class_1?: string;
    class_3?: string;
}
