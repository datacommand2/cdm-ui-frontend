import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MarkerType, Position } from 'reactflow';
import styled from 'styled-components';
import FolderIcon from '@mui/icons-material/Folder';
import ErrorIcon from '@mui/icons-material/Error';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { useSetRecoilState } from 'recoil';

import { TemplateInstance } from '../../../../../@types';
import { getLayoutedElements } from '../../../../../libs/node';
import { calculateMatchingRate, formatUnixTimestamp } from '../../../../../libs/utils/commonFunction';
import { Detail } from '../../../../component/common/Detail/Detail';
import { ResizePanel } from '../../../../component/common/Resize/ResizePanel';
import WorkloadFlow from '../../../../component/common/reactflow/WorkloadFlow';
import DefaultSpinner from '../../../../component/common/Skeleton/DefaultSpinner';
import FlowSidebar from '../../../../component/common/reactflow/FlowSidebar';
import DetailDrawerSkeleton from '../../../../component/common/Skeleton/DetailDrawerSkeleton';
import { templateEdgesAtom, templateNodesAtom } from '../../../../../recoil/atom/OpenShiftRecoveryPlanAtom';

interface InstanceTemplateDetailProps {
    templateID: number;
    planInstances: {
        operatedInstances: any[];
        nonOperatedInstances: any[];
    };
    instanceTemplate: any;
    isLoading: boolean;
}

/**
 * 인스턴스 템플릿 상세조회
 */
