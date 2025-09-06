import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CircuitNode as CircuitNodeType, CircuitEdge } from '../types/circuit';
import { Card, CardContent } from '@/components/ui/card';

interface CircuitNodeProps {
  data: {
    label: string;
    icon: string;
    description?: string;
    color: string;
    isPrivate?: boolean;
    isAnimated?: boolean;
  };
}

const CircuitNode: React.FC<CircuitNodeProps> = ({ data }) => {
  return (
    <Card className={`circuit-node min-w-[120px] border-2 shadow-lg transition-all duration-300 ${data.isAnimated ? 'animate-pulse ring-2 ring-primary/50' : ''}`} 
          style={{ borderColor: data.color }}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 !bg-primary border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 !bg-primary border-2 border-background"
      />
      
      <CardContent className="p-3 text-center">
        <div className="text-2xl mb-2 relative" style={{ color: data.color }}>
          <i className={data.icon}></i>
          {data.isPrivate && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">P</span>
            </div>
          )}
        </div>
        <div className="font-medium text-sm">{data.label}</div>
        {data.description && (
          <div className="text-xs text-muted-foreground mt-1">{data.description}</div>
        )}
        {data.isPrivate && (
          <div className="text-[10px] text-red-500 font-medium mt-1">Private Input</div>
        )}
      </CardContent>
    </Card>
  );
};

// Define nodeTypes outside component to prevent recreation
const nodeTypes = {
  input: CircuitNode,
  hash: CircuitNode,
  verify: CircuitNode,
  commit: CircuitNode,
  nullifier: CircuitNode,
  output: CircuitNode,
};

interface CircuitDesignerProps {
  nodes: CircuitNodeType[];
  edges: CircuitEdge[];
  onNodesChange?: (nodes: CircuitNodeType[]) => void;
  onEdgesChange?: (edges: CircuitEdge[]) => void;
  animatedNodes?: string[];
  animatedEdges?: string[];
}

export const CircuitDesigner: React.FC<CircuitDesignerProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange,
  onEdgesChange,
  animatedNodes = [],
  animatedEdges = []
}) => {
  // Process nodes with animation state
  const processedNodes = React.useMemo(() => {
    return initialNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        isAnimated: animatedNodes.includes(node.id)
      }
    }));
  }, [initialNodes, animatedNodes]);

  // Process edges with animation state
  const processedEdges = React.useMemo(() => {
    return initialEdges.map(edge => ({
      ...edge,
      animated: animatedEdges.includes(edge.id) || edge.animated,
      style: {
        ...edge.style,
        strokeWidth: animatedEdges.includes(edge.id) ? 3 : 2,
        stroke: animatedEdges.includes(edge.id) ? '#10B981' : (edge.style?.stroke || '#3B82F6')
      }
    }));
  }, [initialEdges, animatedEdges]);

  const [nodes, setNodes, onNodesUpdate] = useNodesState(processedNodes as Node[]);
  const [edges, setEdges, onEdgesUpdate] = useEdgesState(processedEdges as Edge[]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        animated: true,
        style: { stroke: '#3B82F6', strokeWidth: 2 }
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Update parent when nodes or edges change
  React.useEffect(() => {
    if (onNodesChange) {
      onNodesChange(nodes as CircuitNodeType[]);
    }
  }, [nodes, onNodesChange]);

  React.useEffect(() => {
    if (onEdgesChange) {
      onEdgesChange(edges as CircuitEdge[]);
    }
  }, [edges, onEdgesChange]);

  // Update local state when processed nodes/edges change
  React.useEffect(() => {
    setNodes(processedNodes as Node[]);
  }, [processedNodes, setNodes]);

  React.useEffect(() => {
    setEdges(processedEdges as Edge[]);
  }, [processedEdges, setEdges]);

  return (
    <div className="flex-1 relative" data-testid="circuit-designer">
      <div className="h-full bg-background">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesUpdate}
          onEdgesChange={onEdgesUpdate}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="circuit-canvas"
          data-testid="react-flow-canvas"
        >
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              const nodeData = node.data as any;
              return nodeData?.color || '#3B82F6';
            }}
          />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        </ReactFlow>
      </div>
      
      {/* Privacy & ZK Information */}
      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm p-4 rounded-lg border border-border max-w-sm" data-testid="circuit-instructions">
        <h4 className="font-semibold text-sm mb-2 flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          Zero-Knowledge Privacy
        </h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>
            <strong className="text-red-500">Private inputs</strong> (marked with 🔴) remain completely hidden 
            during computation while still proving their validity.
          </p>
          <p>
            The circuit processes sensitive data through cryptographic primitives, 
            ensuring <strong>privacy</strong> and <strong>verifiability</strong> without revealing secrets.
          </p>
          <div className="mt-3 p-2 bg-accent/10 rounded border border-accent/20">
            <div className="text-xs font-medium text-accent mb-1">Midnight Networks Benefits:</div>
            <ul className="text-[10px] space-y-1">
              <li>• Confidential smart contracts</li>
              <li>• Private data protection</li>
              <li>• Regulatory compliance</li>
              <li>• Zero-knowledge proofs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
