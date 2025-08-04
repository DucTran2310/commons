import type { HistoryItem, HistoryJsonProps } from '@/types/json-minifier.type';
import { formatBytes } from '@/utils/jsonMinifier';
import { ChevronDown, ChevronUp, History } from 'lucide-react';
import { useCallback, useState } from 'react';

const HistoryJson = ({history, setInputJson, setOutputJson }: HistoryJsonProps) => {

  const [showHistory, setShowHistory] = useState(false);

    const loadHistoryItem = useCallback((item: HistoryItem) => {
      setInputJson(item.input);
      setOutputJson(item.output);
      setShowHistory(false);
    }, []);

  return (
    <div className="bg-light-hoverBg dark:bg-dark-hoverBg p-4 rounded-lg">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowHistory(!showHistory)}>
        <h2 className="text-lg font-semibold text-light-text dark:text-dark-text flex items-center gap-2">
          <History className="h-5 w-5" /> History
        </h2>
        {showHistory ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {showHistory && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-sm text-light-sectionHeader dark:text-dark-sectionHeader">
              No history yet. Your minifications will appear here.
            </p>
          ) : (
            history.map(item => (
              <div
                key={item.id}
                className="p-3 rounded hover:bg-light-activeBg dark:hover:bg-dark-activeBg cursor-pointer"
                onClick={() => loadHistoryItem(item)}
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-light-text dark:text-dark-text">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-light-sectionHeader dark:text-dark-sectionHeader">
                    {formatBytes(new Blob([item.output]).size)}
                  </span>
                </div>
                <div className="text-xs text-light-sectionHeader dark:text-dark-sectionHeader truncate">
                  {item.output.substring(0, 100)}{item.output.length > 100 ? '...' : ''}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default HistoryJson