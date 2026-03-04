import { BaseNodeWithBody } from './BaseNode';
import { Calculator } from 'lucide-react';

/** MathNode - Performs mathematical operations on inputs */
const MathNode = () => (
  <BaseNodeWithBody
    title="Math"
    icon={<Calculator size={14} />}
    accentColor="bg-node-math"
    inputs={[{ id: 'a' }, { id: 'b' }]}
    outputs={[{ id: 'result' }]}
  >
    <label className="text-xs font-medium text-muted-foreground">Operation</label>
    <select className="w-full mt-1 px-2 py-1.5 text-xs rounded-md border border-input bg-background">
      <option>Add</option>
      <option>Subtract</option>
      <option>Multiply</option>
      <option>Divide</option>
    </select>
  </BaseNodeWithBody>
);

export default MathNode;
