import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

// Components
import { JsonInput } from "@/pages/Development/JSON_Diff/components/JsonInput";
import { ActionButtons } from "@/pages/Development/JSON_Diff/components/ActionButtons";
import { DiffStats } from "@/pages/Development/JSON_Diff/components/DiffStats";
import { SideBySideView } from "@/pages/Development/JSON_Diff/components/SideBySideView";
import { HtmlDiffView } from "@/pages/Development/JSON_Diff/components/HtmlDiffView";
import { DiffTable } from "@/pages/Development/JSON_Diff/components/DiffTable";
import { RawJsonView } from "@/pages/Development/JSON_Diff/components/RawJsonView";

// Hooks
import { useDiffCalculation } from "@/hooks/JSON_Diff/useDiffCalculation";
import { useSampleData } from "@/hooks/JSON_Diff/useSampleData";

// Utils
import { copyToClipboard, exportFile, formatBytes } from "@/utils/JsonDiff";
import type { IDiffStats, ISizeInfo } from "@/types/json-diff.types";

export default function JsonDiffViewer() {
  const { theme } = useTheme();

  // Input states
  const [inputA, setInputA] = useState<string>("");
  const [inputB, setInputB] = useState<string>("");

  // JSON states
  const [jsonA, setJsonA] = useState<any>({});
  const [jsonB, setJsonB] = useState<any>({});

  // Diff states
  const [diff, setDiff] = useState<any>(null);
  const [diffPaths, setDiffPaths] = useState<string[][]>([]);
  const [diffStats, setDiffStats] = useState<IDiffStats | null>(null);

  // UI states
  const [activeTab, setActiveTab] = useState<string>("side-by-side");
  const [jsonAError, setJsonAError] = useState<string | null>(null);
  const [jsonBError, setJsonBError] = useState<string | null>(null);
  const [sizeInfo, setSizeInfo] = useState<ISizeInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Custom hooks
  const { calculateDiff, extractDiffPaths, calculateDiffStats } = useDiffCalculation();
  const { loadSampleData } = useSampleData();

  const handleCompare = () => {
    try {
      setIsLoading(true);
      clearErrors();

      const parsedA = JSON.parse(inputA);
      const parsedB = JSON.parse(inputB);

      const result = calculateDiff(parsedA, parsedB);
      const paths = extractDiffPaths(result || {});
      const stats = calculateDiffStats(result, parsedA, parsedB);

      updateDiffResults(parsedA, parsedB, result, paths, stats);
      updateSizeInfo();

    } catch (err: any) {
      handleJsonErrors(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrors = () => {
    setJsonAError(null);
    setJsonBError(null);
  };

  const updateDiffResults = (
    parsedA: any,
    parsedB: any,
    result: any,
    paths: string[][],
    stats: IDiffStats
  ) => {
    setJsonA(parsedA);
    setJsonB(parsedB);
    setDiff(result);
    setDiffPaths(paths);
    setDiffStats(stats);
  };

  const updateSizeInfo = () => {
    setSizeInfo({
      a: formatBytes(new Blob([inputA]).size),
      b: formatBytes(new Blob([inputB]).size)
    });
  };

  const handleJsonErrors = (err: any) => {
    const msg = err.message;
    if (!inputA || msg.includes("position") || msg.includes("JSON")) {
      setJsonAError(msg);
    }
    if (!inputB || msg.includes("position") || msg.includes("JSON")) {
      setJsonBError(msg);
    }
  };

  const handleCopy = (type: 'diff' | 'a' | 'b') => {
    const dataMap = {
      diff: diff,
      a: jsonA,
      b: jsonB
    };

    copyToClipboard(dataMap[type], type);
  };

  const handleExport = (type: 'diff' | 'a' | 'b') => {
    const dataMap = {
      diff: diff,
      a: jsonA,
      b: jsonB
    };

    exportFile(dataMap[type], type);
  };

  const handleSample = () => {
    const { sampleA, sampleB } = loadSampleData();
    setInputA(JSON.stringify(sampleA, null, 2));
    setInputB(JSON.stringify(sampleB, null, 2));
  };

  const handleClear = () => {
    setInputA("");
    setInputB("");
    setJsonA({});
    setJsonB({});
    setDiff(null);
    setDiffPaths([]);
    setDiffStats(null);
    setJsonAError(null);
    setJsonBError(null);
    setSizeInfo(null);
  };

  const handleSwap = () => {
    setInputA(inputB);
    setInputB(inputA);
  };

  return (
    <div className="space-y-6 p-6 dark:bg-slate-900 dark:text-white h-[100vh]">
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="dark:text-white">JSON Comparison Tool</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-4">
          <JsonInput
            label="JSON A"
            value={inputA}
            onChange={setInputA}
            error={jsonAError}
            sizeInfo={sizeInfo?.a}
            placeholder="Paste JSON A here"
          />

          <JsonInput
            label="JSON B"
            value={inputB}
            onChange={setInputB}
            error={jsonBError}
            sizeInfo={sizeInfo?.b}
            placeholder="Paste JSON B here"
          />
        </CardContent>

        <ActionButtons
          isLoading={isLoading}
          hasDiff={!!diff}
          hasJsonA={!!jsonA}
          hasJsonB={!!jsonB}
          hasInput={!!(inputA && inputB)}
          onCompare={handleCompare}
          onCopyDiff={() => handleCopy('diff')}
          onExportDiff={() => handleExport('diff')}
          onCopyA={() => handleCopy('a')}
          onCopyB={() => handleCopy('b')}
          onLoadSample={handleSample}
          onSwap={handleSwap}
          onClear={handleClear}
        />
      </Card>

      {diff && (
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="dark:text-white">
                Comparison Results ({diffPaths.length} changes)
              </CardTitle>

              {diffStats && <DiffStats stats={diffStats} />}
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full dark:bg-slate-700">
                <TabsTrigger value="side-by-side" className="dark:data-[state=active]:bg-slate-600 dark:text-white">
                  Side by Side
                </TabsTrigger>
                <TabsTrigger value="html-diff" className="dark:data-[state=active]:bg-slate-600 dark:text-white">
                  HTML Diff
                </TabsTrigger>
                <TabsTrigger value="diff-table" className="dark:data-[state=active]:bg-slate-600 dark:text-white">
                  Diff Table
                </TabsTrigger>
                <TabsTrigger value="raw" className="dark:data-[state=active]:bg-slate-600 dark:text-white">
                  Raw JSON
                </TabsTrigger>
              </TabsList>

              <TabsContent value="side-by-side">
                <SideBySideView
                  jsonA={jsonA}
                  jsonB={jsonB}
                  diffPaths={diffPaths}
                  theme={theme}
                  onCopy={handleCopy}
                  onExport={handleExport}
                />
              </TabsContent>

              <TabsContent value="html-diff">
                <HtmlDiffView diff={diff} jsonA={jsonA} />
              </TabsContent>

              <TabsContent value="diff-table">
                <DiffTable diffPaths={diffPaths} jsonA={jsonA} jsonB={jsonB} />
              </TabsContent>

              <TabsContent value="raw">
                <RawJsonView
                  jsonA={jsonA}
                  jsonB={jsonB}
                  diffPaths={diffPaths}
                  onCopy={handleCopy} 
                  onExport={handleExport}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


