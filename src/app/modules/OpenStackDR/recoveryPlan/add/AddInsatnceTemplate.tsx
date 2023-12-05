import { Box, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, Typography, useTheme } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import FolderIcon from '@mui/icons-material/Folder';
import styled from 'styled-components';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TreeView } from '@mui/x-tree-view/TreeView';

import { _addInstanceTemplate } from '../../../../../api/dr/template';
import { instanceTemplateKeys } from '../../../../../libs/utils/queryKeys';
import { AddInstanceTemplateProps } from '../../../../../@types';
import { checkNamingRule } from '../../../../../libs/utils/regex';
import ActionButton from '../../../../component/common/Button/ActionButton';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../component/common/Dialog/DialogText';
import FormTextField from '../../../../component/common/TextField/FormTextField';
import WorkloadFlow from '../../../../component/common/reactflow/WorkloadFlow';
import { ResizePanel } from '../../../../component/common/Resize/ResizePanel';
import FlowSidebar from '../../../../component/common/reactflow/FlowSidebar';
import CustomDivider from '../../../../component/common/Divider/CustomDivider';

interface AddInstanceTemplate {
    open: boolean;
    onClose: any;
    nodes: any;
    edges: any;
    planInstances: {
        operatedInstances: any[];
        nonOperatedInstances: any[];
    };
    instancePlan: any[];
}

interface IForm {
    name: string;
    remarks?: string;
}
/**
 * 인스턴스 템플릿을 추가하기 위한 Form 컴포넌트 (Dialog)
 */
