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

// Register all our custom node components
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

// Starting nodes so the canvas isn't empty
const defaultNodes: Node[] = [
  { id: 'input-1', type: 'input', position: { x: 50, y: 200 }, data: { inputType: 'Text' } },
  { id: 'llm-1', type: 'llm', position: { x: 350, y: 150 }, data: {} },
  { id: 'output-1', type: 'output', position: { x: 650, y: 200 }, data: { outputType: 'Text' } },
];

const defaultEdges: Edge[] = [
  { id: 'e1', source: 'input-1', sourceHandle: 'output', target: 'llm-1', targetHandle: 'prompt', animated: true },
  { id: 'e2', source: 'llm-1', sourceHandle: 'response', target: 'output-1', targetHandle: 'input', animated: true },
];

let nextId = 10; // simple counter for new node IDs

const PipelineCanvas = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (conn: Connection) => setEdges((eds) => addEdge({ ...conn, animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Drop a new node from the toolbar onto the canvas
  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData('application/reactflow');
      if (!type || !rfInstance || !wrapperRef.current) return;

      const bounds = wrapperRef.current.getBoundingClientRect();
      const position = rfInstance.project({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      setNodes((nds) => [...nds, {
        id: `${type}-${nextId++}`,
        type,
        position,
        data: {},
      }]);
    },
    [rfInstance, setNodes]
  );

  return (
    <div className="flex flex-col h-screen">
      <Toolbar />
      <div className="flex-1 relative" ref={wrapperRef}>
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
          <MiniMap nodeStrokeWidth={3} pannable zoomable style={{ height: 100, width: 150 }} />
        </ReactFlow>
        <SubmitButton nodes={nodes} edges={edges} />
      </div>
    </div>
  );
};

export default PipelineCanvas;
