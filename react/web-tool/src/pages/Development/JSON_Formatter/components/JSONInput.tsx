import { Textarea } from '@/components/ui/textarea';
import type { JSONInputProps } from '@/types/json-formatter.types';
import { AlertCircle } from 'lucide-react';
import React from 'react';

export const JSONInput: React.FC<JSONInputProps> = ({
  input,
  setInput,
  valid,
  handleInputScroll,
  error,
}) => {
  const generateLineNumbers = (text: string) => {
    const lines = text.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  };

  return (
    <div className="ml-4">
      <label className="block font-semibold mb-1">Input JSON:</label>
      <div className="relative">
        <div
          id="line-numbers"
          className="absolute left-0 top-0 bottom-0 w-[24px] p-1 overflow-hidden font-mono text-xs text-right text-gray-400 bg-gray-100 dark:bg-gray-800 border-t border-b border-l rounded-s"
        >
          {generateLineNumbers(input)}
        </div>
        <Textarea
          rows={12}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onScroll={handleInputScroll}
          placeholder="Paste your JSON here..."
          className={`font-mono pl-10 text-black dark:text-white bg-white dark:bg-gray-800 ${!valid && input ? 'border-red-500' : ''}`}
          style={{ whiteSpace: 'pre' }}
        />
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-500 flex items-start">
          <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
          <div>
            {error.message}
            {error.position !== undefined && (
              <span> (position: {error.position})</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};