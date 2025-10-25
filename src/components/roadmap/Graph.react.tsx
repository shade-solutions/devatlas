/** @jsxImportSource react */
import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Types from our content system
interface RoadmapNode {
  id: string;
  title: string;
  level: 'B' | 'I' | 'A';
  status: 'core' | 'optional' | 'good-to-know' | 'avoid';
  summary?: string;
  estimatedTime?: string;
  tags: string[];
  resources: string[];
  group?: string;
}

interface RoadmapEdge {
  id: string;
  from: string;
  to: string;
  type: 'requires' | 'optional' | 'related';
  label?: string;
}

interface GraphProps {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  layout?: any;
  selectedNodeId?: string;
  onNodeSelect?: (nodeId: string) => void;
  onToggleProgress?: (nodeId: string) => void;
  filters?: {
    showOptional?: boolean;
    showDone?: boolean;
    levels?: ('B' | 'I' | 'A')[];
  };
}

// Custom Node Component
const RoadmapNodeComponent = ({ data }: {
  data: {
    node: RoadmapNode;
    isSelected: boolean;
    onSelect: (nodeId: string) => void;
    onToggleProgress: (nodeId: string) => void;
  };
}) => {
  const { node, isSelected, onSelect, onToggleProgress } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'core': return 'bg-blue-500 border-blue-600';
      case 'optional': return 'bg-green-500 border-green-600';
      case 'good-to-know': return 'bg-yellow-500 border-yellow-600';
      case 'avoid': return 'bg-red-500 border-red-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getLevelBadge = (level: string) => {
    const baseClasses = 'absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center';
    switch (level) {
      case 'B': return `${baseClasses} bg-green-100 text-green-800 border-2 border-white`;
      case 'I': return `${baseClasses} bg-yellow-100 text-yellow-800 border-2 border-white`;
      case 'A': return `${baseClasses} bg-red-100 text-red-800 border-2 border-white`;
      default: return `${baseClasses} bg-gray-100 text-gray-800 border-2 border-white`;
    }
  };

  return (
    <div 
      className={`
      relative min-w-40 max-w-[200px] p-3 rounded-lg border-2 shadow-sm cursor-pointer transition-all
      ${getStatusColor(node.status)}
      ${isSelected ? 'ring-4 ring-blue-300 shadow-lg' : 'hover:shadow-md'}
      text-white
    `}
      onClick={() => onSelect(node.id)}
      onDoubleClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleProgress(node.id);
      }}
    >
      <div className={getLevelBadge(node.level)}>
        {node.level}
      </div>
      
      <div className="text-sm font-medium leading-tight mb-1">
        {node.title}
      </div>
      
      {node.estimatedTime && (
        <div className="text-xs opacity-80">
          {node.estimatedTime}
        </div>
      )}

      {/* Progress indicator - placeholder for now */}
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-2 border-gray-300 rounded-full">
        {/* This will be connected to progress state later */}
      </div>

      {/* Connection handles */}
      <Handle type="target" position={Position.Top} style={{ background: '#fff', border: '2px solid currentColor' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#fff', border: '2px solid currentColor' }} />
      <Handle type="target" position={Position.Left} style={{ background: '#fff', border: '2px solid currentColor' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#fff', border: '2px solid currentColor' }} />
    </div>
  );
};

// Custom Edge Component
const RoadmapEdgeComponent = ({ 
  id, 
  sourceX, 
  sourceY, 
  targetX, 
  targetY, 
  data 
}: {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  data?: { type?: string; label?: string };
}) => {
  const edgePath = `M${sourceX},${sourceY} L${targetX},${targetY}`;
  
  const getEdgeStyle = (type: string) => {
    switch (type) {
      case 'requires': return { stroke: '#374151', strokeWidth: 2 };
      case 'optional': return { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5,5' };
      case 'related': return { stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '2,2' };
      default: return { stroke: '#9ca3af', strokeWidth: 1 };
    }
  };

  return (
    <g>
      <path
        id={id}
        d={edgePath}
        fill="none"
        style={getEdgeStyle(data?.type || 'requires')}
      />
      {/* Arrow marker */}
      <polygon
        points={`${targetX-6},${targetY-3} ${targetX},${targetY} ${targetX-6},${targetY+3}`}
        fill={getEdgeStyle(data?.type || 'requires').stroke}
      />
    </g>
  );
};

// Node and Edge type definitions
const nodeTypes: NodeTypes = {
  roadmapNode: RoadmapNodeComponent,
};

const edgeTypes: EdgeTypes = {
  roadmapEdge: RoadmapEdgeComponent,
};

export default function RoadmapGraph({
  nodes: roadmapNodes,
  edges: roadmapEdges,
  layout,
  selectedNodeId,
  onNodeSelect,
  onToggleProgress,
  filters = {},
}: GraphProps) {
  // Safe callbacks with fallbacks
  const safeOnNodeSelect = useCallback((nodeId: string) => {
    if (typeof onNodeSelect === 'function') {
      onNodeSelect(nodeId);
    }
  }, [onNodeSelect]);

  const safeOnToggleProgress = useCallback((nodeId: string) => {
    if (typeof onToggleProgress === 'function') {
      onToggleProgress(nodeId);
    }
  }, [onToggleProgress]);

  // Convert roadmap data to React Flow format
  const initialNodes: Node[] = useMemo(() => {
    if (!roadmapNodes || !Array.isArray(roadmapNodes)) {
      return [];
    }
    
    return roadmapNodes.map((node) => {
      const position = layout?.breakpoints?.desktop?.nodes?.[node.id] || { x: Math.random() * 500, y: Math.random() * 500 };
      
      return {
        id: node.id,
        type: 'roadmapNode',
        position,
        data: {
          node,
          isSelected: selectedNodeId === node.id,
          onSelect: safeOnNodeSelect,
          onToggleProgress: safeOnToggleProgress,
        },
        draggable: true,
        selectable: true,
      };
    });
  }, [roadmapNodes, layout, selectedNodeId, safeOnNodeSelect, safeOnToggleProgress]);

  const initialEdges: Edge[] = useMemo(() => {
    if (!roadmapEdges || !Array.isArray(roadmapEdges)) {
      return [];
    }
    
    return roadmapEdges.map((edge) => ({
      id: edge.id,
      source: edge.from,
      target: edge.to,
      type: 'roadmapEdge',
      data: { type: edge.type, label: edge.label },
      animated: edge.type === 'requires',
      style: {
        strokeWidth: edge.type === 'requires' ? 2 : 1,
      },
    }));
  }, [roadmapEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when selection changes
  React.useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isSelected: selectedNodeId === node.id,
        },
      }))
    );
  }, [selectedNodeId, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Filter nodes based on current filters
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const roadmapNode = node.data.node as RoadmapNode;
      
      // Filter by optional status
      if (!filters.showOptional && roadmapNode.status === 'optional') {
        return false;
      }
      
      // Filter by level
      if (filters.levels && filters.levels.length > 0) {
        if (!filters.levels.includes(roadmapNode.level)) {
          return false;
        }
      }
      
      return true;
    });
  }, [nodes, filters]);

  // Safety check
  if (!nodes || nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No roadmap data</h3>
          <p className="text-gray-600">Unable to load the roadmap graph.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white">
      <ReactFlow
        nodes={filteredNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{
          padding: 0.1,
          includeHiddenNodes: false,
        }}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Controls 
          position="top-left"
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />
        <MiniMap
          position="bottom-right"
          nodeStrokeColor={(node: Node) => {
            const roadmapNode = node.data.node as RoadmapNode;
            switch (roadmapNode.status) {
              case 'core': return '#3b82f6';
              case 'optional': return '#10b981';
              case 'good-to-know': return '#f59e0b';
              case 'avoid': return '#ef4444';
              default: return '#6b7280';
            }
          }}
          nodeColor={(node: Node) => {
            const roadmapNode = node.data.node as RoadmapNode;
            switch (roadmapNode.status) {
              case 'core': return '#dbeafe';
              case 'optional': return '#d1fae5';
              case 'good-to-know': return '#fef3c7';
              case 'avoid': return '#fee2e2';
              default: return '#f3f4f6';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="#e5e7eb"
        />
      </ReactFlow>
    </div>
  );
}