const AddInsatnceTemplate = ({ open, onClose, nodes, edges, planInstances, instancePlan }: AddInstanceTemplate) => {
    console.log(nodes);
    console.log(edges);
    const theme = useTheme();

    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [addModal, setAddModal] = useState<boolean>(false);

    const [instanceTemplate, setInstanceTemplate] = useState<AddInstanceTemplateProps>({
        name: '',
        remarks: '',
        instances: [],
        // TODO: 2023-09-07 기준
        // 현재 owner group 정의가 완벽하지 않아서 default group의 id : 1 을 하드코딩으로 넣어줌
        // 추후 owner group 정의가 완벽하게 되거나, 변경되면 이 코드를 수정해야한다.
        owner_group: {
            id: 1,
        },
    });

    const { control, resetField, handleSubmit } = useForm<IForm>({
        defaultValues: {
            name: '',
            remarks: ' ',
        },
        mode: 'all',
    });

    const onSubmit: SubmitHandler<IForm> = data => {
        const instances = [...planInstances.nonOperatedInstances, ...planInstances.operatedInstances];
        const templateInstances = instancePlan.map(instance => {
            let nameDependencies = [];
            if (instance?.dependencies) {
                nameDependencies = instance?.dependencies.map((dependent: any) => {
                    const dependentName = instances.find(instance => Number(instance.id) === Number(dependent.id));
                    return { name: dependentName.name };
                });
            }
            return {
                protection_cluster_instance_name: instances.find(
                    ({ id }) => id === instance.protection_cluster_instance.id,
                ).name,
                auto_start_flag: instance?.auto_start_flag ?? false,
                dependencies: nameDependencies ?? [],
            };
        });

        const result = {
            name: data.name,
            remarks: data.remarks,
            owner_group: {
                id: 1,
            },
            instances: templateInstances,
        };

        setInstanceTemplate(result);
        setAddModal(true);
    };

    // 인스턴스 템플릿 등록 함수
    const { isLoading: addLoading, mutate: addInstanceTemplate } = useMutation(
        () => _addInstanceTemplate(instanceTemplate),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    toast.success('인스턴스 템플릿이 추가되었습니다.');
                    queryClient.invalidateQueries(instanceTemplateKeys.all);
                    setTimeout(() => {
                        onClose();
                    }, 50);
                }
                setAddModal(false);
            },
        },
    );

    return (
        <>
            <Dialog open={open} maxWidth={'lg'} fullWidth>
                <DialogTitle>인스턴스 템플릿 추가</DialogTitle>
                <>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogContent dividers sx={{ height: '50rem' }}>
                            <FormGroup sx={{ width: '50%' }}>
                                <FormTextField<IForm>
                                    label={t('DR.NAME')}
                                    required
                                    name="name"
                                    type="text"
                                    resetField={resetField}
                                    control={control}
                                    rules={{
                                        required: { value: true, message: t('FORM.VALIDATION.REQUIRED') },
                                        maxLength: {
                                            value: 50,
                                            message: '템플릿 이름을 입력해주세요. (최소 3자, 최대 50자)',
                                        },
                                        minLength: {
                                            value: 3,
                                            message: '템플릿 이름을 입력해주세요. (최소 3자, 최대 50자)',
                                        },
                                        pattern: {
                                            value: checkNamingRule,
                                            message: t('FORM.VALIDATION.SPECIAL.CHARACTER'),
                                        },
                                    }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <FormTextField<IForm>
                                    label={t('DR.REMARK')}
                                    name="remarks"
                                    resetField={resetField}
                                    control={control}
                                    multiline
                                    rows={2}
                                    rules={{
                                        maxLength: {
                                            value: 300,
                                            message: t('DR.RP.ENTER_300'),
                                        },
                                    }}
                                />
                            </FormGroup>
                            <CustomDivider />
                            <ResizePanel>
                                <ResizePanel.Pane defaultSize={20}>
                                    <FlowHeader>
                                        <Typography variant="h6">인스턴스 목록</Typography>
                                    </FlowHeader>
                                    <InstanceWrapper>
                                        <TreeView
                                            className={
                                                theme.palette.mode === 'light' ? 'light-tree-view' : 'dark-tree-view'
                                            }
                                            sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                                            defaultCollapseIcon={<FolderIcon />}
                                            defaultExpandIcon={<FolderIcon />}
                                            defaultEndIcon={<FolderIcon />}
                                            defaultExpanded={['1', '2']}
                                            draggable={false}
                                        >
                                            <FlowSidebar
                                                itemList={planInstances.operatedInstances}
                                                headerNodeID={'1'}
                                                headerTitle={`기동 인스턴스 (${planInstances.operatedInstances.length})`}
                                                movable={false}
                                            />
                                            <FlowSidebar
                                                itemList={planInstances.nonOperatedInstances}
                                                headerNodeID={'2'}
                                                headerTitle={`비기동 인스턴스 (${planInstances.nonOperatedInstances.length})`}
                                            />
                                        </TreeView>
                                    </InstanceWrapper>
                                </ResizePanel.Pane>
                                <ResizePanel.PaneHandle />
                                <ResizePanel.Pane>
                                    <FlowWrapper>
                                        <FlowHeader>
                                            <Typography variant="h6">{t('DR.WORK_FLOW')}</Typography>
                                        </FlowHeader>
                                        <WorkloadFlow
                                            initNodes={nodes}
                                            initEdges={edges}
                                            handleDrag={false}
                                            canBehavior={false}
                                        />
                                    </FlowWrapper>
                                </ResizePanel.Pane>
                            </ResizePanel>
                        </DialogContent>
                        <DialogActions>
                            <ActionButton buttonType={'cancel'} onClick={onClose} disabled={false} />
                            <ActionButton buttonType="add" type="submit" />
                        </DialogActions>
                    </form>
                </>
            </Dialog>
            {addModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={addModal}
                    title={'인스턴스 템플릿 추가'}
                    onClose={() => {
                        setAddModal(false);
                    }}
                    onConfirm={addInstanceTemplate}
                    isLoading={addLoading}
                    actionType="confirm"
                    buttonColor="primary"
                >
                    <DialogText title={instanceTemplate.name} body={'인스턴스 템플릿을 추가하시겠습니까 ?'} />
                </DefaultDialog>
            )}
        </>
    );
};

export default AddInsatnceTemplate;

const FlowWrapper = styled(Box)`
    height: 100%;
    display: flex;
    flex-direction: column;
`;
const FlowHeader = styled(Box)`
    display: flex;
    justify-content: space-between;
    padding-bottom: 1rem;
    position: sticky;
    top: 0;
`;

const InstanceWrapper = styled(Box)`
    padding: 1rem;
`;
