import React from 'react';
import { FormGroup, FormLabel, IconButton, Typography, useTheme } from '@mui/material';
import { createColumnHelper } from '@tanstack/table-core';
import { getI18n } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Controller, FieldValues } from 'react-hook-form';
import styled from 'styled-components';
import Grid2 from '@mui/material/Unstable_Grid2';
import Select, { components } from 'react-select';
import CloseIcon from '@mui/icons-material/Close';

import { OptionType } from '@/@types';
import { UserList } from '@/@types/Cloud/user';
import TableChip from '@component/common/Chip/TableChip';
import ActionsFormatter from '@component/common/Table/formatter/ActionsFormatter';
import TableHeader from '@component/common/Table/TableHeader';
import DefaultDialog from '@component/common/Dialog/DefaultDialog';
import DialogText from '@component/common/Dialog/DialogText';
import DefaultSelect from '@component/common/Select/DefaultSelect';
import FormTextField from '@component/common/TextField/FormTextField';

import {
    AccountFormGroupProps,
    AccountInformationFormGroupProps,
    AddAccountDialogProps,
    CreateColumnsProps,
    ModifyUserInfoModalProps,
    NewPasswordDialogProps,
    UserGroupFormGroupProps,
    UserGroupSelectProps,
    UserInformationFormGroupProps,
    UserRoleFormGroupProps,
} from './types';
import DisabledFormTextField from '@component/common/TextField/DisabledFormTextField';

// TODO: any 타입 수정하기
const MultiValueLabel = (props: any) => {
    return (
        <components.MultiValueLabel {...props}>
            <Typography>{props.data.label}</Typography>
        </components.MultiValueLabel>
    );
};

const MultiValueRemove = (props: any) => {
    return (
        <components.MultiValueRemove {...props}>
            <IconButton size="small">
                <CloseIcon />
            </IconButton>
        </components.MultiValueRemove>
    );
};

// 사용자 그룹 리스트
const UserGroups = <T extends FieldValues>({
    changeSelectedGroup,
    groups = [],
    defaultValue,
}: UserGroupSelectProps<T>) => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    // userGroupList => default gruop을 제외한 그룹 리스트
    // defaultGroup
    // selectedGroup => 추가된 사용자 그룹 리스트

    if (groups.length > 0) {
        return (
            <Select
                // TODO: 2023-09-07 기준
                // 현재 owner group 정의가 완벽하지 않아서 isDisabled=true, isMulti 를 주석처리
                isDisabled
                // isMulti
                onChange={e => {
                    changeSelectedGroup(e);
                }}
                menuPortalTarget={document.body}
                defaultValue={defaultValue}
                name="colors"
                options={groups}
                className={`${mode}-react-select`}
                classNamePrefix={`${mode}-react-select`}
                placeholder="사용자 그룹"
                components={{ MultiValueLabel, MultiValueRemove }}
            />
        );
    } else {
        return <Select name="colors" className={`${mode}-react-select`} classNamePrefix={`${mode}-react-select`} />;
    }
};