const InstanceTemplateDetail = ({
    instanceTemplate,
    templateID,
    planInstances,
    isLoading,
}: InstanceTemplateDetailProps) => {
    const currentPlanInstances = [...planInstances.operatedInstances, ...planInstances.nonOperatedInstances];
    const { t } = useTranslation();
    const theme = useTheme();
    const mode = theme.palette.mode;
    const setTemplateNodes = useSetRecoilState(templateNodesAtom);
    const setTemplateEdges = useSetRecoilState(templateEdgesAtom);

    const [nodes, setNodes] = useState(undefined);
    const [edges, setEdges] = useState([]);

    const init = () => {
        let modifiedEdges: any[] = [];
        // 기동 인스턴스만 React Flow의 Node로 그린다.
        const instances = instanceTemplate.instances.filter((instance: any) => {
            if (instance?.auto_start_flag) {
                return instance;
            }
        });
        // 해당 인스턴스 상세 정보로 이루어진 기동 인스턴스

        const flowNodes = instances.map((instance: any, idx: number) => {
            const instanceID = currentPlanInstances.find(
                ins => ins.name === instance.protection_cluster_instance_name,
            )?.id;
            if (instance?.protection_cluster_instance_name) {
                instance = { ...instance };
            }
            if (instance.dependencies) {
                if (instance.dependencies.length > 0) {
                    instance.dependencies.map((dependency: any) => {
                        //  dependency, dependency.id 둘 다 사용하는 이유는
                        // 오픈시프트에서는 dependencies 가 string[], 오픈스택에서는 { id: number }[]

                        // TODO:
                        // => 애초에 dependenceis 배열을 변환시켜서 map 돌리면 될 듯?
                        const node = instances.find(
                            (v: any) =>
                                v.protection_cluster_instance_name === dependency ||
                                v.protection_cluster_instance_name === dependency?.name,
                        );
                        const nodeID = currentPlanInstances.find(
                            ins => ins.name === node.protection_cluster_instance_name,
                        )?.id;
                        if (node) {
                            modifiedEdges.push({
                                id: `${nodeID}_${node.protection_cluster_instance_name}(_edge_)${instanceID}_${instance.protection_cluster_instance_name}`,
                                source: `${nodeID}_${node.protection_cluster_instance_name}`,
                                target: `${instanceID}_${instance.protection_cluster_instance_name}`,
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
                id: `${instanceID}_${instance.protection_cluster_instance_name}`,
                type: 'CustomNode',
                position: {
                    x: (idx % 4) * 300, // 한 줄에 4개씩 배치되도록 수정
                    y: Math.floor(idx / 4) * 100, // 한 줄마다 세로 간격을 조정하여 요소를 배치
                },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                data: {
                    label: instance.protection_cluster_instance_name,
                    id: instanceID,
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
        setTemplateNodes(layout.nodes);
        setTemplateEdges(layout.edges);
    };

    useEffect(() => {
        if (instanceTemplate?.instances) {
            init();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instanceTemplate, templateID, isLoading]);

    const operationInstances = useMemo(() => {
        const templatedOperatedInstances = instanceTemplate?.instances.filter((instance: any) => {
            if (instance?.auto_start_flag) {
                return instance;
            }
        });
        return templatedOperatedInstances?.map((instance: any) => {
            return {
                name: instance.protection_cluster_instance_name,
                auto_start_flag: instance?.auto_start_flag === true ?? false,
            };
        });
    }, [instanceTemplate]);

    const nonOperationInstances = useMemo(() => {
        const templatedNonOperatedInstances = instanceTemplate?.instances.filter((instance: any) => {
            if (!instance?.auto_start_flag) {
                return instance;
            }
        });

        return templatedNonOperatedInstances?.map((instance: any) => {
            return {
                name: instance.protection_cluster_instance_name,
                auto_start_flag: instance?.auto_start_flag === true ?? false,
            };
        });
    }, [instanceTemplate]);

    const getPercentageColor = (value: number) => {
        if (value <= 40) {
            return `${mode}-error`;
        } else if (value <= 60) {
            return `${mode}-warning`;
        } else {
            return `${mode}-success`;
        }
    };

    const checkIncludePlanInstance = (instance: string) => {
        if (!currentPlanInstances.find(ins => ins.name === instance)) {
            return `${mode}-error`;
        } else {
            return ``;
        }
    };

    return (
        <ResizePanel>
            <ResizePanel.Pane defaultSize={15}>
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
                    {isLoading || !nodes ? (
                        <DefaultSpinner />
                    ) : (
                        <WorkloadFlow initNodes={nodes} initEdges={edges} type="recoveryResult" storeNodes={setNodes} />
                    )}
                </FlowWrapper>
            </ResizePanel.Pane>
            <ResizePanel.PaneHandle />
            <ResizePanel.Pane defaultSize={20}>
                <FlowDetail className={`flow-detail`}>
                    <FlowHeader>
                        <Typography variant="h6">{instanceTemplate?.name}</Typography>
                    </FlowHeader>
                    {instanceTemplate ? (
                        <>
                            <Detail.ContentWrapper>
                                <Detail.ContentTitleDiv>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 700 }}>일치율</Typography>
                                        <Tooltip
                                            title={
                                                <Typography>
                                                    복구 계획의 인스턴스와 인스턴스 템플릿 간의 일치 정도
                                                </Typography>
                                            }
                                        >
                                            <div style={{ display: 'flex' }}>
                                                <ErrorIcon />
                                            </div>
                                        </Tooltip>
                                    </div>
                                </Detail.ContentTitleDiv>
                                <Detail.ContentBodyDiv>
                                    <Typography
                                        className={getPercentageColor(
                                            calculateMatchingRate(currentPlanInstances, instanceTemplate?.instances),
                                        )}
                                    >
                                        {calculateMatchingRate(currentPlanInstances, instanceTemplate?.instances)}%
                                    </Typography>
                                </Detail.ContentBodyDiv>
                            </Detail.ContentWrapper>
                            <Detail.ContentWrapper>
                                <Detail.ContentTitle text={'기동 인스턴스'} />
                                <Detail.ContentBody>
                                    {instanceTemplate.instances.map((ins: TemplateInstance) => {
                                        if (ins?.auto_start_flag) {
                                            return (
                                                <Typography key={ins.protection_cluster_instance_name}>
                                                    {ins.protection_cluster_instance_name}
                                                </Typography>
                                            );
                                        }
                                    })}
                                </Detail.ContentBody>
                            </Detail.ContentWrapper>
                            <Detail.ContentWrapper>
                                <Detail.ContentTitle text={'비기동 인스턴스'} />
                                <Detail.ContentBody>
                                    {instanceTemplate.instances.map((ins: TemplateInstance) => {
                                        if (!ins?.auto_start_flag) {
                                            return (
                                                <Typography key={ins.protection_cluster_instance_name}>
                                                    {ins.protection_cluster_instance_name}
                                                </Typography>
                                            );
                                        }
                                    })}
                                </Detail.ContentBody>
                            </Detail.ContentWrapper>
                            <Detail.ContentWrapper>
                                <Detail.ContentTitle text={'설명'} />
                                <Detail.ContentBody>{instanceTemplate?.remarks ?? '-'}</Detail.ContentBody>
                            </Detail.ContentWrapper>
                            <Detail.ContentWrapper>
                                <Detail.ContentTitle text={'생성일'} />
                                <Detail.ContentBody>
                                    {formatUnixTimestamp(instanceTemplate.created_at)}
                                </Detail.ContentBody>
                            </Detail.ContentWrapper>
                            <Detail.ContentWrapper>
                                <Detail.ContentHeader text="비교" />
                            </Detail.ContentWrapper>
                            <CompareWrapper>
                                <Compare>
                                    <Detail.ContentTitle text={'복구계획 인스턴스'} />
                                    <Detail.ContentBody>
                                        {currentPlanInstances.map((ins: any) => {
                                            return <Typography key={ins.id}>{ins.name}</Typography>;
                                        })}
                                    </Detail.ContentBody>
                                </Compare>
                                <Compare>
                                    <Detail.ContentTitle text={'템플릿 인스턴스'} />
                                    <Detail.ContentBody>
                                        {instanceTemplate.instances.map((ins: TemplateInstance) => {
                                            return (
                                                <Typography
                                                    className={checkIncludePlanInstance(
                                                        ins.protection_cluster_instance_name,
                                                    )}
                                                    key={ins.protection_cluster_instance_name}
                                                >
                                                    {ins.protection_cluster_instance_name}
                                                </Typography>
                                            );
                                        })}
                                    </Detail.ContentBody>
                                </Compare>
                            </CompareWrapper>
                        </>
                    ) : (
                        <DetailDrawerSkeleton />
                    )}
                </FlowDetail>
            </ResizePanel.Pane>
        </ResizePanel>
    );
};

export default InstanceTemplateDetail;

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

const FlowDetail = styled(Grid2).attrs({ xs: 12, md: 3 })`
    padding: 0;
`;
const CompareWrapper = styled(Grid2).attrs({ container: true })`
    display: flex;
`;
const Compare = styled(Grid2).attrs({ xs: 6 })`
    padding: 0.5rem;
    flex: 1;
    text-align: center;
`;
