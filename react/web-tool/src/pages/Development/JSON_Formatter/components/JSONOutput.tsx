import JSONNode from '@/pages/Development/JSON_Formatter/components/JSONNode';
import type { JSONOutputProps } from '@/types/json-formatter.types';
import { AlertCircle } from 'lucide-react';
import React from 'react';

export const JSONOutput: React.FC<JSONOutputProps> = ({
  valid,
  outputObj,
  searchTerm,
  allExpanded,
  theme,
}) => {
  return (
    <div className="mr-4">
      <label className="block font-semibold mb-1">Live JSON Tree View:</label>
      <div className="p-4 rounded overflow-auto font-mono text-sm whitespace-pre-wrap border bg-white dark:bg-gray-800">
        {valid ? (
          outputObj ? (
            <JSONNode
              data={outputObj}
              searchTerm={searchTerm}
              allExpanded={allExpanded}
               theme={theme as "light" | "dark"}
            />
          ) : (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              Enter JSON to see the formatted tree view
            </div>
          )
        ) : (
          <div className="text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            Invalid JSON
          </div>
        )}
      </div>
    </div>
  );
};