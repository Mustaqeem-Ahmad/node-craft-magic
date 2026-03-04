import { BaseNodeWithBody } from './BaseNode';
import { Upload } from 'lucide-react';

const OutputNode = ({ data }: { data: { outputType?: string } }) => (
  <BaseNodeWithBody
    title="Output"
    icon={<Upload size={14} />}
    accentColor="bg-node-output"
    inputs={[{ id: 'input' }]}
  >
    <label className="text-xs font-medium text-muted-foreground">Type</label>
    <select
      className="w-full mt-1 px-2 py-1.5 text-xs rounded-md border border-input bg-background"
      defaultValue={data.outputType || 'Text'}
    >
      <option>Text</option>
      <option>Image</option>
      <option>JSON</option>
    </select>
  </BaseNodeWithBody>
);

export default OutputNode;
