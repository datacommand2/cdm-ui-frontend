import { DELETE, GET, PATCH, POST, PUT } from '../../libs/utils/axios';
import { sha256 } from 'js-sha256';
import { AddUser, Group, Role, User } from '../../@types/Cloud/user';
import { AxiosError } from 'axios';
import { ServiceConfig } from '../../@types/Cloud/config';
// 사용자 계정 상세 조회하는 함수
export const _getUserDetail = async (userID: number): Promise<[{ user: User }, Error | AxiosError, number]> => {
    return await GET(`/identity/users/${userID}`);
};

// 사용자 계정 목록을 조회하는 함수
export const _getUserList = async (limit: number, offset: number, name: string, isLogin: boolean) => {
    return await GET(`/identity/users?limit=${limit}&offset=${offset}&name="${name.trim()}"&login_only=${isLogin}`);
};

// 사용자 그룹 내 사용자 목록을 조회하는 함수
export const _getGroupUserList = async (
    limit: number | undefined,
    offset: number | undefined,
    name: string,
    groupID: number,
) => {
    if (limit) {
        return await GET(`/identity/users?limit=${limit}&offset=${offset}&name="${name.trim()}"&group_id=${groupID}`);
    } else {
        return await GET(`/identity/users?group_id=${groupID}`);
    }
};

// 그룹 내 속해있는 사용자를 제외한 모든 사용자 목록을 조회하는 함수
export const _getUserListInGroup = async (groupID: number) => {
    return await GET(`/identity/users?exclude_group_id=${groupID}`);
};

// 사용자 그룹 목록을 조회하는 함수
export const _getUserGroupList = async (): Promise<[{ groups: Group[] }, Error | AxiosError, number]> => {
    return await GET(`/identity/groups`);
};

// 사용자 그룹 상세 조회하는 함수
export const _getUserGroupDetail = async (groupID: number) => {
    return await GET(`/identity/groups/${groupID}`);
};

// 솔루션 역할 목록을 조회하는 함수
export const _getSolutionList = async (): Promise<[{ roles: Role[] }, Error | AxiosError, number]> => {
    return await GET(`/identity/roles`);
};

// TODO: editUserType
// 사용자 정보를 수정하는 함수
export const _modifyUserInfo = async (userID: number | undefined, userInfo: any) => {
    return await PATCH(`/identity/users/${userID}`, { user: userInfo });
};

// 사용자를 삭제하는 함수
export const _deleteUser = async (userID: number) => {
    return await DELETE(`/identity/users/${userID}`);
};

// 사용자 로그아웃 시키는 함수
export const _logoutUser = async (session: string) => {
    return await DELETE(`/identity/sessions/${session}`);
};

// 사용자 패스워드 초기화하는 함수
export const _resetUserPassword = async (userID: number) => {
    return await POST(`/identity/users/${userID}/password-reset`);
};

// 사용자를 추가하는 함수
export const _addUser = async (userInfo: AddUser) => {
    return await POST(`/identity/users`, { user: userInfo });
};

// TODO: addGroup Type
// 사용자 그룹을 생성하는 함수
export const _addUserGroup = async (groupInfo: any) => {
    return await POST(`/identity/groups`, { group: groupInfo });
};

// 사용자 그룹을 삭제하는 함수
export const _deleteUserGroup = async (groupID: number) => {
    return await DELETE(`/identity/groups/${groupID}`);
};

// TODO: editGroup Type
// 사용자 그룹을 수정하는 함수
export const _modifyUserGroup = async (groupID: number, groupInfo: any) => {
    return await PATCH(`/identity/groups/${groupID}`, { group: groupInfo });
};

// TODO: users type
// 사용자 그룹 사용자 목록 수정하는 함수
export const _modifyUserListInGroup = async (groupID: number, users: any) => {
    return await PUT(`/identity/groups/${groupID}/users`, { users });
};

type editPassword = {
    current_password: string;
    new_password: string;
};
// 사용자 패스워드 변경하는 함수
export const _modifyUserPassword = async (userID: number | undefined, passwordInfo: editPassword) => {
    return await POST(`/identity/users/${userID}/password`, passwordInfo);
};

// 사용자 인증 설정 조회하는 함수
export const _getAccountConfig = async () => {
    return await GET(`/identity/config`);
};

// TODO: config tyep
// 사용자 인증 설정 변경하는 함수
export const _modifyAccountConfig = async (config: any) => {
    return await PUT(`/identity/config`, config);
};

// 로그인하는 함수
// 첫 번째 글자가 예약어 => 예약어 떼고 sha256
// 첫 번째 글자가 예약어 아니면 => 암호화 v1
export const _login = async (account: string, password: string) => {
    return await POST('/identity/auth', {
        account,
        password:
            password.charAt(0) === '@'
                ? sha256(password.substring(1, password.length))
                : sha256(password + sha256(account)),
        force: true,
    });
};

// 로그아웃하는 함수
export const _logout = async () => {
    return await DELETE('/identity/auth');
};

// 세션 체크하는 함수
export const _checkSession = async () => {
    return await GET('/identity/sessions/check');
};

/**
 * 서비스 설정 조회
 */
export const _getServiceConfig = async (): Promise<
    [{ service_configs: ServiceConfig[] | null }, Error | AxiosError, number]
> => {
    return await GET(`/identity/service-config`);
};

/**
 * 서비스 설정 추가, 수정
 */
export const _updateServiceConfig = async (services: ServiceConfig[]) => {
    return await PUT(`/identity/service-config`, { service_config: services });
};

/**
 * 서비스 설정 삭제
 */
export const _deleteServiceConfig = async (services: ServiceConfig[]) => {
    return await POST(`/identity/service-config`, { service_config: services });
};
