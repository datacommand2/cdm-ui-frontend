import { edgesAtom, nodesAtom, planInstancesAtom } from '@/recoil/atom/OpenShiftRecoveryPlanAtom';
import { Edge, Node } from 'reactflow';
import { useRecoilValue } from 'recoil';

/**
 * 노드 삭제 함수
 */
export const useOnDelete = (data: any) => {
    const edges = useRecoilValue(edgesAtom);
    const nodes = useRecoilValue(nodesAtom);
    const planInstances = useRecoilValue(planInstancesAtom);

    const onDelete = () => {
        const updatedNodes = nodes.filter((node: Node) => node.data.id === data.id);
        const updatedEdges = edges.filter(
            (edge: Edge) =>
                Number(edge.source.split('_')[0]) !== Number(data.id) &&
                Number(edge.target.split('_')[0]) !== Number(data.id),
        );

        data.setEdges(updatedEdges);
        data.onDelete(updatedNodes, planInstances);
    };

    return { onDelete };
};