export const createColumns = ({ usersData, queryData, passSelectedRowDataToEdit }: CreateColumnsProps) => {
    const columnHelper = createColumnHelper<UserList>();

    return [
        columnHelper.accessor('account', {
            header: () => <TableHeader text={'사용자 ID'} />,
            cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
        }),
        columnHelper.accessor('name', {
            header: () => <TableHeader text={'사용자 이름'} />,
            cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
        }),
        columnHelper.accessor('department', {
            header: () => <TableHeader text={'사용자 부서'} />,
            cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
        }),
        columnHelper.accessor('position', {
            header: () => <TableHeader text={'사용자 직책'} />,
            cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
        }),
        columnHelper.accessor('session', {
            header: () => <TableHeader text={'상태'} />,
            cell: props => (
                <TableChip
                    color={props?.row.original?.session?.key ? 'user.login' : 'user.logout'}
                    label={props?.row.original?.session?.key ? 'user.login' : 'user.logout'}
                />
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <TableHeader text={'동작'} />,
            cell: props => (
                <ActionsFormatter
                    list={usersData?.users ?? []}
                    data={props?.row?.original}
                    editEvent={passSelectedRowDataToEdit}
                    type={'user'}
                    title={'사용자'}
                    setQueryData={queryData}
                    detailEvent={null}
                    addEvent={null}
                    monitoringEvent={null}
                    treeId={''}
                />
            ),
        }),
    ];
};

export const AddAccountDialog = ({ open, textTitle, onClose, onConfirm, isLoading }: AddAccountDialogProps) => {
    return (
        <>
            {open && (
                <DefaultDialog
                    maxWidth="xs"
                    open={open}
                    title={getI18n().t('CLOUD.USER.ACCOUNT.ADD_ACCOUNT')}
                    onClose={onClose}
                    onConfirm={onConfirm}
                    isLoading={isLoading}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    <DialogText title={textTitle} body={getI18n().t('CLOUD.USER.ACCOUNT.WANNA_ADD_ACCOUNT')} />
                </DefaultDialog>
            )}
        </>
    );
};

export const NewPasswordDialog = ({ open, textTitle, onClose, onConfirm }: NewPasswordDialogProps) => {
    const navigate = useNavigate();

    return (
        <>
            {open && (
                <DefaultDialog
                    maxWidth="xs"
                    open={open}
                    title={getI18n().t('CLOUD.USER.ACCOUNT.INITIAL_PWD')}
                    onClose={onClose}
                    onConfirm={() => {
                        navigate('/cloud/admin/users/userAccount');
                        onConfirm();
                    }}
                    actionType="confirm"
                >
                    <DialogText title={textTitle} body={getI18n().t('CLOUD.USER.ACCOUNT.CHECK_INITIAL_PWD')} />
                </DefaultDialog>
            )}
        </>
    );
};

const AccountFormGroup = <T extends FieldValues>({
    mode,
    resetField,
    control,
    userIdValidate,
    userDetail,
}: AccountFormGroupProps<T>) => {
    return (
        <FormGroup>
            {mode === 'add' && (
                <FormTextField<T>
                    label={getI18n().t('CLOUD.USER_MENU.USER_INFO.USER_ID')}
                    required={true}
                    name={'user.account' as any}
                    type="text"
                    resetField={resetField}
                    control={control}
                    rules={userIdValidate}
                />
            )}
            {mode === 'edit' && (
                <DisabledFormTextField
                    label={getI18n().t('CLOUD.USER_MENU.USER_INFO.USER_ID')}
                    name="account"
                    value={userDetail?.account}
                />
            )}
        </FormGroup>
    );
};

const UserRoleFormGroup = <T extends FieldValues>({
    mode,
    control,
    getValues,
    userSolutions,
}: UserRoleFormGroupProps<T>) => {
    const UserRoleSelect = ({ field }: { field: any }) => {
        return (
            <DefaultSelect
                {...field}
                options={userSolutions}
                label={getI18n().t('CLOUD.USER_MENU.USER_INFO.USER_ROLE')}
                onChange={(option: OptionType) => {
                    return mode === 'add'
                        ? field.onChange([{ id: option.value }])
                        : field.onChange([{ value: option.value }]);
                }}
                value={
                    userSolutions?.filter((solution: any) => {
                        if (field?.value) {
                            return mode === 'add'
                                ? solution.value === field?.value?.[0].id
                                : solution.value === field?.value?.[0].value;
                        }
                    })[0]
                }
            />
        );
    };

    return (
        <>
            {mode === 'add' && (
                <FormGroup sx={{ paddingBottom: '5px' }}>
                    <Controller
                        control={control}
                        name={'user.roles' as any}
                        render={({ field }) => <UserRoleSelect field={field} />}
                    />
                </FormGroup>
            )}
            {mode === 'edit' && (
                <FormGroup>
                    {getValues?.('user.id') === 1 ? (
                        <Controller
                            control={control}
                            name={'user.roles' as any}
                            render={({ field }) => {
                                return (
                                    <DefaultSelect
                                        {...field}
                                        disabled
                                        options={userSolutions}
                                        label={getI18n().t('CLOUD.USER_MENU.USER_INFO.USER_ROLE')}
                                    />
                                );
                            }}
                        />
                    ) : (
                        <Controller
                            control={control}
                            name={'user.roles' as any}
                            render={({ field }) => <UserRoleSelect field={field} />}
                        />
                    )}
                </FormGroup>
            )}
        </>
    );
};

const UserGroupFormGroup = <T extends FieldValues>({
    mode,
    control,
    getValues,
    userGroups,
    onChangeSelectedGroup,
}: UserGroupFormGroupProps<T>) => {
    return (
        <>
            {mode === 'add' && (
                <FormGroup>
                    <Label>{getI18n().t('CLOUD.USER.ACCOUNT.USER_GROUP')}</Label>
                    {userGroups && (
                        <UserGroups
                            groups={userGroups}
                            defaultValue={[userGroups[0]]}
                            control={control}
                            changeSelectedGroup={onChangeSelectedGroup}
                        />
                    )}
                </FormGroup>
            )}
            {mode === 'edit' && (
                <FormGroup sx={{ paddingTop: 'px' }}>
                    <Label>{getI18n().t('CLOUD.USER.ACCOUNT.USER_GROUP')}</Label>
                    {userGroups && (
                        <UserGroups
                            groups={userGroups}
                            defaultValue={getValues?.('user.groups')}
                            control={control}
                            changeSelectedGroup={onChangeSelectedGroup}
                        />
                    )}
                </FormGroup>
            )}
        </>
    );
};

export const AccountInformationFormGroup = <T extends FieldValues>({
    mode = 'add',
    userDetail,
    resetField,
    control,
    userIdValidate,
    getValues,
    userSolutions,
    userGroups,
    onChangeSelectedGroup,
}: AccountInformationFormGroupProps<T>) => {
    return (
        <FormWrapper>
            <DetailTitle>{getI18n().t('CLOUD.USER_MENU.USER_INFO.ACCOUNT_INFORMATION')}</DetailTitle>
            <AccountFormGroup
                mode={mode}
                resetField={resetField}
                control={control}
                userIdValidate={userIdValidate}
                userDetail={userDetail}
            />
            <UserRoleFormGroup mode={mode} control={control} getValues={getValues} userSolutions={userSolutions} />
            <UserGroupFormGroup
                mode={mode}
                control={control}
                getValues={getValues}
                userGroups={userGroups}
                onChangeSelectedGroup={onChangeSelectedGroup}
            />
        </FormWrapper>
    );
};

export const UserInformationFormGroups = <T extends FieldValues>({
    resetField,
    control,
    nameValidate,
    departmentValidate,
    positionValidate,
    emailValidate,
    contactValidate,
}: UserInformationFormGroupProps<T>) => {
    return (
        <FormWrapper>
            <DetailTitle>{getI18n().t('CLOUD.USER_MENU.USER_INFO.USER_INFORMATION')}</DetailTitle>
            <FormGroup>
                <FormTextField<T>
                    label={getI18n().t('CLOUD.USER_MENU.USER_INFO.NAME')}
                    required={true}
                    name={'user.name' as any}
                    type="text"
                    resetField={resetField}
                    control={control}
                    rules={nameValidate}
                />
            </FormGroup>
            <FormGroup>
                <FormTextField<T>
                    label={getI18n().t('CLOUD.USER_MENU.USER_INFO.DEPARTMENT')}
                    name={'user.department' as any}
                    type="text"
                    resetField={resetField}
                    control={control}
                    rules={departmentValidate}
                />
            </FormGroup>
            <FormGroup>
                <FormTextField<T>
                    label={getI18n().t('CLOUD.USER_MENU.USER_INFO.POSITION')}
                    name={'user.position' as any}
                    type="text"
                    resetField={resetField}
                    control={control}
                    rules={positionValidate}
                />
            </FormGroup>
            <FormGroup>
                <FormTextField<T>
                    label={getI18n().t('CLOUD.USER_MENU.USER_INFO.EMAIL')}
                    name={'user.email' as any}
                    type="text"
                    resetField={resetField}
                    control={control}
                    rules={emailValidate}
                />
            </FormGroup>
            <FormGroup>
                <FormTextField<T>
                    label={getI18n().t('CLOUD.USER_MENU.USER_INFO.CONTACT')}
                    name={'user.contact' as any}
                    type="tel"
                    resetField={resetField}
                    control={control}
                    rules={contactValidate}
                    placeholder="000-0000-0000"
                />
            </FormGroup>
        </FormWrapper>
    );
};

export const ModifyUserInfoModal = ({
    open,
    onClose,
    onConfirm,
    isLoading,
    title,
    name,
    body,
}: ModifyUserInfoModalProps) => {
    return (
        <DefaultDialog
            maxWidth="xs"
            open={open}
            title={title}
            onClose={onClose}
            onConfirm={onConfirm}
            isLoading={isLoading}
            actionType="confirm"
            buttonColor="primary"
        >
            <DialogText title={name} body={body} />
        </DefaultDialog>
    );
};

const DetailTitle = styled(Typography).attrs({ variant: 'h6' })`
    font-weight: 700;
    margin-bottom: 1rem;
`;

const FormWrapper = styled(Grid2).attrs({ xs: 12, sm: 12, md: 6 })`
    display: flex;
    flex-direction: column;
`;

const Label = styled(FormLabel)`
    font-weight: 700;
    padding-bottom: 5px;
`;
