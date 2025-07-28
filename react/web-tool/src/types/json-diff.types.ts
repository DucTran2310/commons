import type { Theme } from "@/types/context.types";

export interface IDiffStats {
  added: number;
  removed: number;
  modified: number;
  unchanged: number;
}

export interface ISizeInfo {
  a: string;
  b: string;
}

export interface SideBySideViewProps {
  jsonA: any;
  jsonB: any;
  diffPaths: string[][];
  theme: Theme;
  onCopy: (type: 'a' | 'b') => void;
  onExport: (type: 'a' | 'b') => void;
}

export interface JsonViewerProps {
  title: string;
  data: any;
  theme: Theme;
  className: string;
  onCopy: () => void;
  onExport: () => void;
}

export interface FunctionDiffViewProps {
  jsonA: string;
  jsonB: string;
  theme: Theme;
  onCopy: (type: 'a' | 'b') => void;
}

export interface RawJsonViewProps {
  jsonA: any;
  jsonB: any;
  diffPaths: string[][]; // Thêm prop này
  onCopy: (type: 'a' | 'b') => void;
  onExport: (type: 'a' | 'b') => void;
}

export interface RawJsonPanelProps {
  title: string;
  data: any;
  onCopy: () => void;
  onExport: () => void;
}

export interface HtmlDiffViewProps {
  diff: any;
  jsonA: any;
}

export interface DiffStatsProps {
  stats: {
    added: number;
    removed: number;
    modified: number;
    unchanged: number;
  };
}

export interface DiffTableProps {
  diffPaths: string[][];
  jsonA: any;
  jsonB: any;
}

export interface ActionButtonsProps {
  isLoading: boolean;
  hasDiff: boolean;
  hasJsonA: boolean;
  hasJsonB: boolean;
  hasInput: boolean;
  onCompare: () => void;
  onCopyDiff: () => void;
  onExportDiff: () => void;
  onCopyA: () => void;
  onCopyB: () => void;
  onLoadSample: () => void;
  onSwap: () => void;
  onClear: () => void;
}

export interface JsonInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error: string | null;
  sizeInfo?: string;
  placeholder: string;
}

// Types for diff analysis
export const DiffTypes = {
  UNCHANGED: 'unchanged',
  ADDED: 'added',
  REMOVED: 'removed',
  MODIFIED: 'modified',
  TYPE_CHANGE: 'type-change',
  ARRAY_REORDER: 'array-reorder',
} as const;

export type DiffType = typeof DiffTypes[keyof typeof DiffTypes];

export interface HighlightedJsonPanelProps {
  title: string;
  data: any;
  compareWith?: any;
  highlightMode?: 'comprehensive-diff' | 'none';
  showLineNumbers?: boolean;
  showDiffStats?: boolean;
  onCopy?: () => void;
  onExport?: () => void;
  type?: 'a' | 'b';
}

export interface LineMetadata {
  indent: number;
  path: string[];
  key: string | null;
  value: any;
  rawValue: string;
  lineType: string;
  isObjectStart: boolean;
  isArrayStart: boolean;
  isClosing: boolean;
  hasValue: boolean;
  arrayIndex?: number;
  parentArrayPath?: string[];
  hash: string;
}

export interface DiffStats {
  added: number;
  removed: number;
  modified: number;
  typeChanged: number; 
  unchanged: number;
  reordered: number;
}
