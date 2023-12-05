import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
const nodeWidth = 240;
const nodeHeight = 48;

dagreGraph.setDefaultEdgeLabel(() => ({}));

// 엘리먼트 수평 정렬
const getLayoutedElements = (nodes, edges) => {
    dagreGraph.setGraph({ rankdir: 'LR' });

    nodes.forEach(node => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight * 2 });
    });

    edges.forEach(edge => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes;

    const resultNodes = newNodes.map(node => {
        const newNode = { ...node };
        const nodeWithPosition = dagreGraph.node(node.id);

        const position = {
            x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
            // x: nodeWithPosition.x - nodeWidth / 2,
            // y: nodeWithPosition.y - nodeHeight / 2,
            y: nodeWithPosition.y - nodeHeight,
        };

        newNode.targetPosition = 'left';
        newNode.sourcePosition = 'right';
        newNode.position = { ...position };

        return newNode;
    });
    return { nodes: resultNodes, edges };
};

export { getLayoutedElements };
