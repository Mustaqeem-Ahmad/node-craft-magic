import { BaseNodeWithBody } from './BaseNode';
import { Globe } from 'lucide-react';

const ApiNode = () => (
  <BaseNodeWithBody
    title="API Call"
    icon={<Globe size={14} />}
    accentColor="bg-node-api"
    inputs={[{ id: 'body' }, { id: 'headers' }]}
    outputs={[{ id: 'response' }]}
  >
    <label className="text-xs font-medium text-muted-foreground">Method</label>
    <select className="w-full mt-1 px-2 py-1.5 text-xs rounded-md border border-input bg-background">
      <option>GET</option>
      <option>POST</option>
      <option>PUT</option>
      <option>DELETE</option>
    </select>
    <label className="text-xs font-medium text-muted-foreground mt-2 block">URL</label>
    <input
      className="w-full mt-1 px-2 py-1.5 text-xs rounded-md border border-input bg-background font-mono"
      placeholder="https://api.example.com"
    />
  </BaseNodeWithBody>
);

export default ApiNode;
