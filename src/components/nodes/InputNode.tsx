import { BaseNodeWithBody } from './BaseNode';
import { Download } from 'lucide-react';

const InputNode = ({ data }: { data: { inputType?: string } }) => (
  <BaseNodeWithBody
    title="Input"
    icon={<Download size={14} />}
    accentColor="bg-node-input"
    outputs={[{ id: 'output' }]}
  >
    <label className="text-xs font-medium text-muted-foreground">Type</label>
    <select
      className="w-full mt-1 px-2 py-1.5 text-xs rounded-md border border-input bg-background"
      defaultValue={data.inputType || 'Text'}
    >
      <option>Text</option>
      <option>File</option>
      <option>Image</option>
      <option>JSON</option>
    </select>
  </BaseNodeWithBody>
);

export default InputNode;
