import { BaseNodeWithBody } from './BaseNode';
import { Clock } from 'lucide-react';

const DelayNode = () => (
  <BaseNodeWithBody
    title="Delay"
    icon={<Clock size={14} />}
    accentColor="bg-node-delay"
    inputs={[{ id: 'input' }]}
    outputs={[{ id: 'output' }]}
  >
    <label className="text-xs font-medium text-muted-foreground">Duration (ms)</label>
    <input
      type="number"
      defaultValue={1000}
      className="w-full mt-1 px-2 py-1.5 text-xs rounded-md border border-input bg-background"
    />
  </BaseNodeWithBody>
);

export default DelayNode;
