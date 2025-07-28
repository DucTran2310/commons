import type { JSONNodeProps } from '@/types/json-formatter.types';
import {
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

const JSONNode: React.FC<JSONNodeProps> = ({
  data,
  name,
  level = 0,
  searchTerm = '',
  allExpanded = true,
  theme = 'light'
}) => {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    setExpanded(allExpanded);
  }, [allExpanded]);

  const toggle = () => setExpanded(!expanded);
  const isObject = typeof data === 'object' && data !== null;

  const highlightMatch = (text: string) => {
    if (!searchTerm || typeof text !== 'string') return text;
    const parts = String(text).split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark
          key={i}
          className="bg-yellow-200 dark:bg-yellow-200 rounded px-1"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getValueColor = (value: any) => {
    const type = typeof value;
    if (value === null) return 'text-pink-400';
    if (type === 'string') return 'text-green-500';
    if (type === 'number') return 'text-red-400';
    if (type === 'boolean') return 'text-purple-400';
    return '';
  };

  return (
    <div style={{ marginLeft: level * 16 }} className="mb-1">
      {name !== undefined && (
        <span className="text-blue-400">"{highlightMatch(name)}"</span>
      )}
      {isObject ? (
        <>
          {name !== undefined && <span>: </span>}
          <button
            onClick={toggle}
            className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none inline-flex items-center"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {Array.isArray(data) ? '[...]' : '{...}'}
          </button>
          {expanded && (
            <div className="ml-4">
              {Array.isArray(data)
                ? data.map((item, idx) => (
                  <JSONNode
                    key={idx}
                    data={item}
                    name={idx.toString()}
                    level={level + 1}
                    searchTerm={searchTerm}
                    allExpanded={allExpanded}
                    theme={theme}
                  />
                ))
                : Object.entries(data).map(([key, val]) => (
                  <JSONNode
                    key={key}
                    data={val}
                    name={key}
                    level={level + 1}
                    searchTerm={searchTerm}
                    allExpanded={allExpanded}
                    theme={theme}
                  />
                ))}
            </div>
          )}
        </>
      ) : (
        <>
          {name !== undefined && <span>: </span>}
          <span className={getValueColor(data)}>
            {typeof data === 'string'
              ? `"${highlightMatch(data)}"`
              : highlightMatch(String(data))}
          </span>
        </>
      )}
    </div>
  );
};

export default JSONNode;
