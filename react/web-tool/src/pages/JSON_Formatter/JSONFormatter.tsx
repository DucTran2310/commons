'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/context/ThemeContext';
import JSONNode from '@/pages/JSON_Formatter/components/JSONNode';
import {
  AlertCircle,
  Check,
  ClipboardCopy,
  Download,
  Expand,
  History,
  Shrink
} from 'lucide-react';
import * as LZString from 'lz-string';
import React, { useEffect, useState } from 'react';

export default function JSONFormatter() {
  const [input, setInput] = useState('');
  const [outputObj, setOutputObj] = useState<any>(null);
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [copied, setCopied] = useState(false);
  const [valid, setValid] = useState(true);
  const [error, setError] = useState<{ message: string; position?: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allExpanded, setAllExpanded] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const { theme } = useTheme();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const compressedJson = params.get('json');
    if (compressedJson) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(compressedJson);
        if (decompressed) setInput(decompressed);
      } catch (e) {
        console.error('Error decompressing URL data', e);
      }
    }

    const savedHistory = localStorage.getItem('jsonFormatterHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (input.length > 50000) {
      setIsProcessing(true);
      const timer = setTimeout(processJSON, 300);
      return () => clearTimeout(timer);
    } else {
      processJSON();
    }
  }, [input, sortKeys]);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('jsonFormatterHistory', JSON.stringify(history));
    }
  }, [history]);

  const processJSON = () => {
    try {
      if (!input.trim()) {
        setOutputObj(null);
        setValid(true);
        setError(null);
        setIsProcessing(false);
        return;
      }

      const parsed = JSON.parse(input);
      const sorted = sortKeys ? sortObject(parsed) : parsed;
      setOutputObj(sorted);
      setValid(true);
      setError(null);

      setHistory(prev => {
        const newHistory = [...prev];
        if (!newHistory.includes(input)) {
          newHistory.push(input);
          if (newHistory.length > 10) newHistory.shift();
        }
        return newHistory;
      });
    } catch (e) {
      setOutputObj(null);
      setValid(false);
      setIsProcessing(false);

      if (e instanceof SyntaxError) {
        const match = e.message.match(/at position (\d+)/);
        setError({ message: e.message, position: match ? parseInt(match[1]) : undefined });
      } else {
        setError({ message: 'Invalid JSON' });
      }
    } finally {
      setIsProcessing(false);
    }
  };

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
    if (!outputObj) return;
    const jsonString = JSON.stringify(outputObj, null, indent);
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    if (!outputObj) return;
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

  const loadFromHistory = (json: string) => {
    setInput(json);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('jsonFormatterHistory');
  };

  const handleInputScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const lineNumbers = document.getElementById('line-numbers');
    if (lineNumbers) {
      lineNumbers.scrollTop = target.scrollTop;
    }
  };

  const generateLineNumbers = (text: string) => {
    const lines = text.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
      <div className="flex flex-col items-center gap-6 max-w-full px-4 py-6">
        <h1 className="text-2xl font-bold text-center">🛠 JSON Formatter Tool</h1>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search in JSON..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button variant="outline" onClick={() => setAllExpanded(!allExpanded)}>
            {allExpanded ? <Shrink size={16} /> : <Expand size={16} />}
            {allExpanded ? 'Collapse All' : 'Expand All'}
          </Button>

          <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
            <History size={16} />
            History
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4">
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

          <Button onClick={handleCopy} variant="outline" disabled={!outputObj}>
            {copied ? <Check size={16} /> : <ClipboardCopy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>

          <Button onClick={handleDownload} variant="outline" disabled={!outputObj}>
            <Download size={16} />
            Download
          </Button>

        </div>

        {showHistory && (
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
                    <div className="truncate text-sm">{item.substring(0, 50)}{item.length > 50 ? '...' : ''}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No history yet</div>
              )}
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-2 text-sm text-gray-500">Processing large JSON...</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl">
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
                className={`font-mono pl-10 text-black dark:text-white bg-gray-100 dark:bg-gray-800 ${!valid && input ? 'border-red-500' : ''}`}
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

          <div className="mr-4">
            <label className="block font-semibold mb-1">Live JSON Tree View:</label>
            <div className="p-4 rounded overflow-auto font-mono text-sm whitespace-pre-wrap border bg-gray-100 dark:bg-gray-800">
              {valid ? (
                outputObj ? (
                  <JSONNode
                    data={outputObj}
                    searchTerm={searchTerm}
                    allExpanded={allExpanded}
                    theme={theme}
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
        </div>
      </div>
    </div>
  );
}