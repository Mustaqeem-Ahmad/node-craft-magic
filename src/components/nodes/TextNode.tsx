import { useState, useCallback, useRef, useEffect, ChangeEvent } from 'react';
import { Handle, Position } from 'reactflow';
import { Type } from 'lucide-react';

// Pulls out unique variable names from {{ varName }} patterns
const extractVars = (text: string): string[] => {
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const found = new Set<string>();
  let match;
  while ((match = regex.exec(text)) !== null) {
    found.add(match[1]);
  }
  return Array.from(found);
};

const TextNode = ({ data }: { data: { text?: string } }) => {
  const [text, setText] = useState(data.text || '');
  const [vars, setVars] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea to fit content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setVars(extractVars(val));
  };

  // Evenly space handles along the left edge
  const handleOffset = (i: number, total: number) => {
    if (total === 1) return '50%';
    return `${(100 / (total + 1)) * (i + 1)}%`;
  };

  return (
    <div className="pipeline-node" style={{ minWidth: 240 }}>
      <div className="h-1 rounded-t-lg bg-node-text" />
      <div className="node-header">
        <span className="text-sm opacity-70"><Type size={14} /></span>
        <span>Text</span>
        {vars.length > 0 && (
          <span className="ml-auto text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
            {vars.length} var{vars.length > 1 ? 's' : ''}
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
        {vars.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {vars.map((v) => (
              <span key={v} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded font-mono">
                {`{{ ${v} }}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* One handle per detected variable */}
      {vars.map((v, i) => (
        <Handle
          key={`var-${v}`}
          type="target"
          position={Position.Left}
          id={v}
          style={{ top: handleOffset(i, vars.length) }}
        />
      ))}

      <Handle type="source" position={Position.Right} id="output" style={{ top: '50%' }} />
    </div>
  );
};

export default TextNode;
