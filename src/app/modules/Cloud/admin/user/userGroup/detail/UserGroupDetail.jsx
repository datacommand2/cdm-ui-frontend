import React, { useState } from 'react';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Box, CardActions, CardContent, Divider, FormGroup } from '@mui/material';

import { _deleteUserGroup, _getUserGroupDetail, _modifyUserGroup } from '../../../../../../../api/cloud/identity';
import { checkNamingRule } from '../../../../../../../libs/utils/regex';
import { userGroupKeys, userKeys } from '../../../../../../../libs/utils/queryKeys';
import ActionButton from '../../../../../../component/common/Button/ActionButton';
import DefaultTextField from '../../../../../../component/common/TextField/DefaultTextField';
import DefaultDialog from '../../../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../../../component/common/Dialog/DialogText';

/**
 * 그룹 상세 정보를 보여주는 컴포넌트
 */
const UserGroupDetail = ({ selectedGroupId, setInitClick }) => {
    const { t } = useTranslation();
    const [isDeleteModalShow, setDeleteModalState] = useState(false);
    const [isModifyGroupModalShow, setModifyGroupModalShow] = useState(false);
    // 사용자 그룹을 수정할 때 보낼 파라미터
    const [modifyGroupInfo, setModifyGroupInfo] = useState({});

    const queryClient = useQueryClient();

    // 사용자 그룹을 삭제하면 initClick = false
    const initDisplay = () => {
        setInitClick(false);
    };

    // List 그룹 상세 정보 받아오는 함수
    const { data: groupDetail } = useQuery(
        userGroupKeys.detail(selectedGroupId),
        () => _getUserGroupDetail(selectedGroupId),
        {
            select: ([data, error, status]) => {
                if (status === 200 || status === 201) {
                    return data.group;
                }
            },
            keepPreviousData: true,
        },
    );

    // 사용자 그룹을 삭제하는 함수
    const { isLoading: deleteLoading, mutate: deleteUserGroup } = useMutation(() => _deleteUserGroup(selectedGroupId), {
        onSuccess: ([data, error, status]) => {
            if (status === 200 || status === 201) {
                toast.success(t('CLOUD.USER.GROUP.SUCCESS_DELETE_GROUP'));
                initDisplay();
                queryClient.invalidateQueries(userGroupKeys.lists());
                queryClient.invalidateQueries(userKeys.details());
            }
            setDeleteModalState(false);
        },
    });

    // 사용자 그룹을 수정하는 함수
    const { isLoading: modifyLoading, mutate: modifyUserGroup } = useMutation(
        payload => _modifyUserGroup(selectedGroupId, payload),
        {
            onSuccess: ([data, error, status]) => {
                if (status === 200 || status === 201) {
                    toast.success(t('CLOUD.USER.GROUP.SUCCESS_MODIFY_GROUP_DETAIL'));
                    queryClient.invalidateQueries(userGroupKeys.lists());
                }
                setModifyGroupModalShow(false);
            },
        },
    );

    return (
        <>
            <Formik
                initialValues={{
                    id: groupDetail?.id,
                    tenant: {
                        id: 1,
                    },
                    name: groupDetail?.name,
                    remarks: groupDetail?.remarks ?? '',
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    name: Yup.string()
                        .matches(checkNamingRule, t('FORM.VALIDATION.SPECIAL.CHARACTER'))
                        .min(3, t('FORM.VALIDATION.GROUP_NAME'))
                        .max(50, t('FORM.VALIDATION.GROUP_NAME'))
                        .required(t('FORM.VALIDATION.REQUIRED')),
                    remarks: Yup.string().max(300, t('FORM.VALIDATION.GROUP_REMARK')),
                })}
                onSubmit={values => {
                    setModifyGroupModalShow(true);
                    setModifyGroupInfo(values);
                }}
            >
                {({ values, touched, errors, handleChange, handleSubmit, handleBlur, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <CardContent>
                            <Form>
                                <FormGroup>
                                    <DefaultTextField
                                        label={t('CLOUD.USER.GROUP.GROUP_NAME')}
                                        type="text"
                                        name="name"
                                        onReset={() => setFieldValue('name', '')}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        disabled={Number(values.id) === 1}
                                        required={true}
                                        helperText={errors.name && touched.name ? errors.name : ' '}
                                        error={errors.name && touched.name}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <DefaultTextField
                                        label={t('CLOUD.USER.GROUP.GROUP_DESC')}
                                        type="text"
                                        name="remarks"
                                        onReset={() => setFieldValue('remarks', '')}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.remarks}
                                        rows={2}
                                        multiline
                                        helperText={errors.remarks && touched.remarks ? errors.remarks : ' '}
                                        error={errors.remarks && touched.remarks}
                                    />
                                </FormGroup>
                            </Form>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <ActionButton
                                disabled={Number(values.id) === 1}
                                onClick={e => {
                                    e.preventDefault();
                                    setDeleteModalState(true);
                                }}
                                buttonType="delete"
                            />
                            <ActionButton onClick={e => e.stopPropagation()} buttonType="edit" />
                        </CardActions>
                    </form>
                )}
            </Formik>
            {isModifyGroupModalShow && (
                <DefaultDialog
                    maxWidth="xs"
                    open={isModifyGroupModalShow}
                    title={t('CLOUD.USER.GROUP.USER_GROUP_MODIFY')}
                    onClose={() => {
                        setModifyGroupModalShow(false);
                    }}
                    onConfirm={() => modifyUserGroup(modifyGroupInfo)}
                    isLoading={modifyLoading}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    <DialogText title={groupDetail?.name} body={t('CLOUD.USER.GROUP.WANNA_MODIFY_USER_GROUP')} />
                </DefaultDialog>
            )}
            {isDeleteModalShow && (
                <DefaultDialog
                    maxWidth="xs"
                    open={isDeleteModalShow}
                    title={t('CLOUD.USER.GROUP.USER_GROUP_DELETE')}
                    onClose={() => {
                        setDeleteModalState(false);
                    }}
                    onConfirm={deleteUserGroup}
                    isLoading={deleteLoading}
                    actionType="confirm"
                    buttonColor="error"
                >
                    <DialogText title={groupDetail?.name} body={t('CLOUD.USER.GROUP.WARN_DELETE_GROUP')} />
                </DefaultDialog>
            )}
        </>
    );
};

export default UserGroupDetail;

const Form = styled(Box)`
    padding-left: 1rem;
    padding-right: 1rem;
`;
