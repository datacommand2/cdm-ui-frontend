import { AddUser, User, UserList } from '@/@types/Cloud/user';
import { Control, FieldValues, UseFormResetField } from 'react-hook-form';

export interface QueryData {
    inputData: string;
    limit: number;
    offset: number;
    isLogin: boolean;
}

export interface UsersData {
    users: UserList[];
    pagination: any;
    status: number;
}

export interface UserGroupSelectProps<T extends FieldValues> {
    changeSelectedGroup: (value: any) => void;
    groups: {
        value: number;
        label: string;
    }[];
    defaultValue:
        | {
              value: number;
              label: string;
          }[]
        | undefined;
    control: Control<T>;
}

export interface IFormAddUser {
    user: AddUser;
}

export interface IFormEditUser {
    user: {
        id: number;
        tenant: {
            id: number;
        };
        roles?: { value: number; label: string }[];
        groups?: { value: number; label: string }[];
        timezone: string;
        language_set: string;
        name: string;
        department?: string;
        position?: string;
        email?: string;
        contact?: string;
    };
}

export interface CreateColumnsProps {
    usersData?: UsersData;
    queryData: QueryData;
    passSelectedRowDataToEdit: (e: React.MouseEvent<HTMLElement>) => void;
}

export interface AddAccountDialogProps {
    open: boolean;
    textTitle: string;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export interface NewPasswordDialogProps {
    open: boolean;
    textTitle: string;
    onClose: () => void;
    onConfirm: () => void;
}

export type UserGroupsType = { value: number; label: string }[] | undefined;

export type UserSolutionsType = { value: number; label: 'admin' | 'manager' | 'operator' | 'viewer' }[] | undefined;

// User Account userId field validation 타입
export interface UserIdValidateType {
    required: {
        value: boolean;
        message: any;
    };
    maxLength: {
        value: number;
        message: any;
    };
    minLength: {
        value: number;
        message: any;
    };
    pattern: {
        value: RegExp;
        message: any;
    };
}

// User information name field validation 타입
export interface NameValidateType {
    required: {
        value: boolean;
        message: any;
    };
    maxLength: {
        value: number;
        message: any;
    };
    minLength: {
        value: number;
        message: any;
    };
    pattern: {
        value: RegExp;
        message: any;
    };
}

// User information department field validation 타입
export interface DepartmentValidateType {
    maxLength: {
        value: number;
        message: any;
    };
}

// User information position field validation 타입
export interface PositionValidateType {
    maxLength: {
        value: number;
        message: any;
    };
}

// User information email field validation 타입
export interface EmailValidateType {
    maxLength: {
        value: number;
        message: any;
    };
}

// User information contact field validation 타입
export interface ContactValidateType {
    maxLength: {
        value: number;
        message: any;
    };
    minLength: {
        value: number;
        message: any;
    };
    pattern: {
        value: RegExp;
        message: any;
    };
}

export interface AccountInformationFormGroupProps<T extends FieldValues> {
    mode: 'add' | 'edit';
    userDetail?: User;
    resetField: UseFormResetField<T>;
    control: Control<T, any>;
    userIdValidate?: UserIdValidateType;
    getValues?: any;
    userSolutions: UserSolutionsType;
    userGroups: UserGroupsType;
    onChangeSelectedGroup: (e: any) => void;
}

export interface AccountFormGroupProps<T extends FieldValues> {
    mode: 'add' | 'edit';
    resetField: UseFormResetField<T>;
    control: Control<T, any>;
    userIdValidate?: UserIdValidateType;
    userDetail?: User;
}

export interface UserRoleFormGroupProps<T extends FieldValues> {
    mode: 'add' | 'edit';
    control: Control<T, any>;
    getValues?: any;
    userSolutions: UserSolutionsType;
}

export interface UserGroupFormGroupProps<T extends FieldValues> {
    mode: 'add' | 'edit';
    control: Control<T, any>;
    getValues?: any;
    userGroups: UserGroupsType;
    onChangeSelectedGroup: (e: any) => void;
}

export interface UserInformationFormGroupProps<T extends FieldValues> {
    mode: 'add' | 'edit';
    resetField: UseFormResetField<T>;
    control: Control<T, any>;
    nameValidate: NameValidateType;
    departmentValidate: DepartmentValidateType;
    positionValidate: PositionValidateType;
    emailValidate: EmailValidateType;
    contactValidate: ContactValidateType;
}

export interface ModifyUserInfoModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    title: string;
    name: string;
    body: string;
}
