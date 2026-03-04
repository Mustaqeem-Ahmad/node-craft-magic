import { useState } from 'react';
import { Node, Edge } from 'reactflow';
import { Play, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  nodes: Node[];
  edges: Edge[];
}

// Basic DFS cycle detection to check if the graph is a DAG
const isDAG = (nodes: Node[], edges: Edge[]): boolean => {
  const adj = new Map<string, string[]>();
  nodes.forEach((n) => adj.set(n.id, []));
  edges.forEach((e) => adj.get(e.source)?.push(e.target));

  // 0 = unvisited, 1 = visiting (in current path), 2 = done
  const visited = new Map<string, number>();
  nodes.forEach((n) => visited.set(n.id, 0));

  const hasCycle = (id: string): boolean => {
    visited.set(id, 1);
    for (const next of adj.get(id) || []) {
      if (visited.get(next) === 1) return true; // back edge → cycle
      if (visited.get(next) === 0 && hasCycle(next)) return true;
    }
    visited.set(id, 2);
    return false;
  };

  return !nodes.some((n) => visited.get(n.id) === 0 && hasCycle(n.id));
};

const SubmitButton = ({ nodes, edges }: SubmitButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      nodes: nodes.map((n) => ({ id: n.id, type: n.type, data: n.data })),
      edges: edges.map((e) => ({ source: e.source, target: e.target })),
    };

    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Backend returned an error');

      const data = await res.json();
      alert(
        `Pipeline Analysis\n\nNodes: ${data.num_nodes}\nEdges: ${data.num_edges}\nIs DAG: ${data.is_dag ? 'Yes ✓' : 'No ✗'}`
      );
    } catch {
      // Backend not running — fall back to client-side check
      console.log('Backend unreachable, using client-side DAG check');
      const dag = isDAG(nodes, edges);
      alert(
        `Pipeline Analysis (client-side)\n\nNodes: ${nodes.length}\nEdges: ${edges.length}\nIs DAG: ${dag ? 'Yes ✓' : 'No ✗'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={loading}
      className="absolute bottom-6 right-6 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
      {loading ? 'Analyzing...' : 'Submit Pipeline'}
    </button>
  );
};

export default SubmitButton;
