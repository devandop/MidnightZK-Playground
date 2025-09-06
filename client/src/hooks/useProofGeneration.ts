import { useState, useCallback } from 'react';
import { ProofStep, ProofStatus, ProofResult } from '../types/circuit';

interface UseProofGenerationReturn {
  status: ProofStatus;
  steps: ProofStep[];
  result: ProofResult | null;
  hasVotedBefore: boolean;
  animatedNodes: string[];
  animatedEdges: string[];
  generateProof: (scenario: string, inputs: Record<string, string>, proofSteps: ProofStep[]) => Promise<void>;
  reset: () => void;
}

export const useProofGeneration = (): UseProofGenerationReturn => {
  const [status, setStatus] = useState<ProofStatus>('idle');
  const [steps, setSteps] = useState<ProofStep[]>([]);
  const [result, setResult] = useState<ProofResult | null>(null);
  const [usedNullifiers, setUsedNullifiers] = useState<Map<string, Set<string>>>(new Map());
  const [animatedNodes, setAnimatedNodes] = useState<string[]>([]);
  const [animatedEdges, setAnimatedEdges] = useState<string[]>([]);

  const generateProof = useCallback(async (
    scenario: string,
    inputs: Record<string, string>,
    proofSteps: ProofStep[]
  ) => {
    // Generate nullifier based on scenario and check for double submission
    const nullifierCheck = (scenario: string, inputs: Record<string, string>) => {
      let nullifier = '';
      let errorMessage = '';
      
      switch (scenario) {
        case 'voting':
          // Nullifier combines voter ID and private credentials to prevent double voting
          nullifier = `voting_${inputs.voter_id}_${inputs.private_credentials}`;
          errorMessage = 'This voter ID has already cast a vote. Double voting is not allowed.';
          break;
        case 'auction':
          // Nullifier combines bidder identity to prevent multiple bids from same party
          nullifier = `auction_${inputs.bidder_secret}_${inputs.private_bidder_identity || inputs.bidder_secret}`;
          errorMessage = 'This bidder has already submitted a bid. Multiple bids from same party not allowed.';
          break;
        case 'identity':
          // Nullifier based on SSN to prevent multiple verifications of same identity
          nullifier = `identity_${inputs.private_ssn}_${inputs.birth_cert_hash}`;
          errorMessage = 'This identity has already been verified. Duplicate verification attempts are blocked.';
          break;
        default:
          return null;
      }
      
      return { nullifier, errorMessage };
    };

    const nullifierData = nullifierCheck(scenario, inputs);
    
    if (nullifierData) {
      const scenarioNullifiers = usedNullifiers.get(scenario) || new Set();
      
      if (scenarioNullifiers.has(nullifierData.nullifier)) {
        setStatus('error');
        setSteps([{
          id: 'error-1',
          text: 'Nullifier Constraint Violation',
          icon: 'fas fa-exclamation-triangle',
          status: 'error',
          details: nullifierData.errorMessage
        }]);
        setResult({
          verified: false,
          timestamp: Date.now(),
          error: 'Duplicate submission detected'
        });
        return;
      }
    }

    setStatus('generating');
    setSteps([]);
    setResult(null);
    setAnimatedNodes([]);
    setAnimatedEdges([]);

    // Define circuit animation sequence based on scenario
    const getAnimationSequence = (scenario: string) => {
      switch (scenario) {
        case 'voting':
          return [
            { nodes: ['input-1'], edges: [], delay: 500 },
            { nodes: ['input-1', 'hash-1'], edges: ['e1-2'], delay: 1000 },
            { nodes: ['input-1', 'nullifier-1'], edges: ['e1-3'], delay: 1500 },
            { nodes: ['hash-1', 'verify-1'], edges: ['e2-4'], delay: 2000 },
            { nodes: ['nullifier-1', 'verify-1'], edges: ['e3-4'], delay: 2500 },
            { nodes: ['verify-1'], edges: [], delay: 3000 }
          ];
        case 'auction':
          return [
            { nodes: ['bid-input'], edges: [], delay: 500 },
            { nodes: ['bid-input', 'commit-1'], edges: ['e1-2'], delay: 1000 },
            { nodes: ['bid-input', 'range-proof'], edges: ['e1-3'], delay: 1500 },
            { nodes: ['commit-1', 'reveal'], edges: ['e2-4'], delay: 2000 },
            { nodes: ['range-proof', 'reveal'], edges: ['e3-4'], delay: 2500 },
            { nodes: ['reveal'], edges: [], delay: 3000 }
          ];
        case 'identity':
          return [
            { nodes: ['identity-input'], edges: [], delay: 500 },
            { nodes: ['identity-input', 'merkle-proof'], edges: ['e1-2'], delay: 1000 },
            { nodes: ['identity-input', 'age-check'], edges: ['e1-3'], delay: 1500 },
            { nodes: ['merkle-proof', 'anon-output'], edges: ['e2-4'], delay: 2000 },
            { nodes: ['age-check', 'anon-output'], edges: ['e3-4'], delay: 2500 },
            { nodes: ['anon-output'], edges: [], delay: 3000 }
          ];
        default:
          return [];
      }
    };

    const animationSequence = getAnimationSequence(scenario);

    // Execute proof steps with delays and circuit animations
    for (let i = 0; i < proofSteps.length; i++) {
      const step = proofSteps[i];
      
      // Wait for the step delay
      await new Promise(resolve => setTimeout(resolve, step.delay || 500));
      
      // Update circuit animation if available
      if (animationSequence[i]) {
        setAnimatedNodes(animationSequence[i].nodes);
        setAnimatedEdges(animationSequence[i].edges);
      }
      
      setSteps(prev => [
        ...prev,
        {
          ...step,
          status: step.isSuccess ? 'completed' : 'running'
        }
      ]);

      // If it's the last step, mark as completed and set result
      if (i === proofSteps.length - 1) {
        setTimeout(() => {
          setStatus('completed');
          
          // Generate mock proof hash
          const hash = `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`;
          
          setResult({
            hash,
            verified: true,
            timestamp: Date.now()
          });

          // Add nullifier to prevent duplicate submissions
          if (nullifierData) {
            setUsedNullifiers(prev => {
              const newMap = new Map(prev);
              const scenarioNullifiers = newMap.get(scenario) || new Set();
              scenarioNullifiers.add(nullifierData.nullifier);
              newMap.set(scenario, scenarioNullifiers);
              return newMap;
            });
          }

          // Clear animations
          setAnimatedNodes([]);
          setAnimatedEdges([]);
        }, 200);
      }
    }
  }, [usedNullifiers]);

  const reset = useCallback(() => {
    setStatus('idle');
    setSteps([]);
    setResult(null);
    setUsedNullifiers(new Map()); // Reset all nullifiers for demo purposes
    setAnimatedNodes([]);
    setAnimatedEdges([]);
  }, []);

  return {
    status,
    steps,
    result,
    hasVotedBefore: status === 'error' && result?.error === 'Duplicate submission detected',
    animatedNodes,
    animatedEdges,
    generateProof,
    reset
  };
};
