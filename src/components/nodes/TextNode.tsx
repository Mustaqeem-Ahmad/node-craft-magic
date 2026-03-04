import { useState, useCallback, useRef, useEffect, ChangeEvent } from 'react';
import { Handle, Position } from 'reactflow';
import { Type } from 'lucide-react';

/**
 * TextNode - Text input with dynamic variable detection.
 * 
 * Detects variables in {{ variableName }} format using regex.
 * Dynamically creates left-side input handles for each unique variable found.
 * Textarea auto-resizes based on content using scrollHeight.
 */
const TextNode = ({ data }: { data: { text?: string } }) => {
  const [text, setText] = useState(data.text || '');
  const [variables, setVariables] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Regex to detect {{ variableName }} patterns
  const extractVariables = useCallback((input: string): string[] => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const vars = new Set<string>();
    let match;
    while ((match = regex.exec(input)) !== null) {
      vars.add(match[1]);
    }
    return Array.from(vars);
  }, []);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  // Handle text changes and update variables
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setVariables(extractVariables(newText));
  };

  // Calculate handle positions for dynamic variable handles
  const getHandleOffset = (index: number, total: number) => {
    if (total === 1) return '50%';
    const spacing = 100 / (total + 1);
    return `${spacing * (index + 1)}%`;
  };

  return (
    <div className="pipeline-node" style={{ minWidth: 240 }}>
      <div className="h-1 rounded-t-lg bg-node-text" />
      <div className="node-header">
        <span className="text-sm opacity-70"><Type size={14} /></span>
        <span>Text</span>
        {variables.length > 0 && (
          <span className="ml-auto text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
            {variables.length} var{variables.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="node-body">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          placeholder="Enter text... Use {{ variable }} for dynamic inputs"
          className="w-full px-2 py-1.5 text-xs rounded-md border border-input bg-background resize-none min-h-[60px] font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          rows={3}
        />
        {variables.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {variables.map((v) => (
              <span key={v} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded font-mono">
                {`{{ ${v} }}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic input handles for each detected variable */}
      {variables.map((variable, i) => (
        <Handle
          key={`var-${variable}`}
          type="target"
          position={Position.Left}
          id={variable}
          style={{ top: getHandleOffset(i, variables.length) }}
        />
      ))}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ top: '50%' }}
      />
    </div>
  );
};

export default TextNode;
