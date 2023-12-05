import { Button, FormGroup, FormLabel, Typography } from '@mui/material';
import cryptojs from 'crypto-js';
import {
    Control,
    UseFormGetFieldState,
    UseFormGetValues,
    UseFormResetField,
    UseFormSetValue,
    UseFormTrigger,
} from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { ClusterTypeCode, OpenStackClusterCheck } from '../../../../@types/Cluster';
import DefaultButton from '../../../component/common/Button/DefaultButton';
import FormTextField from '../../../component/common/TextField/FormTextField';
import DisabledFormTextField from '../../../component/common/TextField/DisabledFormTextField';
import { checkNamingRule, urlCheck } from '../../../../libs/utils/regex';
import { _checkCluster } from '../../../../api/center/cluster';
import { useEffect } from 'react';

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

interface OpenStackAuthenticationProps {
    control: Control<IForm, any>;
    isAuth: boolean;
    setAuth: React.Dispatch<React.SetStateAction<boolean>>;
    setValue: UseFormSetValue<IForm>;
    resetField: UseFormResetField<IForm>;
    getFieldState: UseFormGetFieldState<IForm>;
    getValues: UseFormGetValues<IForm>;
    trigger: UseFormTrigger<IForm>;
}

/**
 * 오픈스택 클러스터 인증
 */
const OpenStackAuthentication = ({
    control,
    isAuth,
    setAuth,
    resetField,
    getFieldState,
    getValues,
    setValue,
    trigger,
}: OpenStackAuthenticationProps) => {
    const { t } = useTranslation();

    // openstack 인증 통신을 위한 함수
    const { isLoading: checkLoading, mutate: checkCluster } = useMutation(
        (payload: OpenStackClusterCheck) => _checkCluster(payload),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    setAuth(true);
                    toast.success(t('DR.RP.CERTIFIED'));
                }
            },
        },
    );

    useEffect(() => {
        if (getFieldState('api_server_url').isTouched) {
            trigger('api_server_url');
        }
        if (getFieldState('account').isTouched) {
            trigger('account');
        }
        if (getFieldState('password').isTouched) {
            trigger('password');
        }
    }, [getFieldState, trigger]);

    const authClickHandler = () => {
        if (
            !getFieldState('api_server_url').invalid &&
            getValues('api_server_url') !== '' &&
            !getFieldState('account').invalid &&
            getValues('account') !== '' &&
            !getFieldState('password').invalid &&
            getValues('password') !== ''
        ) {
            let password = getValues('password')
                ?.split('')
                .map(v => {
                    if (v.match('"')) {
                        return '\\'.concat(v);
                    }
                    return v;
                });

            const str = `{ "methods": ["password"],"password": {"user": {"domain": {"name": "Default"},"name": "${getValues(
                'account',
            )}", "password": "${password?.join('')}"} } }`;

            const cipher = cryptojs.AES.encrypt(str, cryptojs.enc.Utf8.parse('cdm'), {
                iv: cryptojs.enc.Utf8.parse('cdm'),
                mode: cryptojs.mode.CBC,
            });

            const aesStr = cipher.toString();
            checkCluster({
                type_code: getValues('type_code'),
                api_server_url: getValues('api_server_url') as string,
                credential: aesStr,
            });
            setValue('credential', aesStr);
        } else {
            trigger('api_server_url');
            trigger('account');
            trigger('password');
        }
    };

    return (
        <>
            <FormGroup>
                <DisabledFormTextField label={t('DR.AUTHENTICATION_METHOD')} name="authType" value={'password'} />
            </FormGroup>
            <FormGroup>
                <FormTextField<IForm>
                    label={t('DR.IP_ADDRESS')}
                    required={true}
                    name="api_server_url"
                    resetField={resetField}
                    customOnChange={() => setAuth(false)}
                    control={control}
                    rules={{
                        required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                        pattern: {
                            value: urlCheck,
                            message: t('DR.RP.ENTER_VALID_URL'),
                        },
                    }}
                />
            </FormGroup>
            <FormGroup>
                <FormTextField<IForm>
                    label={t('DR.ACCOUNT')}
                    required={true}
                    name="account"
                    customOnChange={() => setAuth(false)}
                    resetField={resetField}
                    control={control}
                    rules={{
                        required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                        maxLength: { value: 64, message: t('DR.RP.ENTER_ACCOUNT') },
                        pattern: {
                            value: checkNamingRule,
                            message: t('FORM.VALIDATION.SPECIAL.CHARACTER'),
                        },
                    }}
                />
            </FormGroup>
            <FormGroup>
                <FormTextField<IForm>
                    label={t('DR.PASSWORD')}
                    required={true}
                    customOnChange={() => setAuth(false)}
                    name="password"
                    type="password"
                    resetField={resetField}
                    control={control}
                    rules={{
                        required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                        maxLength: { value: 255, message: t('DR.RP.ENTER_PASSWORD') },
                    }}
                />
            </FormGroup>
            <FormGroup>
                <Label> {t('BUTTON.AUTHENTICATION')}</Label>
                <div>
                    {/* isAuth는 method, address, acc, password 등등 바꾸면 false
                  authentication 버튼을 눌러서 인증이 완료되면 true로 바뀐다.
                  */}
                    {isAuth ? (
                        <Button color="primary" disabled variant="contained">
                            <Typography>{t('BUTTON.VERIFICATION_COMPLETED')}</Typography>
                        </Button>
                    ) : (
                        <DefaultButton
                            loadingButton={true}
                            type={'button'}
                            text={t('BUTTON.AUTHENTICATION')}
                            onClick={authClickHandler}
                            disabled={checkLoading}
                            isLoading={checkLoading}
                        />
                    )}
                    {/* {!isAuth && <FormHelperText className="error-text">{t('DR.RP.ENTER_AUTH')}</FormHelperText>} */}
                </div>
            </FormGroup>
        </>
    );
};

export default OpenStackAuthentication;

const Label = styled(FormLabel)`
    font-weight: 700;
    padding-bottom: 5px;
`;
