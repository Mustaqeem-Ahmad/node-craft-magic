import { useState } from 'react';
import { Node, Edge } from 'reactflow';
import { Play, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  nodes: Node[];
  edges: Edge[];
}

/**
 * DAG check using DFS cycle detection.
 * Builds adjacency list from edges, then runs DFS looking for back-edges.
 */
const checkDAG = (nodes: Node[], edges: Edge[]): boolean => {
  const adj = new Map<string, string[]>();
  nodes.forEach((n) => adj.set(n.id, []));
  edges.forEach((e) => {
    const list = adj.get(e.source);
    if (list) list.push(e.target);
  });

  // 0 = unvisited, 1 = in-stack, 2 = done
  const state = new Map<string, number>();
  nodes.forEach((n) => state.set(n.id, 0));

  const hasCycle = (nodeId: string): boolean => {
    state.set(nodeId, 1);
    for (const neighbor of adj.get(nodeId) || []) {
      if (state.get(neighbor) === 1) return true; // back edge = cycle
      if (state.get(neighbor) === 0 && hasCycle(neighbor)) return true;
    }
    state.set(nodeId, 2);
    return false;
  };

  for (const node of nodes) {
    if (state.get(node.id) === 0 && hasCycle(node.id)) return false;
  }
  return true;
};

/**
 * SubmitButton - Sends the pipeline to the backend for analysis.
 * Falls back to client-side DAG check if backend is unreachable.
 */
const SubmitButton = ({ nodes, edges }: SubmitButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      nodes: nodes.map((n) => ({ id: n.id, type: n.type, data: n.data })),
      edges: edges.map((e) => ({ source: e.source, target: e.target })),
    };

    try {
      // Try backend first
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        alert(
          `Pipeline Analysis\n\n` +
          `Nodes: ${data.num_nodes}\n` +
          `Edges: ${data.num_edges}\n` +
          `Is DAG: ${data.is_dag ? 'Yes ✓' : 'No ✗'}`
        );
      } else {
        throw new Error('Backend error');
      }
    } catch {
      // Fallback: client-side analysis
      const isDag = checkDAG(nodes, edges);
      alert(
        `Pipeline Analysis (client-side)\n\n` +
        `Nodes: ${nodes.length}\n` +
        `Edges: ${edges.length}\n` +
        `Is DAG: ${isDag ? 'Yes ✓' : 'No ✗'}`
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
