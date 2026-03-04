import { Handle, Position } from 'reactflow';
import { ReactNode } from 'react';

// Handle configuration type
export interface HandleConfig {
  id: string;
  label?: string;
}

interface BaseNodeProps {
  title: string;
  icon?: ReactNode;
  /** Color class for the header accent bar */
  accentColor?: string;
  inputs?: HandleConfig[];
  outputs?: HandleConfig[];
  children?: ReactNode;
}

/**
 * BaseNode - Reusable node component for the pipeline builder.
 * Renders a styled card with dynamic input/output handles.
 * All pipeline nodes should extend this component to maintain consistent styling.
 */
const BaseNode = ({ title, icon, accentColor = 'bg-primary', inputs = [], outputs = [] }: BaseNodeProps & { children?: ReactNode }) => {
  // Calculate handle positions evenly distributed along the node edge
  const getHandleOffset = (index: number, total: number) => {
    if (total === 1) return '50%';
    const spacing = 100 / (total + 1);
    return `${spacing * (index + 1)}%`;
  };

  return (
    <div className="pipeline-node">
      {/* Accent bar at top */}
      <div className={`h-1 rounded-t-lg ${accentColor}`} />

      {/* Header */}
      <div className="node-header">
        {icon && <span className="text-sm opacity-70">{icon}</span>}
        <span>{title}</span>
      </div>

      {/* Input handles (left side) */}
      {inputs.map((input, i) => (
        <Handle
          key={`input-${input.id}`}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{ top: getHandleOffset(i, inputs.length) }}
        />
      ))}

      {/* Output handles (right side) */}
      {outputs.map((output, i) => (
        <Handle
          key={`output-${output.id}`}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{ top: getHandleOffset(i, outputs.length) }}
        />
      ))}
    </div>
  );
};

// Extended version that also renders children in body
export const BaseNodeWithBody = ({ title, icon, accentColor = 'bg-primary', inputs = [], outputs = [], children }: BaseNodeProps) => {
  const getHandleOffset = (index: number, total: number) => {
    if (total === 1) return '50%';
    const spacing = 100 / (total + 1);
    return `${spacing * (index + 1)}%`;
  };

  return (
    <div className="pipeline-node">
      <div className={`h-1 rounded-t-lg ${accentColor}`} />
      <div className="node-header">
        {icon && <span className="text-sm opacity-70">{icon}</span>}
        <span>{title}</span>
      </div>
      {children && <div className="node-body">{children}</div>}

      {inputs.map((input, i) => (
        <Handle
          key={`input-${input.id}`}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{ top: getHandleOffset(i, inputs.length) }}
        />
      ))}
      {outputs.map((output, i) => (
        <Handle
          key={`output-${output.id}`}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{ top: getHandleOffset(i, outputs.length) }}
        />
      ))}
    </div>
  );
};

export default BaseNode;
