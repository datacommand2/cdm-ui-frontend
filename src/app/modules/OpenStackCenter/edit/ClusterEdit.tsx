import { Box, CardActions, CardContent, Divider, FormGroup, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { SubmitHandler, useForm } from 'react-hook-form';

import { clusterKeys } from '../../../../libs/utils/queryKeys';
import { _getClusterDetail, _modifyCluster } from '../../../../api/center/cluster';
import ActionButton from '../../../component/common/Button/ActionButton';
import DefaultDialog from '../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../component/common/Dialog/DialogText';
import { PATHNAME } from '../../../../constant/pathname';
import { aesDecryption, findLastWord } from '../../../../libs/utils/commonFunction';
import { checkNamingRule } from '../../../../libs/utils/regex';
import { LoginUser } from '../../../../recoil/atom/LoginUser';
import { ClusterTypeCode } from '../../../../@types/Cluster';
import FormTextField from '../../../component/common/TextField/FormTextField';
import DisabledFormTextField from '../../../component/common/TextField/DisabledFormTextField';

interface IForm {
    name: string;
    remarks?: string;
    id: number;
    owner_group: {
        id: number;
    };
    type_code: ClusterTypeCode;
    api_server_url: string;
}

/**
 * 클러스터 수정 페이지
 */
const ClusterEdit = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const loginUser = useRecoilValue(LoginUser);
    const role = loginUser?.roles ? loginUser.roles[0]?.role : 'user';

    const [editModal, setEditModal] = useState(false);

    const ClusterID = Number(location.state.clusterID);

    const queryClient = useQueryClient();
    const fieldSetDisabled = role === 'user' || role === 'operator' ? true : false;

    // 클러스터 정보를 불러오는 함수
    const { data: clusterDetail } = useQuery(clusterKeys.detail(ClusterID), () => _getClusterDetail(ClusterID), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                return data.cluster;
            }
        },
        suspense: true,
    });

    const { handleSubmit, resetField, control, getValues } = useForm<IForm>({
        defaultValues: {
            id: ClusterID,
            owner_group: {
                id: clusterDetail?.owner_group.id,
            },
            name: clusterDetail?.name,
            remarks: clusterDetail?.remarks,
            type_code: clusterDetail?.type_code,
            api_server_url: clusterDetail?.api_server_url,
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<IForm> = () => {
        setEditModal(true);
    };

    const NameValidate = {
        required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
        maxLength: { value: 50, message: t('DR.RP.ENTER_NAME') },
        minLength: { value: 3, message: t('DR.RP.ENTER_NAME') },
        pattern: {
            value: checkNamingRule,
            message: t('FORM.VALIDATION.SPECIAL.CHARACTER'),
        },
    };

    // 클러스터를 수정하는 함수
    const { isLoading: modifyLoading, mutate: modifyClusterInfo } = useMutation(
        () => _modifyCluster(ClusterID, getValues()),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    toast.success(t('DR.RP.CLUSTER_MODIFIED'));
                    queryClient.invalidateQueries(clusterKeys.details());
                    navigate(PATHNAME.CLUSTER);
                }
                setEditModal(false);
            },
        },
    );

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                    <fieldset disabled={fieldSetDisabled || clusterDetail?.state_code === 'cluster.state.inactive'}>
                        <Wrapper>
                            <FormWrapper>
                                <FormTitle>{t('DR.CLUSTER_INFO')}</FormTitle>
                                <ClusterForm>
                                    <FormGroup>
                                        <FormTextField<IForm>
                                            label={t('DR.NAME')}
                                            required={true}
                                            name="name"
                                            resetField={resetField}
                                            control={control}
                                            rules={NameValidate}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <DisabledFormTextField
                                            label={t('DR.TYPE')}
                                            name="account"
                                            value={findLastWord(clusterDetail?.type_code).toUpperCase()}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <DisabledFormTextField
                                            label={t('DR.OWNER_GROUP')}
                                            name="account"
                                            value={clusterDetail?.owner_group.name}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <FormTextField<IForm>
                                            label={t('DR.REMARK')}
                                            name="remarks"
                                            multiline
                                            rows={4}
                                            control={control}
                                            resetField={resetField}
                                            rules={{
                                                maxLength: { value: 300, message: t('DR.RP.ENTER_300') },
                                            }}
                                        />
                                    </FormGroup>
                                </ClusterForm>
                            </FormWrapper>
                            <FormWrapper>
                                <FormTitle>클러스터 인증</FormTitle>
                                <ClusterForm>
                                    <FormGroup>
                                        <DisabledFormTextField
                                            label={t('DR.AUTHENTICATION_METHOD')}
                                            name="account"
                                            value={aesDecryption(clusterDetail?.credential, 'cdm', 'cdm')?.method}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <DisabledFormTextField
                                            label={t('DR.IP_ADDRESS')}
                                            name="account"
                                            value={clusterDetail?.api_server_url}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <DisabledFormTextField
                                            label={t('DR.ACCOUNT')}
                                            name="account"
                                            value={aesDecryption(clusterDetail?.credential, 'cdm', 'cdm')?.account}
                                        />
                                    </FormGroup>
                                </ClusterForm>
                            </FormWrapper>
                        </Wrapper>
                    </fieldset>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <ActionButton
                        buttonType="cancel"
                        onClick={() => {
                            navigate('/cluster');
                        }}
                        type="submit"
                    />
                    <ActionButton buttonType="edit" type="submit" />
                </CardActions>
                {editModal && (
                    <DefaultDialog
                        open={editModal}
                        title={t('DR.CLUSTER_MODIFY')}
                        maxWidth="xs"
                        onClose={() => {
                            setEditModal(false);
                        }}
                        onConfirm={modifyClusterInfo}
                        isLoading={modifyLoading}
                        actionType="confirm"
                        buttonColor="primary"
                    >
                        <DialogText title={clusterDetail?.name} body={t('DR.CLUSTER_MODIFY_STORY')} />
                    </DefaultDialog>
                )}
            </form>
        </>
    );
};

export default ClusterEdit;

const Wrapper = styled(Grid2).attrs({ container: true, columnSpacing: 4 })`
    padding-left: 1rem;
    padding-right: 1rem;
`;

const FormWrapper = styled(Grid2).attrs({ md: 6, xs: 12 })``;

const ClusterForm = styled(Box)`
    padding-left: 1rem;
    padding-right: 1rem;
`;

const FormTitle = styled(Typography).attrs({ variant: 'h6' })`
    font-weight: 500;
    margin-bottom: 1rem;
`;
