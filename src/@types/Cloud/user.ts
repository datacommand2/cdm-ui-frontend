export type Tenant = {
    id: number;
    name: string;
    use_flag?: boolean;
    solutions?: string[];
    remarks?: string;
    created_at: number;
    updated_at?: number;
};

export type Role = {
    id: number;
    solution: string;
    role: 'admin' | 'manager' | 'operator' | 'viewer';
};

export type Group = {
    id: number;
    tenant: Tenant;
    name: string;
    remarks?: string;
    created_at: number;
    updated_at?: number;
};
/**
 * 사용자 상세정보 타입
 */
export type User = {
    id: number;
    account: string;
    tenant?: Tenant;
    roles?: Role[];
    groups?: Group[];
    timezone: string;
    language_set?: string;
    name: string;
    department?: string;
    position?: string;
    email?: string;
    contact?: string;
    password_updated_at?: number;
    password_update_flag?: boolean;
    last_logged_in_at?: number;
    craeted_at: number;
    updated_at?: number;
    session: {
        key: string;
    };
};

/**
 * 사용자 추가 Payload 타입
 */
export type AddUser = {
    account: string;
    tenant: {
        id: number;
    };
    roles?: {
        id: number;
    }[];
    groups?: {
        id: number;
    }[];
    timezone: string;
    language_set: string;
    name: string;
    department?: string;
    position?: string;
    email?: string;
    contact?: string;
};

/**
 * 사용자 수정 Payload 타입
 */
export type EditUser = {
    id: number;
    tenant: {
        id: number;
    };
    roles?: {
        id: number;
    }[];
    groups?: {
        id: number;
    }[];
    timezone: string;
    language_set: string;
    name: string;
    department?: string;
    position?: string;
    email?: string;
    contact?: string;
};

/**
 * 사용자 계정 비밀번호 변경 Payload 타입
 */
export type EditPassword = {
    current_password: string;
    new_password: string;
    new_password_confirm?: string;
};

/**
 * 사용자 목록 인터페이스
 */
export interface UserList {
    id: number;
    account: string;
    tenant?: Tenant;
    roles?: Role[];
    groups?: Group[];
    timezone: string;
    language_set?: string;
    name: string;
    department?: string;
    position?: string;
    email?: string;
    contact?: string;
    password_updated_at?: number;
    password_update_flag?: boolean;
    last_logged_in_at?: number;
    craeted_at: number;
    updated_at?: number;
    session: {
        key: string;
    };
}
