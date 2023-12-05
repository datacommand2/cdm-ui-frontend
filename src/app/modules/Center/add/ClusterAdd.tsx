import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, CardActions, CardContent, Divider, FormGroup, Typography } from '@mui/material';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

import { checkNamingRule } from '../../../../libs/utils/regex';
import { _addCluster } from '../../../../api/center/cluster';
import { _getUserDetail } from '../../../../api/cloud/identity';
import ActionButton from '../../../component/common/Button/ActionButton';
import { clusterKeys, userKeys } from '../../../../libs/utils/queryKeys';
import DefaultSelect from '../../../component/common/Select/DefaultSelect';
import DefaultDialog from '../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../component/common/Dialog/DialogText';
import OpenStackAuthentication from '../../OpenStackCenter/add/OpenStackAuthentication';
import { LoginUser } from '../../../../recoil/atom/LoginUser';
import { ClusterTypeCode } from '../../../../@types/Cluster';
import FormTextField from '../../../component/common/TextField/FormTextField';
import { OptionType } from '../../../../@types';

type ClusterOptionType = {
    value: ClusterTypeCode;
    label: string;
};

const clusterTypeOptions: ClusterOptionType[] = [{ value: 'cluster.type.openstack', label: 'OpenStack' }];

interface IForm {
    name: string;
    type_code: ClusterTypeCode;
    owner_group: {
        id: number;
    };
    remarks: string;
    api_server_url?: string;
    account?: string;
    password?: string;
    port?: string;
    broker_port?: string;
    credential: string;
}

/**
 * 클러스터 추가 페이지
 */
export function ClusterAdd() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    // 로그인 한 유저의 정보
    const loginUser = useRecoilValue(LoginUser);
    const [isAuth, setAuth] = useState(false);
    const [isModalOpen, setModalState] = useState(false);

    const queryClient = useQueryClient();

    // owner group list 를 받아오는 함수(로그인한 유저의 정보)
    const { data: ownerGroupList } = useQuery(userKeys.detail(loginUser.id), () => _getUserDetail(loginUser.id), {
        select: ([data, , status]) => {
            if (status === 200 || status === 201) {
                if (data.user?.groups) {
                    return data.user?.groups.map(group => {
                        return { value: group.id, label: group.name };
                    });
                } else {
                    return [];
                }
            } else if (status === 204) {
                return [];
            }
        },
        suspense: true,
    });

    const { handleSubmit, control, resetField, setValue, getValues, getFieldState, trigger } = useForm<IForm>({
        defaultValues: {
            name: '',
            type_code: clusterTypeOptions[0].value,
            owner_group: {
                id: ownerGroupList?.[0].value ?? 0,
            },
            remarks: '',
            api_server_url: '',
            account: '',
            password: '',
            port: '',
            broker_port: '',
            credential: '',
        },
        mode: 'all',
    });
    const NameValidate = {
        required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
        maxLength: { value: 50, message: t('DR.RP.ENTER_NAME') },
        minLength: { value: 3, message: t('DR.RP.ENTER_NAME') },
        pattern: {
            value: checkNamingRule,
            message: t('FORM.VALIDATION.SPECIAL.CHARACTER'),
        },
    };
    // 클러스터를 추가하는 함수
    const { isLoading: addLoading, mutate: addCluster } = useMutation(
        () =>
            _addCluster({
                name: getValues('name'),
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                api_server_url: getValues('api_server_url')!,
                type_code: getValues('type_code'),
                owner_group: {
                    id: getValues('owner_group.id'),
                },
                remarks: getValues('remarks'),
                credential: getValues('credential'),
            }),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    queryClient.removeQueries(clusterKeys.lists());
                    navigate('/cluster');
                    toast.success(t('DR.CLUSTER.CLUSTER_ADDED'));
                }
                setModalState(false);
            },
        },
    );

    const onSubmit: SubmitHandler<IForm> = () => {
        setModalState(true);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
                <Wrapper>
                    <FormWrapper>
                        <FormTitle>{t('DR.CLUSTER_INFO')}</FormTitle>
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
                            <Controller
                                control={control}
                                name="type_code"
                                render={({ field }) => {
                                    return (
                                        <DefaultSelect
                                            {...field}
                                            options={clusterTypeOptions}
                                            label={t('DR.TYPE')}
                                            onChange={(e: OptionType) => {
                                                setValue('api_server_url', '');
                                                setValue('account', '');
                                                setValue('password', '');
                                                setValue('port', '');
                                                setValue('broker_port', '');
                                                setValue('credential', '');
                                                setAuth(false);
                                                field.onChange(e.value);
                                            }}
                                            value={
                                                clusterTypeOptions.filter(option => {
                                                    return option.value === field.value;
                                                })[0]
                                            }
                                        />
                                    );
                                }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Controller
                                control={control}
                                name="owner_group.id"
                                render={({ field }) => {
                                    return (
                                        <DefaultSelect
                                            // TODO: 2023-09-07 기준
                                            // 현재 owner group 정의가 완벽하지 않아서 disabled=true 를 주석처리
                                            {...field}
                                            disabled={true}
                                            options={ownerGroupList}
                                            label={t('DR.OWNER_GROUP')}
                                            value={
                                                ownerGroupList?.filter(option => {
                                                    return option.value === field.value;
                                                })[0]
                                            }
                                        />
                                    );
                                }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormTextField<IForm>
                                label="비고"
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
                    </FormWrapper>
                    <FormWrapper>
                        <FormTitle>클러스터 인증</FormTitle>
                        <ClusterForm>
                            <OpenStackAuthentication
                                control={control}
                                isAuth={isAuth}
                                setAuth={setAuth}
                                resetField={resetField}
                                getFieldState={getFieldState}
                                getValues={getValues}
                                setValue={setValue}
                                trigger={trigger}
                            />
                        </ClusterForm>
                    </FormWrapper>
                </Wrapper>
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
                <ActionButton disabled={ownerGroupList?.length === 0} buttonType="add" type="submit" />
            </CardActions>
            {isModalOpen && (
                <DefaultDialog
                    maxWidth="xs"
                    open={isModalOpen}
                    title={t('DR.CLUSTER_ADD')}
                    onClose={() => {
                        setModalState(false);
                    }}
                    onConfirm={addCluster}
                    isLoading={addLoading}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    <DialogText title={getValues('name')} body={t('DR.CLUSTER.WANNA_ADD_CLUSTER')} />
                </DefaultDialog>
            )}
        </form>
    );
}

const FormTitle = styled(Typography).attrs({ variant: 'h6' })`
    font-weight: 500;
    margin-bottom: 1rem;
`;

const Wrapper = styled(Grid2).attrs({ container: true, columnSpacing: 4 })`
    padding-left: 1rem;
    padding-right: 1rem;
`;

const FormWrapper = styled(Grid2).attrs({ md: 6, xs: 12 })``;

const ClusterForm = styled(Box)`
    padding-left: 1rem;
    padding-right: 1rem;
`;
