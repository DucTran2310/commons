import { useTheme } from '@/context/ThemeContext';
import { HistoryPanel } from '@/pages/Development/JSON_Formatter/components/HistoryPanel';
import { JSONInput } from '@/pages/Development/JSON_Formatter/components/JSONInput';
import { JSONOutput } from '@/pages/Development/JSON_Formatter/components/JSONOutput';
import { Toolbar } from '@/pages/Development/JSON_Formatter/components/Toolbar';
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

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
      <div className="flex flex-col items-center gap-6 max-w-full px-4 py-6">
        <h1 className="text-2xl font-bold text-center">🛠 JSON Formatter Tool</h1>

        <Toolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          allExpanded={allExpanded}
          setAllExpanded={setAllExpanded}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          sortKeys={sortKeys}
          setSortKeys={setSortKeys}
          indent={indent}
          setIndent={setIndent}
          outputObj={outputObj}
          copied={copied}
          handleCopy={handleCopy}
          handleDownload={handleDownload}
        />

        <HistoryPanel
          showHistory={showHistory}
          history={history}
          loadFromHistory={loadFromHistory}
          clearHistory={clearHistory}
          setShowHistory={setShowHistory}
        />

        {isProcessing && (
          <div className="text-center py-2 text-sm text-gray-500">Processing large JSON...</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl">
          <JSONInput
            input={input}
            setInput={setInput}
            valid={valid}
            handleInputScroll={handleInputScroll}
            error={error}
          />

          <JSONOutput
            valid={valid}
            outputObj={outputObj}
            searchTerm={searchTerm}
            allExpanded={allExpanded}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}