import { Box, CardActions, CardContent, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { TreeView } from '@mui/x-tree-view/TreeView';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edge, MarkerType, Node, Position } from 'reactflow';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import FolderIcon from '@mui/icons-material/Folder';
import { useLocation, useNavigate } from 'react-router-dom';
import QueueOutlinedIcon from '@mui/icons-material/QueueOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined';

import { getLayoutedElements } from '../../../../../libs/node';
import {
    edgesAtom,
    flowInitAtom,
    nodesAtom,
    openStackRecoveryPlanEditAtom,
    planInstancesAtom,
} from '../../../../../recoil/atom/OpenShiftRecoveryPlanAtom';
import { ResizePanel } from '../../../../component/common/Resize/ResizePanel';
import FlowSidebar from '../../../../component/common/reactflow/FlowSidebar';
import DefaultSpinner from '../../../../component/common/Skeleton/DefaultSpinner';
import WorkloadFlow from '../../../../component/common/reactflow/WorkloadFlow';
import ActionButton from '../../../../component/common/Button/ActionButton';
import { PATHNAME } from '../../../../../constant/pathname';
import DetailDrawerSkeleton from '../../../../component/common/Skeleton/DetailDrawerSkeleton';
import InstanceDetail from '../../../OpenStackCenter/detail/InstanceTab/InstanceDetail';
import { useGetRecoveryPlan } from '../common/hooks';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../component/common/Dialog/DialogText';
import InstanceTemplateDialog from '../../common/InstanceTemplate/InstanceTemplateDialog';
import AddInsatnceTemplate from '../add/AddInsatnceTemplate';
import useDrawer from '@/hooks/useDrawer';

interface PlanInformationProps {
    setStep: (value: number) => void;
}

/**
 * 인스턴스의 기동계획을 수정할 수 있는 컴포넌트
 */
