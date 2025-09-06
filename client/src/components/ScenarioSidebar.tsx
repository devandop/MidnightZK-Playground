import React, { useState } from 'react';
import { scenarios } from '../data/scenarios';
import { Scenario } from '../types/circuit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RotateCcw, Settings } from 'lucide-react';

interface ScenarioSidebarProps {
  activeScenario: Scenario;
  onScenarioChange: (scenario: Scenario) => void;
  onGenerateProof: (inputs: Record<string, string>) => void;
  onReset: () => void;
  proofStatus: 'idle' | 'generating' | 'completed' | 'error';
  hasGeneratedProof: boolean;
}

const componentTypes = [
  { type: 'input', label: 'Input', icon: '→', color: 'text-primary' },
  { type: 'hash', label: 'Hash', icon: '#', color: 'text-accent' },
  { type: 'verify', label: 'Verify', icon: '✓', color: 'text-green-500' },
  { type: 'commit', label: 'Commit', icon: '🔒', color: 'text-yellow-500' },
  { type: 'nullifier', label: 'Nullifier', icon: '⛔', color: 'text-red-500' },
  { type: 'output', label: 'Output', icon: '←', color: 'text-primary' }
];

export const ScenarioSidebar: React.FC<ScenarioSidebarProps> = ({
  activeScenario,
  onScenarioChange,
  onGenerateProof,
  onReset,
  proofStatus,
  hasGeneratedProof
}) => {
  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const initialInputs: Record<string, string> = {};
    activeScenario.inputs.forEach(input => {
      initialInputs[input.key] = input.defaultValue || '';
    });
    return initialInputs;
  });

  // Update inputs when scenario changes
  React.useEffect(() => {
    const newInputs: Record<string, string> = {};
    activeScenario.inputs.forEach(input => {
      newInputs[input.key] = input.defaultValue || '';
    });
    setInputs(newInputs);
  }, [activeScenario]);

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerateProof = () => {
    onGenerateProof(inputs);
  };

  return (
    <aside className="w-80 border-r border-border bg-card/30 flex flex-col" data-testid="scenario-sidebar">
      {/* Demo Scenarios */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
          Demo Scenarios
        </h3>
        <div className="space-y-2" data-testid="scenario-list">
          {scenarios.map((scenario) => (
            <Button
              key={scenario.id}
              variant={activeScenario.id === scenario.id ? "default" : "ghost"}
              className="w-full justify-start p-3 h-auto"
              onClick={() => onScenarioChange(scenario)}
              data-testid={`button-scenario-${scenario.id}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="text-left">
                  <div className="font-medium">{scenario.name}</div>
                  <div className="text-xs opacity-80">{scenario.description}</div>
                </div>
                <i className={scenario.icon}></i>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Circuit Components */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
          Circuit Components
        </h3>
        <div className="grid grid-cols-2 gap-2" data-testid="component-grid">
          {componentTypes.map((component) => (
            <Card
              key={component.type}
              className="p-3 cursor-grab hover:scale-105 transition-transform border border-border bg-secondary"
              draggable
              data-testid={`component-${component.type}`}
            >
              <CardContent className="p-0">
                <div className="text-center">
                  <div className={`text-lg mb-1 ${component.color}`}>
                    {component.icon}
                  </div>
                  <div className="text-xs font-medium">{component.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Demo Controls */}
      <div className="p-4 flex-1">
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
          Demo Controls
        </h3>
        <div className="space-y-3" data-testid="demo-controls">
          {activeScenario.inputs.map((input) => (
            <div key={input.key}>
              <Label htmlFor={input.key} className="text-sm font-medium mb-2 block">
                {input.label}
              </Label>
              {input.type === 'select' ? (
                <Select
                  value={inputs[input.key]}
                  onValueChange={(value) => handleInputChange(input.key, value)}
                  data-testid={`select-${input.key}`}
                >
                  <SelectTrigger className={`w-full ${input.isPrivate ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {input.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="relative">
                  <Input
                    id={input.key}
                    type={input.isPrivate && input.type === 'text' ? 'password' : input.type}
                    value={inputs[input.key]}
                    onChange={(e) => handleInputChange(input.key, e.target.value)}
                    className={`w-full text-sm font-mono ${input.isPrivate ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300' : ''}`}
                    data-testid={`input-${input.key}`}
                    placeholder={input.isPrivate ? 'Private data - encrypted' : ''}
                  />
                  {input.isPrivate && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <span className="text-xs text-red-500 font-bold">🔒</span>
                    </div>
                  )}
                </div>
              )}
              {input.isPrivate && (
                <div className="text-xs text-red-500 mt-1 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  This data remains encrypted and hidden during proof generation
                </div>
              )}
            </div>
          ))}
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Button
              onClick={handleGenerateProof}
              disabled={proofStatus === 'generating'}
              className="w-full font-medium"
              variant={hasGeneratedProof ? "secondary" : "default"}
              data-testid="button-generate-proof"
            >
              {proofStatus === 'generating' ? (
                <>
                  <Settings className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : hasGeneratedProof ? (
                <>
                  <Settings className="mr-2 h-4 w-4" />
                  Regenerate Proof
                </>
              ) : (
                <>
                  <Settings className="mr-2 h-4 w-4" />
                  Generate ZK Proof
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onReset}
              className="w-full"
              data-testid="button-reset"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Circuit
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};
