import { Handle, Position } from 'reactflow';
import { ReactNode } from 'react';

export interface HandleConfig {
  id: string;
  label?: string;
}

interface BaseNodeProps {
  title: string;
  icon?: ReactNode;
  accentColor?: string;
  inputs?: HandleConfig[];
  outputs?: HandleConfig[];
  children?: ReactNode;
}

// Spreads handles evenly along the edge of the node
const getHandlePosition = (index: number, total: number) => {
  if (total === 1) return '50%';
  const gap = 100 / (total + 1);
  return `${gap * (index + 1)}%`;
};

// Simple node shell without a body section
const BaseNode = ({ title, icon, accentColor = 'bg-primary', inputs = [], outputs = [] }: BaseNodeProps) => {
  return (
    <div className="pipeline-node">
      <div className={`h-1 rounded-t-lg ${accentColor}`} />
      <div className="node-header">
        {icon && <span className="text-sm opacity-70">{icon}</span>}
        <span>{title}</span>
      </div>

      {inputs.map((inp, i) => (
        <Handle
          key={`in-${inp.id}`}
          type="target"
          position={Position.Left}
          id={inp.id}
          style={{ top: getHandlePosition(i, inputs.length) }}
        />
      ))}

      {outputs.map((out, i) => (
        <Handle
          key={`out-${out.id}`}
          type="source"
          position={Position.Right}
          id={out.id}
          style={{ top: getHandlePosition(i, outputs.length) }}
        />
      ))}
    </div>
  );
};

// Same thing but with a body area for form controls, labels, etc.
export const BaseNodeWithBody = ({ title, icon, accentColor = 'bg-primary', inputs = [], outputs = [], children }: BaseNodeProps) => (
  <div className="pipeline-node">
    <div className={`h-1 rounded-t-lg ${accentColor}`} />
    <div className="node-header">
      {icon && <span className="text-sm opacity-70">{icon}</span>}
      <span>{title}</span>
    </div>
    {children && <div className="node-body">{children}</div>}

    {inputs.map((inp, i) => (
      <Handle
        key={`in-${inp.id}`}
        type="target"
        position={Position.Left}
        id={inp.id}
        style={{ top: getHandlePosition(i, inputs.length) }}
      />
    ))}
    {outputs.map((out, i) => (
      <Handle
        key={`out-${out.id}`}
        type="source"
        position={Position.Right}
        id={out.id}
        style={{ top: getHandlePosition(i, outputs.length) }}
      />
    ))}
  </div>
);

export default BaseNode;
