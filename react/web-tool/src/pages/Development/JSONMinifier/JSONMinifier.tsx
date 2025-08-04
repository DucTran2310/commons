import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useDebounce from '@/hooks/useDebounce';
import HistoryJson from '@/pages/Development/JSONMinifier/components/HistoryJson';
import MinifiOptions from '@/pages/Development/JSONMinifier/components/MinifiOptions';
import type { HistoryItem } from '@/types/json-minifier.type';
import { formatBytes, parseJsonWithComments } from '@/utils/jsonMinifier';
import { Copy, Download } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function JSONMinifier() {
  const [inputJson, setInputJson] = useState('');
  const debouncedInputJson = useDebounce(inputJson, 500);
  const [outputJson, setOutputJson] = useState('');
  const [error, setError] = useState<{ message: string; line?: number } | null>(null);
  const [options, setOptions] = useState({
    removeWhitespace: true,
    removeLineBreaks: true,
    removeComments: true,
    prettyPrint: false,
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Parse JSON and handle errors with line detection
  const parseJson = useCallback((jsonString: string) => {
    try {
      // First try to parse as JSONC (with comments)
      const parsed = options.removeComments 
        ? parseJsonWithComments(jsonString)
        : JSON.parse(jsonString);
      setError(null);
      return parsed;
    } catch (err) {
      const error = err as Error;
      let line: number | undefined;
      
      // Extract line number from error message if available
      const lineMatch = error.message.match(/at position (\d+)/);
      if (lineMatch) {
        const position = parseInt(lineMatch[1]);
        const lines = jsonString.substring(0, position).split('\n');
        line = lines.length;
      }
      
      setError({ message: error.message, line });
      throw error;
    }
  }, [options.removeComments]);

  // Memoized processing of JSON
  const processedJson = useMemo(() => {
    if (!debouncedInputJson.trim()) {
      setError(null);
      return '';
    }

    try {
      const parsed = parseJson(debouncedInputJson);
      
      let result: string;
      if (options.prettyPrint) {
        result = JSON.stringify(parsed, null, 2);
      } else if (options.removeWhitespace || options.removeLineBreaks) {
        result = JSON.stringify(parsed);
      } else {
        result = JSON.stringify(parsed, null, 0);
      }

      // Add to history if different from last item
      setHistory(prev => {
        const lastItem = prev[0];
        if (!lastItem || lastItem.output !== result) {
          return [
            {
              id: Date.now().toString(),
              timestamp: Date.now(),
              input: debouncedInputJson,
              output: result,
            },
            ...prev.slice(0, 9), // Keep only last 10 items
          ];
        }
        return prev;
      });

      return result;
    } catch {
      return '';
    }
  }, [debouncedInputJson, options, parseJson]);

  useEffect(() => {
    setOutputJson(processedJson);
  }, [processedJson]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(outputJson);
  }, [outputJson]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([outputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [outputJson]);

  const handleClear = useCallback(() => {
    setInputJson('');
    setOutputJson('');
    setError(null);
  }, []);

  const handleSample = useCallback(() => {
    const sampleJson = `{
      // This is a comment
      "name": "John Doe",
      "age": 30,
      "isActive": true,
      "address": {
        "street": "123 Main St",
        "city": "Anytown"
      },
      "hobbies": ["reading", "hiking", "coding"]
    }`;
    setInputJson(sampleJson);
  }, []);

  const inputSize = useMemo(() => new Blob([inputJson]).size, [inputJson]);
  const outputSize = useMemo(() => new Blob([outputJson]).size, [outputJson]);
  const reductionPercent = useMemo(() => {
    if (!inputJson || !outputJson) return 0;
    return Math.round((1 - outputSize / inputSize) * 100);
  }, [inputJson, outputJson, inputSize, outputSize]);

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 bg-[#f3f4f6] dark:bg-dark-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
          JSON Minifier
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="input-json"
              className="text-light-text dark:text-dark-text"
            >
              Input JSON
            </Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSample}
                className="text-light-text dark:text-dark-text"
              >
                Sample
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="text-light-text dark:text-dark-text"
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="relative">
            <Textarea
              id="input-json"
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder="Paste your JSON here..."
              className={`min-h-[300px] font-mono text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background ${
                error ? "border-red-500" : ""
              }`}
            />
            {error && (
              <div className="absolute bottom-2 left-2 right-2 p-2 bg-red-500 text-white text-sm rounded">
                {error.message}
              </div>
            )}
          </div>
          {inputJson && (
            <div className="flex justify-between text-sm text-light-sectionHeader dark:text-dark-sectionHeader">
              <span>Lines: {inputJson.split("\n").length}</span>
              <span>Size: {formatBytes(inputSize)}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="output-json"
              className="text-light-text dark:text-dark-text"
            >
              Minified JSON
            </Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!outputJson}
                className="text-light-text dark:text-dark-text"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!outputJson}
                className="text-light-text dark:text-dark-text"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          <Textarea
            id="output-json"
            value={outputJson}
            readOnly
            placeholder="Minified JSON will appear here..."
            className="min-h-[300px] font-mono text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background"
          />
          {outputJson && (
            <div className="flex justify-between text-sm text-light-sectionHeader dark:text-dark-sectionHeader">
              <span>Lines: {outputJson.split("\n").length}</span>
              <span>
                Size: {formatBytes(outputSize)} ({reductionPercent}% reduction)
              </span>
            </div>
          )}
        </div>
      </div>

      <MinifiOptions options={options} setOptions={setOptions} />

      <HistoryJson
        history={history}
        setInputJson={setInputJson}
        setOutputJson={setOutputJson}
      />
    </div>
  );
}
