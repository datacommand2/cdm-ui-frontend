import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
    addEdge,
    Connection,
    Edge,
    Node,
    Position,
    ReactFlowInstance,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    MarkerType,
    MiniMap,
    Background,
    Controls,
    BackgroundVariant,
} from 'reactflow';
// import { debounce } from 'lodash';
import 'reactflow/dist/style.css';
import { useTheme } from '@mui/material';
import { debounce } from 'lodash';

import CustomNode from './CustomNode';
import JobStatusBar from '../../statusBar/JobStatusBar';
import ResultStatusBar from '../../statusBar/ResultStatusBar';

const nodeTypes = {
    CustomNode: CustomNode,
};

interface WorkloadFlowProps {
    initNodes: Node[];
    initEdges: Edge[];
    edgeConnect?: (edges: Edge[]) => void;
    storeNodes?: any;
    handleDrag?: boolean;
    type?: string;
    dropCallback?: any;
    deleteCallback?: any;
    canBehavior?: boolean;
    onDelete?: any;
}

const WorkloadFlow = ({
    initNodes,
    initEdges,
    edgeConnect,
    storeNodes,
    handleDrag = true,
    dropCallback,
    deleteCallback,
    canBehavior = true,
    type = '',
    onDelete,
}: // type = '',
WorkloadFlowProps) => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    // TODO: debounce
    const setStoreNodes = debounce(nodes => {
        if (storeNodes) {
            storeNodes(nodes);
        }
    }, 500);

    useEffect(() => {
        if (initNodes && initNodes.length > 0) {
            setNodes(
                initNodes.map(node => {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            setEdges,
                        },
                    };
                }),
            );
        } else {
            setNodes(initNodes);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initNodes]);

    useEffect(() => {
        if (storeNodes) {
            setStoreNodes(nodes);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storeNodes]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    /**
     * 연결될 때 이벤트
     */
    const onConnect = useCallback(
        (params: Edge<any> | Connection) => {
            setEdges(eds =>
                addEdge(
                    {
                        ...params,
                        id: `${params.source}(_edge_)${params.target}`,
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                        },
                        type: 'smoothstep',
                        animated: true,
                    },
                    eds,
                ),
            );
        },
        [setEdges],
    );
    useEffect(() => {
        if (edgeConnect) {
            edgeConnect(edges);
        }
    }, [edgeConnect, edges]);

    /**
     * 노드 엘리먼트 로드
     */
    const onInit = useCallback((instance: ReactFlowInstance) => {
        setReactFlowInstance(instance);
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
            const ID = event.dataTransfer.getData('application/reactflow/id');
            const Name = event.dataTransfer.getData('application/reactflow/name');
            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }
            if (reactFlowBounds === undefined) return;

            let position = reactFlowInstance
                ? reactFlowInstance.project({
                      x: event.clientX - reactFlowBounds.left,
                      y: event.clientY - reactFlowBounds.top,
                  })
                : { x: 0, y: 0 };

            const newNode: Node = {
                id: `${ID}_${Name}`,
                type: 'CustomNode',
                position,
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                data: {
                    label: Name,
                    id: Number(ID),
                    edges,
                    isConnectable: true,
                    deletable: true,
                    onDelete: (nodes: Node[], instances: any) => {
                        onDelete(nodes, instances);
                    },
                    setEdges,
                },
            };

            // openstack의 경우 비기동 인스턴스 -> 기동 인스턴스
            dropCallback(ID, newNode);
            if (nodes?.find(node => Number(node.data.id) === Number(ID))) {
                setNodes(nds =>
                    nds.map(nd => {
                        if (Number(nd.data.id) === Number(ID)) {
                            return { ...nd, position };
                        } else {
                            return nd;
                        }
                    }),
                );
            } else {
                setNodes(nds => nds.concat(newNode));
            }
        },
        [dropCallback, edges, nodes, onDelete, reactFlowInstance, setEdges, setNodes],
    );

    return (
        <ReactFlowProvider>
            <div className={`${mode}-react-flow-wrapper`} ref={reactFlowWrapper} style={{ height: '100%' }}>
                <ReactFlow
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onDragOver={onDragOver}
                    onConnect={canBehavior ? onConnect : undefined}
                    onDrop={handleDrag ? onDrop : undefined}
                    onInit={onInit}
                    nodes={nodes}
                    edges={edges}
                    multiSelectionKeyCode="Control"
                    className="validationflow"
                    // onNodeDragStop={nodes => {}}
                    deleteKeyCode={canBehavior ? 'Delete' : null}
                    nodeTypes={nodeTypes}
                    onNodesDelete={canBehavior ? deleteCallback : undefined}
                    nodesDraggable={canBehavior ?? false}
                    nodesConnectable={canBehavior ?? false}
                    defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                    minZoom={0.1}
                >
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                    {type === 'monitoring' && <JobStatusBar />}
                    {type === 'recoveryResult' && <ResultStatusBar />}
                    <Controls position="top-right" />
                    <MiniMap pannable={true} zoomable={true} position="bottom-right" nodeStrokeWidth={3} />
                </ReactFlow>
            </div>
        </ReactFlowProvider>
    );
};

export default WorkloadFlow;
