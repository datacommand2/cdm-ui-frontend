import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { toast } from 'react-toastify';

import ActionButton from '../../../../component/common/Button/ActionButton';
import { instanceTemplateKeys } from '../../../../../libs/utils/queryKeys';
import { _getInstanceTemplates, _deleteInstanceTemplate, _getInstanceTemplate } from '../../../../../api/dr/template';
import { InstanceTemplateProps, OptionType, TemplateDetailInstance } from '../../../../../@types';
import InstanceTemplateDetail from './InstanceTemplateDetail';
import DefaultSelect from '../../../../component/common/Select/DefaultSelect';
import CustomDivider from '../../../../component/common/Divider/CustomDivider';
import DialogText from '../../../../component/common/Dialog/DialogText';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import DefaultSkeleton from '../../../../component/common/Skeleton/DefaultSkeleton';
import {
    edgesAtom,
    flowInitAtom,
    nodesAtom,
    planInstancesAtom,
    templateEdgesAtom,
    templateNodesAtom,
} from '../../../../../recoil/atom/OpenShiftRecoveryPlanAtom';

interface TemplateProps {
    open: boolean;
    onClose: any;
    planInstances: {
        operatedInstances: any[];
        nonOperatedInstances: any[];
    };
}

/**
 * 인스턴스 템플릿 목록, 상세 정보를 보여주는 Dialog
 */
