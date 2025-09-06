import React, { useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { ScenarioSidebar } from '../components/ScenarioSidebar';
import { CircuitDesigner } from '../components/CircuitDesigner';
import { ProofGenerator } from '../components/ProofGenerator';
import { useProofGeneration } from '../hooks/useProofGeneration';
import { scenarios } from '../data/scenarios';
import { Scenario } from '../types/circuit';

export default function IDE() {
  const [activeScenario, setActiveScenario] = useState<Scenario>(scenarios[0]);
  const { status, steps, result, animatedNodes, animatedEdges, generateProof, reset } = useProofGeneration();

  const handleScenarioChange = useCallback((scenario: Scenario) => {
    setActiveScenario(scenario);
    reset(); // Reset proof state when changing scenarios
  }, [reset]);

  const handleGenerateProof = useCallback(async (inputs: Record<string, string>) => {
    await generateProof(activeScenario.id, inputs, activeScenario.proofSteps);
  }, [generateProof, activeScenario]);

  const hasGeneratedProof = status === 'completed' || status === 'error';

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="ide-page">
      <Header />
      
      <div className="flex min-h-[calc(100vh-73px)]">
        <ScenarioSidebar
          activeScenario={activeScenario}
          onScenarioChange={handleScenarioChange}
          onGenerateProof={handleGenerateProof}
          onReset={reset}
          proofStatus={status}
          hasGeneratedProof={hasGeneratedProof}
        />
        
        <main className="flex-1 flex flex-col" data-testid="main-content">
          <CircuitDesigner
            nodes={activeScenario.circuit.nodes}
            edges={activeScenario.circuit.edges}
            animatedNodes={animatedNodes}
            animatedEdges={animatedEdges}
          />
          
          <ProofGenerator
            steps={steps}
            status={status}
            result={result}
            code={activeScenario.code}
          />
        </main>
      </div>
    </div>
  );
}
