import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import { DiffTypes, type DiffStats, type DiffType, type HighlightedJsonPanelProps, type LineMetadata } from "@/types/json-diff.types";
import { getDiffStyling } from "@/utils/JsonDiff";
import React from 'react';

// Enhanced JSON Panel Component
export const HighlightedJsonPanel: React.FC<HighlightedJsonPanelProps> = ({
  title,
  data,
  compareWith,
  highlightMode = 'comprehensive-diff',
  showLineNumbers = true,
  showDiffStats = true,
  onCopy,
  onExport
}) => {
  const { theme } = useTheme();
  const jsonString = JSON.stringify(data, null, 2);
  const lines = jsonString.split('\n');

  const compareJsonString = compareWith ? JSON.stringify(compareWith, null, 2) : '';
  const compareLines = compareJsonString.split('\n');

  // Enhanced line metadata with better array and object tracking
  const buildEnhancedMetadata = (jsonLines: string[], originalData: any): LineMetadata[] => {
    const metadata: LineMetadata[] = [];
    const pathStack: string[] = [];
    const indentStack: number[] = [];
    const arrayIndexStack: number[] = [];

    jsonLines.forEach((line) => {
      const trimmed = line.trim();
      const indent = line.match(/^\s*/)?.[0]?.length || 0;

      // Adjust stacks based on indentation changes
      while (indentStack.length > 0 && indent <= indentStack[indentStack.length - 1]) {
        indentStack.pop();
        pathStack.pop();
        arrayIndexStack.pop();
      }

      // Detect line types with better array handling
      const isClosing = /^\s*[}\]],?$/.test(line);
      const keyMatch = trimmed.match(/^"([^"]+)"\s*:\s*(.*)/);
      const isObjectStart = trimmed.includes('{') && !trimmed.endsWith('},') && !trimmed.endsWith('}');
      const isArrayStart = trimmed.includes('[') && !trimmed.endsWith('],') && !trimmed.endsWith(']');
      const isEmpty = trimmed === '';

      // Array item detection (handles both object and primitive items)
      const isArrayItem = indentStack.length > 0 &&
        arrayIndexStack[arrayIndexStack.length - 1] >= 0 &&
        (trimmed.startsWith('{') || trimmed.startsWith('"') || /^[\d\-\[\{]/.test(trimmed) || /^[a-zA-Z]/.test(trimmed)) &&
        !keyMatch;

      let currentKey: string | null = null;
      let currentValue: any = null;
      let rawValue = '';
      let lineType = 'empty';
      let arrayIndex: number | undefined;
      let parentArrayPath: string[] | undefined;

      if (isEmpty) {
        lineType = 'empty';
      } else if (isClosing) {
        lineType = 'closing';
      } else if (keyMatch) {
        currentKey = keyMatch[1];
        rawValue = keyMatch[2];

        try {
          if (rawValue.trim().endsWith(',')) {
            currentValue = JSON.parse(rawValue.slice(0, -1));
          } else {
            currentValue = JSON.parse(rawValue);
          }
        } catch {
          currentValue = rawValue;
        }

        if (isObjectStart) {
          lineType = 'object-start';
          pathStack.push(currentKey);
          indentStack.push(indent);
          arrayIndexStack.push(-1);
        } else if (isArrayStart) {
          lineType = 'array-start';
          pathStack.push(currentKey);
          indentStack.push(indent);
          arrayIndexStack.push(0);
        } else {
          lineType = 'key-value';
        }
      } else if (isArrayItem) {
        lineType = 'array-item';
        rawValue = trimmed;
        arrayIndex = arrayIndexStack[arrayIndexStack.length - 1];
        arrayIndexStack[arrayIndexStack.length - 1]++;
        parentArrayPath = [...pathStack];

        try {
          if (rawValue.endsWith(',')) {
            currentValue = JSON.parse(rawValue.slice(0, -1));
          } else {
            currentValue = JSON.parse(rawValue);
          }
        } catch {
          currentValue = rawValue;
        }
      }

      // Create content hash for comparison
      const contentForHash = currentKey ? `${currentKey}:${currentValue}` : String(currentValue);
      const hash = btoa(encodeURIComponent(contentForHash)).substring(0, 8);

      metadata.push({
        indent,
        path: [...pathStack],
        key: currentKey,
        value: currentValue,
        rawValue,
        lineType,
        isObjectStart,
        isArrayStart,
        isClosing,
        hasValue: currentValue !== null && currentValue !== undefined,
        arrayIndex,
        parentArrayPath,
        hash
      });
    });

    return metadata;
  };

  // Enhanced line-by-line comparison that detects all differences
  const performComprehensiveDiff = (
    currentLines: string[],
    compareLines: string[],
    currentMeta: LineMetadata[],
    compareMeta: LineMetadata[]
  ) => {
    const diffs: Array<{
      type: DiffType;
      lineIndex: number;
      correspondingIndex?: number;
      context: {
        path: string[];
        key?: string;
        isArrayItem: boolean;
        arrayIndex?: number;
      };
    }> = [];

    // Normalize content for comparison (remove whitespace/comma differences)
    const normalizeContent = (line: string) => {
      return line.trim().replace(/,\s*$/, '').replace(/\s+/g, ' ');
    };

    // Create value-based maps for array item matching
    const createValueMaps = (metadata: LineMetadata[], lines: string[]) => {
      const valueMap = new Map<string, number[]>();
      const keyMap = new Map<string, number[]>();

      metadata.forEach((meta, index) => {
        // For array items or key-value pairs, use the actual content for matching
        if (meta.lineType === 'array-item' || meta.lineType === 'key-value') {
          const normalizedContent = normalizeContent(lines[index]);
          if (!valueMap.has(normalizedContent)) {
            valueMap.set(normalizedContent, []);
          }
          valueMap.get(normalizedContent)?.push(index);
        }

        // For keys, track by key name for detecting new/removed fields
        if (meta.key) {
          const keyPath = meta.path.join('.') + '.' + meta.key;
          if (!keyMap.has(keyPath)) {
            keyMap.set(keyPath, []);
          }
          keyMap.get(keyPath)?.push(index);
        }
      });

      return { valueMap, keyMap };
    };

    const compareMaps = createValueMaps(compareMeta, compareLines);

    const processedCurrent = new Set<number>();
    const processedCompare = new Set<number>();

    // Pass 1: Find exact content matches (unchanged lines)
    currentMeta.forEach((meta, currentIndex) => {
      if (processedCurrent.has(currentIndex)) return;

      const currentContent = normalizeContent(currentLines[currentIndex]);
      let matchFound = false;

      // Look for exact content match in compare data
      if (compareMaps.valueMap.has(currentContent)) {
        const compareIndices = compareMaps.valueMap.get(currentContent) || [];

        for (const compareIndex of compareIndices) {
          if (processedCompare.has(compareIndex)) continue;

          const compareMeta_ = compareMeta[compareIndex];

          // Verify the context is similar (same line type, similar path)
          if (meta.lineType === compareMeta_.lineType ||
            (meta.lineType === 'key-value' && compareMeta_.lineType === 'key-value' && meta.key === compareMeta_.key)) {

            diffs.push({
              type: DiffTypes.UNCHANGED,
              lineIndex: currentIndex,
              correspondingIndex: compareIndex,
              context: {
                path: meta.path,
                key: meta.key || undefined,
                isArrayItem: meta.lineType === 'array-item',
                arrayIndex: meta.arrayIndex
              }
            });

            processedCurrent.add(currentIndex);
            processedCompare.add(compareIndex);
            matchFound = true;
            break;
          }
        }
      }

      // Pass 1.5: Check for array items that moved positions (reorder)
      if (!matchFound && meta.lineType === 'array-item') {
        // Look for the same value in different array positions
        if (compareMaps.valueMap.has(currentContent)) {
          const compareIndices = compareMaps.valueMap.get(currentContent) || [];

          for (const compareIndex of compareIndices) {
            if (processedCompare.has(compareIndex)) continue;

            const compareMeta_ = compareMeta[compareIndex];

            if (compareMeta_.lineType === 'array-item' &&
              meta.parentArrayPath?.join('.') === compareMeta_.parentArrayPath?.join('.')) {

              diffs.push({
                type: DiffTypes.ARRAY_REORDER,
                lineIndex: currentIndex,
                correspondingIndex: compareIndex,
                context: {
                  path: meta.path,
                  key: meta.key || undefined,
                  isArrayItem: true,
                  arrayIndex: meta.arrayIndex
                }
              });

              processedCurrent.add(currentIndex);
              processedCompare.add(compareIndex);
              matchFound = true;
              break;
            }
          }
        }
      }

      // Pass 2: Check for key-based matches with different values (modifications)
      if (!matchFound && meta.key) {
        const keyPath = meta.path.join('.') + '.' + meta.key;

        if (compareMaps.keyMap.has(keyPath)) {
          const compareIndices = compareMaps.keyMap.get(keyPath) || [];

          for (const compareIndex of compareIndices) {
            if (processedCompare.has(compareIndex)) continue;

            const compareMeta_ = compareMeta[compareIndex];

            if (compareMeta_.key === meta.key) {
              // Same key, different value = modification
              let diffType = DiffTypes.MODIFIED;

              // Check for type changes
              if (typeof meta.value !== typeof compareMeta_.value) {
                diffType = DiffTypes.TYPE_CHANGE;
              }

              diffs.push({
                type: diffType,
                lineIndex: currentIndex,
                correspondingIndex: compareIndex,
                context: {
                  path: meta.path,
                  key: meta.key,
                  isArrayItem: false,
                  arrayIndex: undefined
                }
              });

              processedCurrent.add(currentIndex);
              processedCompare.add(compareIndex);
              matchFound = true;
              break;
            }
          }
        }
      }

      // If no match found, mark as added
      if (!matchFound) {
        diffs.push({
          type: DiffTypes.ADDED,
          lineIndex: currentIndex,
          context: {
            path: meta.path,
            key: meta.key || undefined,
            isArrayItem: meta.lineType === 'array-item',
            arrayIndex: meta.arrayIndex
          }
        });
        processedCurrent.add(currentIndex);
      }
    });

    // Pass 3: Find removals (items in compare that weren't matched)
    compareMeta.forEach((meta, compareIndex) => {
      if (!processedCompare.has(compareIndex)) {
        diffs.push({
          type: DiffTypes.REMOVED,
          lineIndex: -1,
          correspondingIndex: compareIndex,
          context: {
            path: meta.path,
            key: meta.key || undefined,
            isArrayItem: meta.lineType === 'array-item',
            arrayIndex: meta.arrayIndex
          }
        });
      }
    });

    return diffs;
  };

  // Calculate diff statistics
  const { highlightedLines, diffStats } = React.useMemo(() => {
    const highlights = new Map<number, DiffType>();
    let stats: DiffStats = { added: 0, removed: 0, modified: 0, unchanged: 0, reordered: 0 };

    if (highlightMode === 'comprehensive-diff' && compareWith) {
      const currentMetadata = buildEnhancedMetadata(lines, data);
      const compareMetadata = buildEnhancedMetadata(compareLines, compareWith);

      const diffs = performComprehensiveDiff(lines, compareLines, currentMetadata, compareMetadata);

      diffs.forEach(diff => {
        if (diff.lineIndex >= 0) {
          highlights.set(diff.lineIndex, diff.type);
        }

        // Update statistics
        switch (diff.type) {
          case DiffTypes.ADDED: stats.added++; break;
          case DiffTypes.REMOVED: stats.removed++; break;
          case DiffTypes.MODIFIED:
          case DiffTypes.TYPE_CHANGE: stats.modified++; break;
          case DiffTypes.UNCHANGED: stats.unchanged++; break;
          case DiffTypes.ARRAY_REORDER: stats.reordered++; break;
        }
      });

      // Expand highlights for container changes
      highlights.forEach((diffType, lineIndex) => {
        if (([DiffTypes.ADDED, DiffTypes.REMOVED, DiffTypes.MODIFIED] as DiffType[]).includes(diffType)) {
          const lineMeta = currentMetadata[lineIndex];
          if (lineMeta && (lineMeta.isObjectStart || lineMeta.isArrayStart)) {
            const currentIndent = lineMeta.indent;
            for (let i = lineIndex + 1; i < lines.length; i++) {
              const nextMeta = currentMetadata[i];
              if (nextMeta.indent <= currentIndent && !nextMeta.isClosing) {
                break;
              }
              if (!highlights.has(i)) {
                highlights.set(i, diffType);
              }
            }
          }
        }
      });
    }

    return { highlightedLines: highlights, diffStats: stats };
  }, [jsonString, compareJsonString, highlightMode, data, compareWith]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex flex-col">
          <CardTitle className="text-sm font-medium">
            {title}
            {highlightMode === 'comprehensive-diff' && compareWith && (
              <span className="ml-2 text-xs text-muted-foreground">
                (Comprehensive diff)
              </span>
            )}
          </CardTitle>
          {showDiffStats && compareWith && (
            <div className="flex space-x-4 mt-1 text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400">+{diffStats.added}</span>
              <span className="text-red-600 dark:text-red-400">-{diffStats.removed}</span>
              <span className="text-yellow-600 dark:text-yellow-400">~{diffStats.modified}</span>
              {diffStats.reordered > 0 && (
                <span className="text-blue-600 dark:text-blue-400">↕{diffStats.reordered}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onCopy}>
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <pre className="text-sm overflow-auto max-h-[calc(100vh-300px)]">
          {lines.map((line, index) => {
            const diffType = highlightedLines.get(index);

            return (
              <div
                key={index}
                className={`
                  ${diffType ? getDiffStyling(diffType, theme) : ''}
                  ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800/50' : 'text-gray-900 hover:bg-gray-50'}
                  leading-relaxed
                `}
              >
                {showLineNumbers && (
                  <span className={`inline-block w-8 text-right mr-2 select-none ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {index + 1}
                  </span>
                )}
                {diffType && (
                  <span className={`inline-block w-4 text-xs mr-1 select-none ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {diffType === DiffTypes.ADDED && '+'}
                    {diffType === DiffTypes.REMOVED && '-'}
                    {diffType === DiffTypes.MODIFIED && '~'}
                    {diffType === DiffTypes.TYPE_CHANGE && '≠'}
                    {diffType === DiffTypes.ARRAY_REORDER && '↕'}
                  </span>
                )}
                {line}
              </div>
            );
          })}
        </pre>
      </CardContent>
    </Card>
  );
};