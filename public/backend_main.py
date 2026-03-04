# Backend - FastAPI Pipeline Parser
# 
# Save this as backend/main.py and run with:
#   pip install fastapi uvicorn
#   uvicorn main:app --reload
#
# This file is provided as reference code for the backend portion of the project.

"""
FastAPI backend for the Pipeline Builder.
Provides an endpoint to analyze pipeline graphs.

Endpoint: POST /pipelines/parse
- Counts nodes and edges
- Determines if the pipeline is a DAG using DFS cycle detection
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

app = FastAPI(title="Pipeline Parser API")

# Allow CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NodeData(BaseModel):
    """Represents a pipeline node"""
    id: str
    type: Optional[str] = None
    data: Optional[Dict[str, Any]] = None


class EdgeData(BaseModel):
    """Represents a connection between two nodes"""
    source: str
    target: str


class PipelineRequest(BaseModel):
    """Request body for pipeline parsing"""
    nodes: List[NodeData]
    edges: List[EdgeData]


class PipelineResponse(BaseModel):
    """Response with pipeline analysis results"""
    num_nodes: int
    num_edges: int
    is_dag: bool


def is_dag(nodes: List[NodeData], edges: List[EdgeData]) -> bool:
    """
    Check if the directed graph is a DAG using DFS cycle detection.
    
    Algorithm:
    1. Build adjacency list from edges
    2. Run DFS from each unvisited node
    3. Track node states: UNVISITED=0, IN_STACK=1, DONE=2
    4. If we encounter an IN_STACK node during DFS, a cycle exists
    
    Returns True if no cycles found (valid DAG), False otherwise.
    """
    # Build adjacency list
    adj: Dict[str, List[str]] = {node.id: [] for node in nodes}
    for edge in edges:
        if edge.source in adj:
            adj[edge.source].append(edge.target)

    # State tracking: 0=unvisited, 1=in current DFS stack, 2=completed
    UNVISITED, IN_STACK, DONE = 0, 1, 2
    state: Dict[str, int] = {node.id: UNVISITED for node in nodes}

    def has_cycle(node_id: str) -> bool:
        """DFS helper that returns True if a cycle is detected."""
        state[node_id] = IN_STACK
        
        for neighbor in adj.get(node_id, []):
            if state.get(neighbor) == IN_STACK:
                # Back edge found - cycle exists
                return True
            if state.get(neighbor) == UNVISITED and has_cycle(neighbor):
                return True
        
        state[node_id] = DONE
        return False

    # Check all components (graph may be disconnected)
    for node in nodes:
        if state[node.id] == UNVISITED:
            if has_cycle(node.id):
                return False  # Cycle detected, not a DAG

    return True  # No cycles found


@app.post("/pipelines/parse", response_model=PipelineResponse)
async def parse_pipeline(pipeline: PipelineRequest):
    """
    Parse a pipeline and return analysis results.
    
    Accepts nodes and edges, returns:
    - num_nodes: total number of nodes
    - num_edges: total number of edges  
    - is_dag: whether the graph is a Directed Acyclic Graph
    """
    return PipelineResponse(
        num_nodes=len(pipeline.nodes),
        num_edges=len(pipeline.edges),
        is_dag=is_dag(pipeline.nodes, pipeline.edges),
    )


# Health check endpoint
@app.get("/")
async def root():
    return {"status": "ok", "message": "Pipeline Parser API is running"}