const InstanceTemplateDialog = ({ open, onClose, planInstances }: TemplateProps) => {
    const queryClient = useQueryClient();
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [selectedInstanceTemplateID, setSelectedInstanceTemplateID] = useState<number>(0);
    const [templateInstances, setTemplateInstances] = useState<TemplateDetailInstance[]>();
    const setPlanInstances = useSetRecoilState(planInstancesAtom);

    const templateNodes = useRecoilValue(templateNodesAtom);
    const templateEdges = useRecoilValue(templateEdgesAtom);
    const setNodes = useSetRecoilState(nodesAtom);
    const setEdges = useSetRecoilState(edgesAtom);
    const setFlowInit = useSetRecoilState(flowInitAtom);

    // 인스턴스 템플릿 목록 조회
    const { data: templateList = [], isLoading: templateListLoading } = useQuery(
        instanceTemplateKeys.lists(),
        _getInstanceTemplates,
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    if (data.templates) {
                        return data.templates.map((template: InstanceTemplateProps) => {
                            return { value: Number(template.id), label: template.name };
                        });
                    } else {
                        return [{ value: 0, label: '템플릿 선택', isDisabled: true }];
                    }
                } else if (status === 204) {
                    return [{ value: 0, label: '템플릿 선택', isDisabled: true }];
                } else {
                    return [{ value: 0, label: '템플릿 선택', isDisabled: true }];
                }
            },
        },
    );

    // 기본 instanceTemplate 가 선택되어진 상태를 만들기 위함
    useEffect(() => {
        if (templateList.length > 0) {
            setSelectedInstanceTemplateID(templateList[0].value);
        }
    }, [templateList]);

    // 인스턴스 템플릿 삭제
    const { isLoading: deleteLoading, mutate: deleteTemplate } = useMutation(
        () => _deleteInstanceTemplate(selectedInstanceTemplateID),
        {
            onSuccess: ([, , status]) => {
                if (status === 200 || status === 201) {
                    toast.success('인스턴스 템플릿을 삭제하였습니다.');
                    queryClient.invalidateQueries(instanceTemplateKeys.lists());
                    setDeleteModal(false);
                }
            },
        },
    );

    // 기존 복구계획에 인스턴스 템플릿 적용
    const applyInstanceTemplate = () => {
        const instances = [...planInstances.nonOperatedInstances, ...planInstances.operatedInstances];

        let operatedInstances: any[] = [];
        let nonOperatedInstances: any[] = [...planInstances.operatedInstances, ...planInstances.nonOperatedInstances];

        templateInstances?.filter(instance => {
            const findInstance = instances.find(({ name }) => name === instance.protection_cluster_instance_name);

            // 템플릿 인스턴스가 현재 계획 인스턴스에 포함된 인스턴스면
            if (findInstance) {
                if (operatedInstances.find(({ name }) => name === findInstance.name)) {
                    operatedInstances = operatedInstances.filter(instance => instance.name !== findInstance.name);
                }
                if (nonOperatedInstances.find(({ name }) => name === findInstance.name)) {
                    nonOperatedInstances = nonOperatedInstances.filter(instance => instance.name !== findInstance.name);
                }
                if (instance.auto_start_flag === true) {
                    operatedInstances.push(findInstance);
                } else {
                    nonOperatedInstances.push(findInstance);
                }
            }
        });

        // data.id 가 undefined가 아니면 적용 가능
        const nodes = templateNodes.filter(node => node.data.id !== undefined);

        //
        const edges = templateEdges.filter(edge => {
            const sourceID = edge.id.split('(_edge_)')[0];
            const targetID = edge.id.split('(_edge_)')[1];

            if (!sourceID.includes('undefined')) {
                return edge;
            }
            if (!targetID.includes('undefined')) {
                return edge;
            }
        });

        const filteredNodes = nodes.map(node => {
            return {
                ...node,
                deletable: true,
                draggable: true,
                data: {
                    ...node.data,
                    isConnectable: true,
                },
            };
        });
        const filteredEdges = edges.map(edge => {
            return {
                ...edge,
                deletable: true,
            };
        });
        // 1. 기존 비기동, 기동
        // 기존 플랜 기동, 비기동 목록에 덮어씌우기
        setPlanInstances({
            operatedInstances: operatedInstances ?? [],
            nonOperatedInstances: nonOperatedInstances ?? [],
        });
        // // 2. Node, Edge 세팅
        setNodes(filteredNodes);
        setEdges(filteredEdges);

        setFlowInit(false);
        onClose();
    };

    // 인스턴스 템플릿 조회
    const { data: instanceTemplate, isFetching: templateLoading } = useQuery(
        instanceTemplateKeys.detail(selectedInstanceTemplateID),
        () => _getInstanceTemplate(selectedInstanceTemplateID),
        {
            select: ([data, , status]) => {
                if (status === 200 || status === 201) {
                    return data.template;
                }
            },
            enabled: selectedInstanceTemplateID !== 0,
        },
    );
    useEffect(() => {
        if (instanceTemplate?.instances) {
            setTemplateInstances(instanceTemplate.instances);
        }
    }, [instanceTemplate]);

    return (
        <Dialog open={open} fullWidth maxWidth={'xl'}>
            <CustomTitle>인스턴스 템플릿</CustomTitle>
            <DialogContent dividers={true}>
                {templateListLoading ? (
                    <DefaultSkeleton />
                ) : (
                    <TemplateHeader>
                        <DefaultSelect
                            label={'템플릿 목록'}
                            name="instanceTemplates"
                            options={templateList}
                            onChange={(e: OptionType) => setSelectedInstanceTemplateID(Number(e.value))}
                            value={
                                templateList?.filter((option: OptionType) => {
                                    return Number(option.value) === selectedInstanceTemplateID;
                                })[0]
                            }
                        />
                        <ButtonWrapper>
                            <ActionButton
                                buttonType="delete"
                                onClick={() => setDeleteModal(true)}
                                disabled={selectedInstanceTemplateID === 0}
                            />
                        </ButtonWrapper>
                    </TemplateHeader>
                )}
                <CustomDivider />
                <Wrapper>
                    {instanceTemplate && (
                        <InstanceTemplateDetail
                            instanceTemplate={instanceTemplate}
                            templateID={selectedInstanceTemplateID}
                            planInstances={planInstances}
                            isLoading={templateLoading}
                        />
                    )}
                </Wrapper>
            </DialogContent>
            <DialogActions>
                <ActionButton buttonType={'cancel'} onClick={onClose} />
                <ActionButton
                    buttonType={'apply'}
                    onClick={applyInstanceTemplate}
                    disabled={selectedInstanceTemplateID === 0}
                />
            </DialogActions>
            {deleteModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={deleteModal}
                    title={'인스턴스 템플릿 삭제'}
                    onClose={() => {
                        setDeleteModal(false);
                    }}
                    onConfirm={deleteTemplate}
                    isLoading={deleteLoading}
                    actionType="delete"
                    buttonColor="primary"
                >
                    <DialogText body={'인스턴스 템플릿을 삭제하시겠습니까?'} />
                </DefaultDialog>
            )}
        </Dialog>
    );
};

export default InstanceTemplateDialog;
const Wrapper = styled(Box)`
    height: 50rem;
`;

const CustomTitle = styled(DialogTitle)`
    display: flex;
    font-weight: 700;
`;

const TemplateHeader = styled(Box)`
    display: flex;
    justify-content: space-between;
`;

const ButtonWrapper = styled(Box)`
    display: flex;
    align-items: center;
`;
