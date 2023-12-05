import React, { useEffect, useMemo } from 'react';
import { MarkerType, Position } from 'reactflow';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import FolderIcon from '@mui/icons-material/Folder';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { getLayoutedElements } from '../../../../../libs/node';
import FlowSidebar from '../../../../component/common/reactflow/FlowSidebar';
import { ResizePanel } from '../../../../component/common/Resize/ResizePanel';
import { TreeView } from '@mui/x-tree-view/TreeView';
import WorkloadFlow from '../../../../component/common/reactflow/WorkloadFlow';

import { edgesAtom, nodesAtom } from '../../../../../recoil/atom/OpenShiftRecoveryPlanAtom';
import DefaultSpinner from '../../../../component/common/Skeleton/DefaultSpinner';

interface ResultWorkFlowTabProps {
    resultDetail: any;
}
/**
 * 복구결과 페이지의 워크플로우 탭
 */
const ResultWorkFlowTab = ({ resultDetail }: ResultWorkFlowTabProps) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const nodes = useRecoilValue(nodesAtom);
    const edges = useRecoilValue(edgesAtom);
    const setNodes = useSetRecoilState(nodesAtom);
    const setEdges = useSetRecoilState(edgesAtom);

    const init = () => {
        if (resultDetail?.instances) {
            let modifiedEdges: any[] = [];
            // 기동 인스턴스만 React Flow의 Node로 그린다.
            const instances = resultDetail.instances.filter((instance: any) => {
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

                            // TODO:
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
                                    deletable: false,
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
                    width: 200,
                    sourcePosition: Position.Right,
                    targetPosition: Position.Left,
                    data: {
                        label: instance.name,
                        id: instance.id,
                        edges,
                        isConnectable: false,
                        state_code: instance.state_code,
                        result_code: instance.result_code,
                    },
                    deletable: false,
                    draggable: false,
                };
            });
            const layout = getLayoutedElements(flowNodes, modifiedEdges);

            setNodes(layout.nodes);
            setEdges(layout.edges);
        }
    };
    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const operationInstances = useMemo(() => {
        const instances = resultDetail.instances.filter((instance: any) => {
            if (instance?.auto_start_flag) {
                return instance;
            }
        });
        return instances.map((instance: any) => instance.protection_cluster_instance);
    }, [resultDetail.instances]);

    const nonOperationInstances = useMemo(() => {
        const instances = resultDetail.instances.filter((instance: any) => {
            if (!instance?.auto_start_flag) {
                return instance;
            }
        });

        return instances.map((instance: any) => instance.protection_cluster_instance);
    }, [resultDetail.instances]);

    return (
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
                        <FlowSidebar itemList={operationInstances} headerNodeID={'1'} headerTitle={'기동 인스턴스'} />
                        <FlowSidebar
                            itemList={nonOperationInstances}
                            headerNodeID={'2'}
                            headerTitle={'비기동 인스턴스'}
                        />
                    </TreeView>
                </InstanceWrapper>
            </ResizePanel.Pane>
            <ResizePanel.PaneHandle />
            <ResizePanel.Pane style={{ display: 'flex', flexDirection: 'column' }}>
                <FlowWrapper>
                    <FlowHeader>
                        <Typography variant="h6">{t('DR.RP.OPERATION_INSTANCE')}</Typography>
                    </FlowHeader>
                    {!nodes ? (
                        <DefaultSpinner />
                    ) : (
                        <WorkloadFlow
                            initNodes={nodes}
                            initEdges={edges}
                            // edgeConnect={edgeConnect}
                            storeNodes={setNodes}
                            type="recoveryResult"
                        />
                    )}
                </FlowWrapper>
            </ResizePanel.Pane>
        </ResizePanel>
    );
};

export default ResultWorkFlowTab;

const InstanceWrapper = styled(Box)`
    padding: 1rem;
`;

const FlowWrapper = styled(Box)`
    height: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
    display: flex;
    flex-direction: column;
`;

const FlowHeader = styled(Box)`
    display: flex;
    justify-content: space-between;
    padding: 1em;
    align-items: center;
`;
