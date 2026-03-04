import { BaseNodeWithBody } from './BaseNode';
import { Brain } from 'lucide-react';

/**
 * LLMNode - Represents an LLM processing step.
 * Accepts system prompt, user prompt, and outputs response.
 */
const LLMNode = () => {
  return (
    <BaseNodeWithBody
      title="LLM"
      icon={<Brain size={14} />}
      accentColor="bg-node-llm"
      inputs={[
        { id: 'system' },
        { id: 'prompt' },
      ]}
      outputs={[{ id: 'response' }]}
    >
      <p className="text-xs text-muted-foreground">
        This node processes inputs using a large language model.
      </p>
      <label className="text-xs font-medium text-muted-foreground mt-2 block">Model</label>
      <select className="w-full mt-1 px-2 py-1.5 text-xs rounded-md border border-input bg-background">
        <option>GPT-4</option>
        <option>GPT-3.5</option>
        <option>Claude</option>
      </select>
    </BaseNodeWithBody>
  );
};

export default LLMNode;
