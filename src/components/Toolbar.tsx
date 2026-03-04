import { DragEvent } from 'react';
import {
  Download, Upload, Brain, Type, Globe,
  Calculator, Filter, Clock, Shuffle
} from 'lucide-react';

/** Node type definitions for the toolbar */
const nodeTypes = [
  { type: 'input', label: 'Input', icon: Download, color: 'bg-node-input' },
  { type: 'output', label: 'Output', icon: Upload, color: 'bg-node-output' },
  { type: 'llm', label: 'LLM', icon: Brain, color: 'bg-node-llm' },
  { type: 'text', label: 'Text', icon: Type, color: 'bg-node-text' },
  { type: 'api', label: 'API', icon: Globe, color: 'bg-node-api' },
  { type: 'math', label: 'Math', icon: Calculator, color: 'bg-node-math' },
  { type: 'filter', label: 'Filter', icon: Filter, color: 'bg-node-filter' },
  { type: 'delay', label: 'Delay', icon: Clock, color: 'bg-node-delay' },
  { type: 'transform', label: 'Transform', icon: Shuffle, color: 'bg-node-transform' },
];

/**
 * Toolbar - Displays draggable node types that can be dropped onto the canvas.
 * Uses HTML5 drag-and-drop to transfer node type data.
 */
const Toolbar = () => {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2 font-mono">
        Nodes
      </span>
      {nodeTypes.map(({ type, label, icon: Icon, color }) => (
        <div
          key={type}
          draggable
          onDragStart={(e) => onDragStart(e, type)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background cursor-grab active:cursor-grabbing hover:border-primary/40 hover:shadow-sm transition-all text-xs font-medium select-none"
        >
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <Icon size={12} className="opacity-60" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default Toolbar;
