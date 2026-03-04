import { BaseNodeWithBody } from './BaseNode';
import { Filter } from 'lucide-react';

const FilterNode = () => (
  <BaseNodeWithBody
    title="Filter"
    icon={<Filter size={14} />}
    accentColor="bg-node-filter"
    inputs={[{ id: 'data' }]}
    outputs={[{ id: 'passed' }, { id: 'rejected' }]}
  >
    <label className="text-xs font-medium text-muted-foreground">Condition</label>
    <input
      className="w-full mt-1 px-2 py-1.5 text-xs rounded-md border border-input bg-background font-mono"
      placeholder="value > 10"
    />
  </BaseNodeWithBody>
);

export default FilterNode;
