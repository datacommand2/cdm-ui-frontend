import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edge, Node } from 'reactflow';
import FolderIcon from '@mui/icons-material/Folder';
import { Box, CardActions, CardContent, Divider, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined';
import styled from 'styled-components';
import QueueOutlinedIcon from '@mui/icons-material/QueueOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { TreeView } from '@mui/x-tree-view/TreeView';

import ActionButton from '../../../../component/common/Button/ActionButton';
import DefaultDialog from '../../../../component/common/Dialog/DefaultDialog';
import DialogText from '../../../../component/common/Dialog/DialogText';
import { PATHNAME } from '../../../../../constant/pathname';
import {
    edgesAtom,
    flowInitAtom,
    nodesAtom,
    openStackRecoveryPlanAddAtom,
    planInstancesAtom,
    protectionClusterAtom,
} from '../../../../../recoil/atom/OpenShiftRecoveryPlanAtom';
import { ResizePanel } from '../../../../component/common/Resize/ResizePanel';
import DefaultSpinner from '../../../../component/common/Skeleton/DefaultSpinner';
import FlowSidebar from '../../../../component/common/reactflow/FlowSidebar';
import WorkloadFlow from '../../../../component/common/reactflow/WorkloadFlow';
import InstanceTemplateDialog from '../../common/InstanceTemplate/InstanceTemplateDialog';
import AddInsatnceTemplate from './AddInsatnceTemplate';
import DetailDrawerSkeleton from '../../../../component/common/Skeleton/DetailDrawerSkeleton';
import InstanceDetail from '../../../OpenStackCenter/detail/InstanceTab/InstanceDetail';
import useDrawer from '@/hooks/useDrawer';

interface OperationPlanProps {
    setStep: any;
}

/**
 * 인스턴스의 기동계획을 설정하는 컴포넌트
 */
const OperationPlan = ({ setStep }: OperationPlanProps) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const { t } = useTranslation();

    const protectionCluster = useRecoilValue(protectionClusterAtom);
    const recoveryPlanAdd = useRecoilValue(openStackRecoveryPlanAddAtom);
    const setRecoveryPlanAdd = useSetRecoilState(openStackRecoveryPlanAddAtom);
    const planInstances = useRecoilValue(planInstancesAtom);
    const setPlanInstances = useSetRecoilState(planInstancesAtom);

    const setNodes = useSetRecoilState(nodesAtom);
    const setEdges = useSetRecoilState(edgesAtom);
    const setFlowInit = useSetRecoilState(flowInitAtom);
    const flowInit = useRecoilValue(flowInitAtom);
    const resetNodes = useResetRecoilState(nodesAtom);
    const resetEdges = useResetRecoilState(edgesAtom);

    const nodes = useRecoilValue(nodesAtom);
    const edges = useRecoilValue(edgesAtom);

    const [openTemplateList, setOpenTemplateList] = useState(false);
    const [addTemplateModal, setAddTemplateModal] = useState(false);

    const [resetFlowModal, setResetFlowModal] = useState(false);

    const { openDrawer } = useDrawer();

    const handleClick = useCallback(
        (instanceID: number) => {
            openDrawer(
                <Suspense fallback={<DetailDrawerSkeleton />}>
                    <InstanceDetail clusterID={protectionCluster.id} instanceID={instanceID} />
                </Suspense>,
            );
        },
        [openDrawer, protectionCluster.id],
    );

    useEffect(() => {
        setFlowInit(true);
        if (!nodes) {
            setNodes([]);
        }
    }, [setFlowInit, nodes, setNodes, edges]);

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

            setRecoveryPlanAdd({
                ...recoveryPlanAdd,
                detail: {
                    ...recoveryPlanAdd.detail,
                    instances: recoveryPlanAdd.detail.instances.map(ins => {
                        if (ins.protection_cluster_instance.id === instance[0].id) {
                            return {
                                ...ins,
                                auto_start_flag: false,
                            };
                        } else return ins;
                    }),
                },
            });
            // 남아있는 노드
            currentOperationInstances = currentOperationInstances.filter(
                instance => Number(instance.id) !== Number(id),
            );

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
     * onNodesDelete 의 파라미터 nodes: Node[]
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

            const currentPlan = recoveryPlanAdd.detail.instances.filter(
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

        const filteredInsatncePlan = recoveryPlanAdd.detail.instances.map(instance => {
            //  같은게 있다면 바꿔주기
            const matchingPlan = instancesPlans.find(
                plan => plan.protection_cluster_instance.id === instance.protection_cluster_instance.id,
            );
            return matchingPlan ? matchingPlan : instance;
        });

        setRecoveryPlanAdd({
            ...recoveryPlanAdd,
            detail: {
                ...recoveryPlanAdd.detail,
                instances: filteredInsatncePlan,
            },
        });
    };

    // 적용된 기동계획을 초기화하는 함수
    const resetFlow = () => {
        callbackDeleteNode(nodes);
        resetNodes();
        resetEdges();
        setResetFlowModal(false);
    };

    return (
        <>
            <CardContent sx={{ flex: '1' }}>
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
                                    {/* <Tooltip title={<Typography>{t('DR.INSTANCE_SORT')}</Typography>}>
                                        <StyledIconButton onClick={sortInstances}>
                                            <GridOnOutlinedIcon />
                                        </StyledIconButton>
                                    </Tooltip> */}
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
            <Divider />
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
                    instancePlan={recoveryPlanAdd.detail.instances}
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

export default OperationPlan;

const InstanceWrapper = styled(Box)`
    padding: 1rem;
`;

const FlowWrapper = styled(Box)`
    height: 100%;
    padding-left: 1rem;
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

const IconButtonWrapper = styled.div`
    display: flex;
`;

const StyledIconButton = styled(IconButton)`
    padding: 0 0 5px 5px;
`;
