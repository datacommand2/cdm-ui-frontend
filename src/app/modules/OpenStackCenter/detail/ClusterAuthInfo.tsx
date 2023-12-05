import React, { useState } from 'react';
import cryptojs from 'crypto-js';
import { Box, Divider, FormGroup } from '@mui/material';
import styled from 'styled-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import { clusterKeys } from '../../../../libs/utils/queryKeys';
import { _getClusterDetail, _modifyAuthInfo } from '../../../../api/center/cluster';
import ActionButton from '../../../component/common/Button/ActionButton';
import DefaultDialog from '../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../component/common/Dialog/DialogText';
import { Detail } from '../../../component/common/Detail/Detail';
import { LoginUser } from '../../../../recoil/atom/LoginUser';
import { SubmitHandler, useForm } from 'react-hook-form';
import FormTextField from '../../../component/common/TextField/FormTextField';
import DisabledFormTextField from '../../../component/common/TextField/DisabledFormTextField';
import { OpenStackCredentialEdit } from '../../../../@types/Cluster';

interface IForm {
    authType: string;
    address: string;
    account: string;
    password: string;
}
/**
 * 클러스터 인증 정보를 수정하는 컴포넌트
 */
const ClusterAuthInfo = () => {
    const location = useLocation();
    const loginUser = useRecoilValue(LoginUser);
    const role = loginUser?.roles?.[0]?.role ?? 'user';
    const ClusterID = Number(location.state.clusterID);

    const { t } = useTranslation();
    const fieldSetDisabled = role === 'user' || role === 'operator' ? true : false;
    const [authEditModal, setAuthEditModal] = useState(false);
    const [authInfo, setAuthInfo] = useState('');

    const queryClient = useQueryClient();

    // 인증 정보 수정하는 함수
    // method, address, account, password
    const { isLoading: modifyLoading, mutate: modifyAuthInfo } = useMutation(
        (payload: OpenStackCredentialEdit) => _modifyAuthInfo(ClusterID, payload),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    toast.success(t('DR.RP.CLUSTER_AUTH_MODIFIED'));
                    queryClient.invalidateQueries(clusterKeys.details());
                }
                setAuthEditModal(false);
            },
        },
    );

    // 클러스터 정보를 불러오는 함수
    const { data: clusterDetail } = useQuery(clusterKeys.detail(ClusterID), () => _getClusterDetail(ClusterID), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                return data.cluster;
            }
        },
        suspense: true,
    });

    const { handleSubmit, resetField, control } = useForm<IForm>({
        defaultValues: {
            authType: 'password',
            address: clusterDetail?.api_server_url ?? '',
            account: '',
            password: '',
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<IForm> = data => {
        setAuthEditModal(true);

        let password = data.password.split('').map(v => {
            if (v.match('"')) {
                return '\\'.concat(v);
            }
            return v;
        });

        // new password 암호화
        const new_str = `{ "methods": ["password"],"password": {"user": {"domain": {"name": "Default"},"name": "${
            data.account
        }", "password": "${password.join('')}"} } }`;

        const new_cipher = cryptojs.AES.encrypt(new_str, cryptojs.enc.Utf8.parse('cdm'), {
            iv: cryptojs.enc.Utf8.parse('cdm'),
            mode: cryptojs.mode.CBC,
        });

        const aes = new_cipher.toString();

        setAuthInfo(aes);
    };
    return (
        <Detail>
            <Detail.Title text={`${t('DR.CLUSTER_AUTH_INFO')}`} />
            <Detail.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset disabled={fieldSetDisabled || clusterDetail?.state_code === 'cluster.state.inactive'}>
                        <Wrapper>
                            <FormWrapper>
                                <FormItem>
                                    <FormGroup>
                                        <DisabledFormTextField
                                            label={t('DR.AUTHENTICATION_METHOD')}
                                            name="authType"
                                            value={'password'}
                                        />
                                    </FormGroup>
                                </FormItem>
                                <FormItem>
                                    <FormGroup>
                                        <DisabledFormTextField
                                            label={t('DR.IP_ADDRESS')}
                                            name="address"
                                            value={clusterDetail?.api_server_url}
                                        />
                                    </FormGroup>
                                </FormItem>
                            </FormWrapper>
                            <FormWrapper>
                                <FormItem>
                                    <FormGroup>
                                        <FormTextField<IForm>
                                            label={t('DR.ACCOUNT')}
                                            required={true}
                                            name="account"
                                            resetField={resetField}
                                            control={control}
                                            rules={{
                                                required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                            }}
                                        />
                                    </FormGroup>
                                </FormItem>
                                <FormItem>
                                    <FormGroup>
                                        <FormTextField<IForm>
                                            label={t('DR.PASSWORD')}
                                            required={true}
                                            type="password"
                                            name="password"
                                            resetField={resetField}
                                            control={control}
                                            rules={{
                                                required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                            }}
                                        />
                                    </FormGroup>
                                </FormItem>
                            </FormWrapper>
                        </Wrapper>
                        <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />
                        <Box sx={{ textAlign: 'right' }}>
                            <ActionButton buttonType="edit" type="submit" />
                        </Box>
                    </fieldset>
                    {authEditModal && clusterDetail && (
                        <DefaultDialog
                            maxWidth="xs"
                            open={authEditModal}
                            title={t('DR.CLUSTER_AUTH_INFO')}
                            onClose={() => {
                                setAuthEditModal(false);
                            }}
                            onConfirm={() =>
                                modifyAuthInfo({
                                    old_credential: clusterDetail.credential ?? '',
                                    new_credential: authInfo,
                                })
                            }
                            isLoading={modifyLoading}
                            actionType="confirm"
                            buttonColor="primary"
                        >
                            <DialogText title={clusterDetail?.name} body={t('DR.CLUSTER_AUTH_MODIFY_STORY')} />
                        </DefaultDialog>
                    )}
                </form>
            </Detail.Body>
        </Detail>
    );
};

export default ClusterAuthInfo;

const Wrapper = styled(Box)`
    padding: 20px;
    border-radius: 5px;
`;

const FormWrapper = styled(Grid2).attrs({ container: true, columnSpacing: 3 })``;

const FormItem = styled(Grid2).attrs({ md: 6, xs: 12 })``;
