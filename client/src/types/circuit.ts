export interface CircuitNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    icon: string;
    description?: string;
    color: string;
    isPrivate?: boolean;
    isAnimated?: boolean;
  };
}

export interface CircuitEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: Record<string, any>;
}

export interface ProofStep {
  id: string;
  text: string;
  icon: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  delay?: number;
  isSuccess?: boolean;
  details?: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  circuit: {
    nodes: CircuitNode[];
    edges: CircuitEdge[];
  };
  proofSteps: ProofStep[];
  code: string;
  inputs: Array<{
    label: string;
    key: string;
    type: 'text' | 'select' | 'number';
    options?: string[];
    defaultValue: string;
    isPrivate?: boolean;
  }>;
}

export type ProofStatus = 'idle' | 'generating' | 'completed' | 'error';

export interface ProofResult {
  hash?: string;
  verified: boolean;
  timestamp: number;
  error?: string;
}