const EditOperationPlan = ({ setStep }: PlanInformationProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const planID = location.state?.planID;
    const groupID = location.state?.groupID;
    const theme = useTheme();

    const recoveryPlanEdit = useRecoilValue(openStackRecoveryPlanEditAtom);
    const setRecoveryPlanEdit = useSetRecoilState(openStackRecoveryPlanEditAtom);
    const setNodes = useSetRecoilState(nodesAtom);
    const setEdges = useSetRecoilState(edgesAtom);
    const nodes = useRecoilValue(nodesAtom);
    const edges = useRecoilValue(edgesAtom);
    const setFlowInit = useSetRecoilState(flowInitAtom);
    const flowInit = useRecoilValue(flowInitAtom);
    const planInstances = useRecoilValue(planInstancesAtom);
    const setPlanInstances = useSetRecoilState(planInstancesAtom);

    const [resetFlowModal, setResetFlowModal] = useState(false);
    const [openTemplateList, setOpenTemplateList] = useState(false);
    const [addTemplateModal, setAddTemplateModal] = useState(false);

    useEffect(() => {
        setFlowInit(true);
        if (!nodes) {
            setNodes([]);
        }
    }, [setFlowInit, nodes, setNodes, edges]);
    // 복구계획을 조회하는 함수
    const { data: recoveryPlan } = useGetRecoveryPlan(groupID, planID);

    const { openDrawer } = useDrawer();

    const handleClick = useCallback(
        (instanceID: number) => {
            openDrawer(
                <Suspense fallback={<DetailDrawerSkeleton />}>
                    <InstanceDetail clusterID={recoveryPlan.protection_cluster.id} instanceID={instanceID} />
                </Suspense>,
            );
        },
        [openDrawer, recoveryPlan.protection_cluster.id],
    );

    const init = (detailInstances: any) => {
        if (detailInstances) {
            let modifiedEdges: any[] = [];
            // 기동 인스턴스만 React Flow의 Node로 그린다.
            const instances = detailInstances.filter((instance: any) => {
                if (instance?.auto_start_flag) {
                    return instance;
                }
            });

            // 해당 인스턴스 상세 정보로 이루어진 기동 인스턴스
            const protectionInstances = instances.map((instance: any) => instance.protection_cluster_instance);

            const flowNodes = instances.map((instance: any, idx: number) => {
                if (instance?.protection_cluster_instance) {
                    instance = { ...instance, ...instance?.protection_cluster_instance };
                }
                if (instance.dependencies) {
                    if (instance.dependencies.length > 0) {
                        instance.dependencies.map((dependency: any) => {
                            //  dependency, dependency.id 둘 다 사용하는 이유는
                            // 오픈시프트에서는 dependencies 가 string[], 오픈스택에서는 { id: number }[]

                            // => 애초에 dependenceis 배열을 변환시켜서 map 돌리면 될 듯?
                            const node = protectionInstances.find(
                                (v: any) => v.id === dependency || v.id === dependency?.id,
                            );
                            if (node) {
                                modifiedEdges.push({
                                    id: `${node.id}_${node.name}(_edge_)${instance.id}_${instance.name}`,
                                    source: `${node.id}_${node.name}`,
                                    target: `${instance.id}_${instance.name}`,
                                    sourceHandle: null,
                                    targetHandle: null,
                                    markerEnd: {
                                        type: MarkerType.ArrowClosed,
                                    },
                                    type: 'smoothstep',
                                    animated: false,
                                });
                            }
                        });
                    }
                }
                return {
                    id: `${instance.id}_${instance.name}`,
                    type: 'CustomNode',
                    position: {
                        x: (idx % 4) * 300, // 한 줄에 4개씩 배치되도록 수정
                        y: Math.floor(idx / 4) * 100, // 한 줄마다 세로 간격을 조정하여 요소를 배치
                    },
                    sourcePosition: Position.Right,
                    targetPosition: Position.Left,
                    data: {
                        label: instance.name,
                        id: instance.id,
                        deletable: true,
                        isConnectable: true,
                        onDelete: (nodes: Node[], instances: any) => {
                            onDeleteButton(nodes, instances);
                        },
                        edges,
                        state_code: instance.state_code,
                        result_code: instance.result_code,
                    },
                };
            });
            const layout = getLayoutedElements(flowNodes, modifiedEdges);

            setNodes(layout.nodes);
            setEdges(layout.edges);
        }
    };
    useEffect(() => {
        init(recoveryPlanEdit.detail.instances);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * 엣지를 연결하거나 삭제할 때마다 recoil에 저장하는 함수를 reactflow 컴포넌트로 전달
     */
    const edgeConnect = (edges: Edge[]) => {
        setEdges(edges);
    };

    /**
     * 비기동 인스턴스를 기동 인스턴스로 변경
     */
    const changeOperationInstance = (id: number, node: Node) => {
        const instance = planInstances.nonOperatedInstances.filter(instance => instance.id === id);
        const filteredNonOperatedInstances = planInstances.nonOperatedInstances.filter(instance => instance.id !== id);

        setNodes(nds => nds.concat(node));
        setPlanInstances({
            operatedInstances: [...planInstances.operatedInstances, instance[0]],
            nonOperatedInstances: filteredNonOperatedInstances,
        });
    };

    const commonDeleteFunction = (nodes: Node[], instances?: any) => {
        if (!nodes) return;
        if (nodes.length === 0) return;
        setNodes(nds =>
            nds.filter(node => {
                return nodes.findIndex(nd => nd.id === node.id) === -1;
            }),
        );
        let currentOperationInstances: any[] = [];
        let currentNonOperationInstances: any[] = [];

        if (instances) {
            currentOperationInstances = [...instances.operatedInstances];
            currentNonOperationInstances = [...instances.nonOperatedInstances];
        } else {
            currentOperationInstances = [...planInstances.operatedInstances];
            currentNonOperationInstances = [...planInstances.nonOperatedInstances];
        }

        const deletedNodes = nodes.map(node => {
            const id = node.data.id;
            // 삭제한 노드
            const instance = currentOperationInstances.filter(instance => Number(instance.id) === Number(id));
            // 남아있는 노드
            currentOperationInstances = currentOperationInstances.filter(
                instance => Number(instance.id) !== Number(id),
            );

            setRecoveryPlanEdit({
                ...recoveryPlanEdit,
                detail: {
                    ...recoveryPlanEdit.detail,
                    instances: recoveryPlanEdit.detail.instances.map(ins => {
                        if (ins.protection_cluster_instance.id === instance[0].id) {
                            return {
                                ...ins,
                                auto_start_flag: false,
                            };
                        } else return ins;
                    }),
                },
            });

            // 비기동 인스턴스 목록 업데이트
            currentNonOperationInstances = [...currentNonOperationInstances, instance[0]];

            return {
                operatedInstances: currentOperationInstances,
                nonOperatedInstances: currentNonOperationInstances,
            };
        });

        setPlanInstances(deletedNodes[deletedNodes.length - 1]);
    };
    /**
     * 기동 인스턴스를 삭제했을 때의 콜백 함수
     */
    const callbackDeleteNode = (nodes: Node[]) => {
        commonDeleteFunction(nodes);
    };

    /**
     * 버튼을 눌러서 삭제하는 경우 planInstances 를 직접 받아서 사용
     */
    const onDeleteButton = (nodes: Node[], planInstances: any) => {
        commonDeleteFunction(nodes, planInstances);
    };

    /**
     * 현재 적용한 Flow를 저장하는 함수
     */
    const storeInstances = () => {
        const instancesPlans = nodes.map(node => {
            const instance = { id: Number(node.data.id), name: node.data.label };

            let instanceEdges: { id: number }[] = [];
            let dependencies: { id: number }[] = [];

            edges.map(edge => {
                if (edge.target === `${instance.id}_${instance.name}`) {
                    const id = edge.source.split('_')[0];
                    instanceEdges.push({ id: parseInt(id) });
                }
            });

            // 디펜던시가 존재하면
            if (instanceEdges.length > 0) {
                dependencies = [...instanceEdges];
            }

            const currentPlan = recoveryPlanEdit.detail.instances.filter(
                planInstance => Number(planInstance.protection_cluster_instance.id) === instance.id,
            )[0];

            if (dependencies.length > 0) {
                return {
                    ...currentPlan,
                    dependencies,
                    auto_start_flag: true,
                };
            } else {
                return {
                    ...currentPlan,
                    auto_start_flag: true,
                };
            }
        });

        const filteredInsatncePlan = recoveryPlanEdit.detail.instances.map(instance => {
            //  같은게 있다면 바꿔주기
            const matchingPlan = instancesPlans.find(
                plan => plan.protection_cluster_instance.id === instance.protection_cluster_instance.id,
            );
            return matchingPlan ? matchingPlan : instance;
        });

        setRecoveryPlanEdit({
            ...recoveryPlanEdit,
            detail: {
                ...recoveryPlanEdit.detail,
                instances: filteredInsatncePlan,
            },
        });
    };

    // 적용된 기동계획을 초기화하는 함수
    const resetFlow = () => {
        init(recoveryPlan.detail.instances);
        const instances = recoveryPlan.detail.instances.reduce(
            (acc: any, instance: any) => {
                const key = instance?.auto_start_flag ? 'operatedInstances' : 'nonOperatedInstances';
                acc[key].push(instance.protection_cluster_instance);
                return acc;
            },
            { operatedInstances: [], nonOperatedInstances: [] },
        );
        setPlanInstances(instances);
        setFlowInit(false);
        setResetFlowModal(false);
    };

    return (
        <>
            <CardContent>
                <ResizePanel>
                    <ResizePanel.Pane defaultSize={20}>
                        <FlowHeader>
                            <Typography variant="h6">인스턴스 목록</Typography>
                        </FlowHeader>
                        <InstanceWrapper>
                            <TreeView
                                className={theme.palette.mode === 'light' ? 'light-tree-view' : 'dark-tree-view'}
                                sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                                defaultCollapseIcon={<FolderIcon />}
                                defaultExpandIcon={<FolderIcon />}
                                defaultEndIcon={<FolderIcon />}
                                defaultExpanded={['1', '2']}
                            >
                                <FlowSidebar
                                    itemList={planInstances.operatedInstances}
                                    headerNodeID={'1'}
                                    headerTitle={`기동 인스턴스 (${planInstances.operatedInstances.length})`}
                                    movable={false}
                                    onClick={(e: any) => {
                                        handleClick(e.target.id);
                                    }}
                                />
                                <FlowSidebar
                                    itemList={planInstances.nonOperatedInstances}
                                    headerNodeID={'2'}
                                    headerTitle={`비기동 인스턴스 (${planInstances.nonOperatedInstances.length})`}
                                    onClick={(e: any) => {
                                        handleClick(e.target.id);
                                    }}
                                />
                            </TreeView>
                        </InstanceWrapper>
                    </ResizePanel.Pane>
                    <ResizePanel.PaneHandle />
                    <ResizePanel.Pane>
                        <FlowWrapper>
                            <FlowHeader>
                                <Typography variant="h6">{t('DR.WORK_FLOW')}</Typography>
                                <IconButtonWrapper>
                                    <Tooltip title={<Typography>인스턴스 템플릿 추가</Typography>}>
                                        <StyledIconButton
                                            onClick={() => {
                                                storeInstances();
                                                setAddTemplateModal(true);
                                            }}
                                        >
                                            <QueueOutlinedIcon />
                                        </StyledIconButton>
                                    </Tooltip>
                                    <Tooltip title={<Typography>인스턴스 템플릿 목록</Typography>}>
                                        <StyledIconButton onClick={() => setOpenTemplateList(true)}>
                                            <LibraryBooksOutlinedIcon />
                                        </StyledIconButton>
                                    </Tooltip>
                                    <Tooltip title={<Typography>{t('DR.OPERATION_PLAN_INIT')}</Typography>}>
                                        <StyledIconButton
                                            onClick={() => {
                                                setResetFlowModal(true);
                                            }}
                                        >
                                            <RotateLeftOutlinedIcon />
                                        </StyledIconButton>
                                    </Tooltip>
                                </IconButtonWrapper>
                            </FlowHeader>
                            {!nodes || !flowInit ? (
                                <DefaultSpinner />
                            ) : (
                                <WorkloadFlow
                                    initNodes={nodes}
                                    initEdges={edges}
                                    edgeConnect={edgeConnect}
                                    storeNodes={setNodes}
                                    dropCallback={changeOperationInstance}
                                    deleteCallback={callbackDeleteNode}
                                    onDelete={onDeleteButton}
                                />
                            )}
                        </FlowWrapper>
                    </ResizePanel.Pane>
                </ResizePanel>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <ActionButton
                    buttonType="cancel"
                    onClick={() => {
                        navigate(PATHNAME.OPENSTACK_PLAN);
                    }}
                />
                <ActionButton
                    buttonType="prev"
                    onClick={() => {
                        storeInstances();
                        setStep(1);
                    }}
                />
                <ActionButton
                    buttonType="next"
                    onClick={() => {
                        storeInstances();
                        setStep(3);
                    }}
                />
            </CardActions>
            {openTemplateList && (
                <InstanceTemplateDialog
                    open={openTemplateList}
                    onClose={() => setOpenTemplateList(false)}
                    planInstances={planInstances}
                />
            )}
            {addTemplateModal && (
                <AddInsatnceTemplate
                    open={addTemplateModal}
                    onClose={() => setAddTemplateModal(false)}
                    nodes={nodes}
                    edges={edges}
                    planInstances={planInstances}
                    instancePlan={recoveryPlanEdit.detail.instances}
                />
            )}
            {resetFlowModal && (
                <DefaultDialog
                    maxWidth="xs"
                    open={resetFlowModal}
                    title={t('DR.INITIALIZATION_WORK_FLOW')}
                    onClose={() => {
                        setResetFlowModal(false);
                    }}
                    onConfirm={resetFlow}
                    actionType="confirm"
                    buttonColor="error"
                >
                    <DialogText body={t('DR.DESCRIPTION_INITIALIZTION_WORK_FLOW')} />
                </DefaultDialog>
            )}
        </>
    );
};

export default EditOperationPlan;

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

const FlowWrapper = styled(Box)`
    height: 100%;
    padding-left: 1rem;
    display: flex;
    flex-direction: column;
`;

const IconButtonWrapper = styled.div`
    display: flex;
`;

const StyledIconButton = styled(IconButton)`
    padding: 0 0 5px 5px;
`;
