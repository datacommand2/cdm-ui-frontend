import { Box, FormGroup, useTheme, IconButton, Tooltip } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { SubmitHandler, useForm } from 'react-hook-form';

import { _getInstanceScript, _modifyInstanceScript } from '../../../../../api/center/cluster';
import { stringToBytes } from '../../../../../libs/utils/commonFunction';
import { clusterInstanceScriptKeys } from '../../../../../libs/utils/queryKeys';
import ActionButton from '../../../../component/common/Button/ActionButton';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../component/common/Dialog/DialogText';
import FormTextField from '../../../../component/common/TextField/FormTextField';

interface InstanceScriptProps {
    clusterID: number;
    instanceID: number;
}

interface IForm {
    scripts: string;
}

const ScriptMaxLength = 65535;

/**
 * 인스턴스 사용자 스크립트 컴포넌트
 */
const InstanceScript = ({ clusterID, instanceID }: InstanceScriptProps) => {
    const theme = useTheme();
    const [modifyModal, setModifyModal] = useState(false);
    const queryClient = useQueryClient();

    // 인스턴스 사용자 스크립트 정보를 불러오는 함수
    const { data: instanceScript } = useQuery(
        clusterInstanceScriptKeys.detail(instanceID),
        () => _getInstanceScript(clusterID, instanceID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    if (data?.user_data) {
                        return atob(data.user_data);
                    } else {
                        return '';
                    }
                }
            },
        },
    );

    const { control, handleSubmit, setValue, getValues, resetField } = useForm<IForm>({
        defaultValues: {
            scripts: instanceScript ?? '',
        },
    });

    const onSubmit: SubmitHandler<IForm> = () => {
        setModifyModal(true);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];

        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = event => {
                const content = event.target?.result as string;
                setValue('scripts', content);
            };

            reader.readAsText(selectedFile);
        }
    };

    // 인스턴스 사용자 스크립트를 수정하는 함수
    const { isLoading: modifyLoading, mutate: modifyInstanceScript } = useMutation(
        () => _modifyInstanceScript(clusterID, instanceID, getValues('scripts')),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    toast.success('사용자 정의 스크립트가 수정되었습니다.');
                    setModifyModal(false);
                    queryClient.invalidateQueries(clusterInstanceScriptKeys.all);
                } else {
                    throw new Error();
                }
            },
        },
    );

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DetailWrapper sx={{ border: `1px solid ${theme.palette.divider}` }}>
                    <Wrapper>
                        <Tooltip title="파일 업로드">
                            <div style={{ display: 'flex' }}>
                                <IconButton component="label">
                                    <UploadFileOutlinedIcon />
                                    <input hidden type="file" onChange={file => handleFileChange(file)} />
                                </IconButton>
                            </div>
                        </Tooltip>
                        {stringToBytes(getValues('scripts').length)} / 64.00KB
                    </Wrapper>
                    <FormGroup>
                        <FormTextField<IForm>
                            name="scripts"
                            multiline
                            rows={20}
                            resetField={resetField}
                            control={control}
                            rules={{
                                maxLength: {
                                    value: ScriptMaxLength,
                                    message: '입력 가능한 길이를 초과하였습니다.',
                                },
                            }}
                        />
                    </FormGroup>
                    <ButtonWrapper>
                        <ActionButton buttonType={'edit'} type="sbumit" />
                    </ButtonWrapper>
                </DetailWrapper>
                {modifyModal && (
                    <DefaultDialog
                        maxWidth="xs"
                        open={modifyModal}
                        title={'사용자 정의 스크립트 수정'}
                        onClose={() => {
                            setModifyModal(false);
                        }}
                        onConfirm={modifyInstanceScript}
                        isLoading={modifyLoading}
                        actionType="confirm"
                        buttonColor="primary"
                    >
                        <DialogText body={'사용자 정의 스크립트를 수정하시겠습니까?'} />
                    </DefaultDialog>
                )}
            </form>
        </>
    );
};

export default InstanceScript;

const DetailWrapper = styled(Box)`
    padding: 20px;
    border-radius: 5px;
`;

const Wrapper = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
`;

const ButtonWrapper = styled(Box)`
    padding-top: 1rem;
    display: flex;
    justify-content: flex-end;
`;
