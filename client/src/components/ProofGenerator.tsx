import React from 'react';
import { ProofStep, ProofStatus, ProofResult } from '../types/circuit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Copy, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProofGeneratorProps {
  steps: ProofStep[];
  status: ProofStatus;
  result: ProofResult | null;
  code: string;
}

export const ProofGenerator: React.FC<ProofGeneratorProps> = ({
  steps,
  status,
  result,
  code
}) => {
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'generating':
        return {
          text: 'Generating proof...',
          icon: <Clock className="w-2 h-2 animate-spin" />,
          color: 'text-yellow-500'
        };
      case 'completed':
        return {
          text: result?.error ? 'Proof failed' : 'Proof verified successfully',
          icon: result?.error ? <XCircle className="w-2 h-2" /> : <CheckCircle className="w-2 h-2" />,
          color: result?.error ? 'text-red-500' : 'text-green-500'
        };
      case 'error':
        return {
          text: 'Error: Double voting detected',
          icon: <XCircle className="w-2 h-2" />,
          color: 'text-red-500'
        };
      default:
        return {
          text: 'Ready to generate proof',
          icon: <div className="w-2 h-2 bg-muted rounded-full" />,
          color: 'text-muted-foreground'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="h-80 border-t border-border bg-card/30 flex" data-testid="proof-generator">
      {/* Proof Generation Panel */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold" data-testid="proof-title">ZK Proof Generation</h3>
          <div className="flex items-center space-x-2" data-testid="proof-status">
            <div className={cn("text-xs", statusInfo.color)}>{statusInfo.text}</div>
            <div className={statusInfo.color}>{statusInfo.icon}</div>
          </div>
        </div>
        
        <ScrollArea className="h-48" data-testid="proof-steps">
          <div className="space-y-2">
            {steps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Click "Generate ZK Proof" to start the proving process
              </div>
            ) : (
              steps.map((step, index) => (
                <Card
                  key={step.id}
                  className={cn(
                    "p-3 border transition-all duration-300",
                    step.status === 'error' && "bg-red-500/10 border-red-500/20",
                    step.isSuccess && "bg-green-500/10 border-green-500/20"
                  )}
                  data-testid={`proof-step-${index}`}
                >
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-2">
                      <div className={cn(
                        step.status === 'error' ? 'text-red-500' :
                        step.isSuccess ? 'text-green-500' : 'text-primary'
                      )}>
                        {step.status === 'error' ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <i className={step.icon}></i>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={cn(
                          "font-medium text-sm",
                          step.status === 'error' ? 'text-red-500' :
                          step.isSuccess ? 'text-green-500' : ''
                        )}>
                          {step.text}
                        </div>
                        {step.details && (
                          <div className={cn(
                            "text-xs mt-1",
                            step.status === 'error' ? 'text-red-400' : 'text-green-400'
                          )}>
                            {step.details}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <Separator orientation="vertical" />

      {/* Code Output */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold" data-testid="code-title">Midnight Compact Code</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyCode}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-copy-code"
          >
            <Copy className="mr-1 h-3 w-3" />
            Copy
          </Button>
        </div>
        
        <ScrollArea className="h-48" data-testid="code-output">
          <div className="bg-background rounded-lg p-3 h-full">
            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
              <code>{code}</code>
            </pre>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
