import React, { useState, useRef, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Edge,
  Connection,
  ReactFlowInstance,
} from "reactflow";
import { useDrop } from "react-dnd";
import "reactflow/dist/style.css";
import "./dndFlow.css";

const initialNodes = [
  {
    id: "1",
    type: "default",
    data: { label: "default node" },
    position: { x: 10, y: 10 },
  },
];

const DnDFlow: React.FC = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [numOfNodes, setNumOfNodes] = useState(1);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "message",
      drop: (_, monitor) => {
        const num = numOfNodes + 1;
        const delta = monitor.getSourceClientOffset() as XYCoord;
        const reactFlowBounds =
          reactFlowWrapper.current.getBoundingClientRect();

        const position = reactFlowInstance.project({
          x: delta.x - reactFlowBounds.left,
          y: delta.y - reactFlowBounds.top,
        });
        setNodes((prevNodes) =>
          prevNodes.concat({
            id: num.toString(10),
            position,
            type: "default",
            data: { label: "default node " + num.toString(10) },
            draggable: true,
          })
        );
        setNumOfNodes((prevNum) => prevNum + 1);
      },
    }),
    [numOfNodes, reactFlowInstance]
  );

  return (
    <div className="dnd-flow" ref={drop}>
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
          >
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default DnDFlow;