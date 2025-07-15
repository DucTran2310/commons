import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { ClipboardCopy, Check, Download, ChevronDown, ChevronRight } from 'lucide-react';

interface JSONNodeProps {
  data: any;
  name?: string;
  level?: number;
}

const JSONNode: React.FC<JSONNodeProps> = ({ data, name, level = 0 }) => {
  const [expanded, setExpanded] = useState(true);

  const toggle = () => setExpanded(!expanded);

  const isObject = typeof data === 'object' && data !== null;

  return (
    <div className={`ml-${level * 4} mb-1 h-full`}> 
      {name !== undefined && (
        <span className="text-blue-400">"{name}"</span>
      )}
      {isObject ? (
        <>
          {name !== undefined && <span>: </span>}
          <button
            onClick={toggle}
            className="text-blue-400 hover:underline focus:outline-none"
          >
            {Array.isArray(data) ? (expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : (expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
            {Array.isArray(data) ? '[...]' : '{...}'}
          </button>
          {expanded && (
            <div className="ml-4">
              {Array.isArray(data)
                ? data.map((item, idx) => (
                    <JSONNode key={idx} data={item} name={idx.toString()} level={level + 1} />
                  ))
                : Object.entries(data).map(([key, val]) => (
                    <JSONNode key={key} data={val} name={key} level={level + 1} />
                  ))}
            </div>
          )}
        </>
      ) : (
        <>
          {name !== undefined && <span>: </span>}
          <span className={
            typeof data === 'string'
              ? 'text-green-500'
              : typeof data === 'number'
              ? 'text-red-400'
              : typeof data === 'boolean'
              ? 'text-purple-400'
              : data === null
              ? 'text-pink-400'
              : ''
          }>
            {typeof data === 'string' ? `"${data}"` : String(data)}
          </span>
        </>
      )}
    </div>
  );
};

export default function JSONFormatter() {
  const [input, setInput] = useState('');
  const [outputObj, setOutputObj] = useState<any>(null);
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [copied, setCopied] = useState(false);
  const [valid, setValid] = useState(true);

  useEffect(() => {
    try {
      const parsed = JSON.parse(input);
      const sorted = sortKeys ? sortObject(parsed) : parsed;
      setOutputObj(sorted);
      setValid(true);
    } catch (e) {
      setOutputObj(null);
      setValid(false);
    }
  }, [input, indent, sortKeys]);

  const sortObject = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(sortObject);
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((acc: any, key) => {
          acc[key] = sortObject(obj[key]);
          return acc;
        }, {});
    }
    return obj;
  };

  const handleCopy = async () => {
    const jsonString = JSON.stringify(outputObj, null, indent);
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const jsonString = JSON.stringify(outputObj, null, indent);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl grid mx-auto p-6 text-gray-900 dark:text-white bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-center">🛠 JSON Formatter Tool</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Input JSON:</label>
          <Textarea
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Live JSON Tree View:</label>
          <div className="p-4 rounded bg-gray-100 dark:bg-gray-800 h-[600px] overflow-auto font-mono text-sm whitespace-pre-wrap">
            {valid ? (
              <JSONNode data={outputObj} />
            ) : (
              <span className="text-red-500">❌ Invalid JSON</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-10">
        <div className="flex items-center gap-2">
          <label className="font-medium">Sort Keys</label>
          <Switch checked={sortKeys} onCheckedChange={setSortKeys} />
        </div>

        <div className="flex items-center gap-2">
          <label className="font-medium">Indent Size</label>
          <Input
            type="number"
            min={0}
            max={10}
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="w-16"
          />
        </div>

        <Button onClick={handleCopy} variant="outline" className="flex gap-2 items-center">
          {copied ? <Check size={16} /> : <ClipboardCopy size={16} />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>

        <Button onClick={handleDownload} variant="outline" className="flex gap-2 items-center">
          <Download size={16} />
          Download
        </Button>
      </div>
    </div>
  );
}