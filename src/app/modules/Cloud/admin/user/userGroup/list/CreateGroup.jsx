import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormGroup } from '@mui/material';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { checkNamingRule } from '../../../../../../../libs/utils/regex';
import { userGroupKeys, userKeys } from '../../../../../../../libs/utils/queryKeys';
import { _addUserGroup } from '../../../../../../../api/cloud/identity';
import DefaultTextField from '../../../../../../component/common/TextField/DefaultTextField';
import ActionButton from '../../../../../../component/common/Button/ActionButton';
import DefaultDialog from '../../../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../../../component/common/Dialog/DialogText';

export const CreateGroup = ({ onConfirm, onClose, open }) => {
    const { t } = useTranslation();
    const [addInfo, setAddInfo] = useState({});
    const [addModal, setAddModal] = useState(false);
    const initialValues = {
        tenant: {
            id: 1,
        },
        name: '',
        remarks: '',
    };

    const queryClient = useQueryClient();

    const groupInfo = Yup.object().shape({
        name: Yup.string()
            .min(3, t('FORM.VALIDATION.GROUP_NAME'))
            .max(50, t('FORM.VALIDATION.GROUP_NAME'))
            .matches(checkNamingRule, t('FORM.VALIDATION.SPECIAL.CHARACTER'))
            .required(t('FORM.VALIDATION.REQUIRED')),
        remarks: Yup.string().max(300, t('FORM.VALIDATION.GROUP_REMARK')),
    });

    // 그룹 생성하는 함수
    // Modal 컴포넌트의 onConfirm 함수의 onSubmit으로 실행됨
    const { isLoading: addLoading, mutate: addGroup } = useMutation(payload => _addUserGroup(payload), {
        onSuccess: ([data, error, status]) => {
            if (status === 200 || status === 201) {
                toast.success(t('CLOUD.USER.GROUP.SUCCESS_ADD_GROUP'));
                queryClient.invalidateQueries(userGroupKeys.lists());
                queryClient.invalidateQueries(userKeys.details());
            }
            setAddModal(false);
            onClose();
        },
    });

    return (
        <>
            <Dialog open={open} fullWidth maxWidth="sm">
                <DialogTitle>{t('CLOUD.USER.GROUP.CREATE_GROUP')}</DialogTitle>
                <Divider />
                <Formik
                    initialValues={initialValues}
                    validationSchema={groupInfo}
                    onSubmit={values => {
                        setAddInfo(values);
                        setAddModal(true);
                    }}
                >
                    {({ values, touched, errors, handleChange, handleSubmit, handleBlur, setFieldValue }) => (
                        <form onSubmit={handleSubmit}>
                            <DialogContent>
                                <FormGroup>
                                    <DefaultTextField
                                        label={t('CLOUD.USER.GROUP.GROUP_NAME')}
                                        type="text"
                                        name="name"
                                        onReset={() => setFieldValue('name', '')}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
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
                                        rows={2}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.remarks}
                                        multiline
                                        helperText={errors.remarks && touched.remarks ? errors.remarks : ' '}
                                        error={errors.remarks && touched.remarks}
                                    />
                                </FormGroup>
                            </DialogContent>
                            <Divider />
                            <DialogActions>
                                <ActionButton buttonType={'cancel'} onClick={onClose} />
                                <ActionButton buttonType={'add'} type="submit" />
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </Dialog>

            {addModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={addModal}
                    title={t('CLOUD.USER.GROUP.CREATE_GROUP')}
                    onClose={() => {
                        setAddModal(false);
                    }}
                    onConfirm={() => {
                        addGroup(addInfo);
                    }}
                    isLoading={addLoading}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    <DialogText title={addInfo?.name} body={t('CLOUD.USER.GROUP.USER_GROUP_STORY')} />
                </DefaultDialog>
            )}
        </>
    );
};
