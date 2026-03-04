import { BaseNodeWithBody } from './BaseNode';
import { Shuffle } from 'lucide-react';

/** TransformNode - Transforms data using a JavaScript expression */
const TransformNode = () => (
  <BaseNodeWithBody
    title="Transform"
    icon={<Shuffle size={14} />}
    accentColor="bg-node-transform"
    inputs={[{ id: 'input' }]}
    outputs={[{ id: 'output' }]}
  >
    <label className="text-xs font-medium text-muted-foreground">Expression</label>
    <input
      className="w-full mt-1 px-2 py-1.5 text-xs rounded-md border border-input bg-background font-mono"
      placeholder="data.map(x => x * 2)"
    />
  </BaseNodeWithBody>
);

export default TransformNode;
