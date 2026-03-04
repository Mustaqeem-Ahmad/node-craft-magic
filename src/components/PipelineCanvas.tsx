import { useCallback, useRef, DragEvent, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  ReactFlowInstance,
  BackgroundVariant,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import InputNode from './nodes/InputNode';
import OutputNode from './nodes/OutputNode';
import LLMNode from './nodes/LLMNode';
import TextNode from './nodes/TextNode';
import ApiNode from './nodes/ApiNode';
import MathNode from './nodes/MathNode';
import FilterNode from './nodes/FilterNode';
import DelayNode from './nodes/DelayNode';
import TransformNode from './nodes/TransformNode';
import Toolbar from './Toolbar';
import SubmitButton from './SubmitButton';

// Register custom node types with React Flow
const nodeTypes = {
  input: InputNode,
  output: OutputNode,
  llm: LLMNode,
  text: TextNode,
  api: ApiNode,
  math: MathNode,
  filter: FilterNode,
  delay: DelayNode,
  transform: TransformNode,
};

// Initial demo nodes
const initialNodes: Node[] = [
  {
    id: 'input-1',
    type: 'input',
    position: { x: 50, y: 200 },
    data: { inputType: 'Text' },
  },
  {
    id: 'llm-1',
    type: 'llm',
    position: { x: 350, y: 150 },
    data: {},
  },
  {
    id: 'output-1',
    type: 'output',
    position: { x: 650, y: 200 },
    data: { outputType: 'Text' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'input-1', sourceHandle: 'output', target: 'llm-1', targetHandle: 'prompt', animated: true },
  { id: 'e2', source: 'llm-1', sourceHandle: 'response', target: 'output-1', targetHandle: 'input', animated: true },
];

let nodeId = 10; // Counter for generating unique node IDs

/**
 * PipelineCanvas - Main canvas component that renders the React Flow graph.
 * Supports drag-and-drop from toolbar, node connections, and pipeline submission.
 */
const PipelineCanvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  // Handle new edge connections
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // Handle drag-over to allow drop
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle dropping a new node from toolbar
  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !rfInstance || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = rfInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: Node = {
        id: `${type}-${nodeId++}`,
        type,
        position,
        data: {},
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [rfInstance, setNodes]
  );

  return (
    <div className="flex flex-col h-screen">
      <Toolbar />
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setRfInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultEdgeOptions={{ animated: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls />
          <MiniMap
            nodeStrokeWidth={3}
            pannable
            zoomable
            style={{ height: 100, width: 150 }}
          />
        </ReactFlow>
        <SubmitButton nodes={nodes} edges={edges} />
      </div>
    </div>
  );
};

export default PipelineCanvas;
