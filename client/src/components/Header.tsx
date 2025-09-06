import React from 'react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Book } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3" data-testid="logo-section">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Moon className="text-primary-foreground text-sm" />
          </div>
          <div>
            <h1 className="font-semibold text-lg" data-testid="title">Midnight Networks IDE</h1>
            <p className="text-xs text-muted-foreground" data-testid="subtitle">ZK Circuit Playground</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4" data-testid="header-actions">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="transition-colors"
            data-testid="button-theme-toggle"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="default"
            size="sm"
            className="text-sm font-medium"
            onClick={() => window.open('https://docs.midnight.network/', '_blank')}
            data-testid="button-documentation"
          >
            <Book className="mr-2 h-4 w-4" />
            Documentation
          </Button>
        </div>
      </div>
    </header>
  );
};
