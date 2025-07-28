import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import React from 'react';

interface HistoryPanelProps {
  showHistory: boolean;
  history: string[];
  loadFromHistory: (json: string) => void;
  clearHistory: () => void;
  setShowHistory: (show: boolean) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  showHistory,
  history,
  loadFromHistory,
  clearHistory,
  setShowHistory,
}) => {
  if (!showHistory) return null;

  return (
    <div className="mb-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">History</h3>
        <Button variant="ghost" size="sm" onClick={clearHistory}>
          Clear
        </Button>
      </div>
      <div className="max-h-40 overflow-y-auto">
        {history.length > 0 ? (
          history.map((item, index) => (
            <div
              key={index}
              className="p-2 mb-1 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => loadFromHistory(item)}
            >
              <div className="truncate text-sm">
                {item.substring(0, 50)}{item.length > 50 ? '...' : ''}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">No history yet</div>
        )}
      </div>
    </div>
  );
};