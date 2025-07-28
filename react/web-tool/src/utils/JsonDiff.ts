import { DiffPatcher } from "jsondiffpatch";
import copy from "copy-to-clipboard";
import { saveAs } from "file-saver";

export const diffpatcher = new DiffPatcher({ 
  arrays: { detectMove: false }, 
  textDiff: { minLength: 60 } as any,
  objectHash: (obj: any) => obj.id || JSON.stringify(obj)
});

// Line-by-line comparison utilities
export interface LineMetadata {
  indent: number;
  path: string[];
  key: string | null;
  value: any;
  lineType: 'key-value' | 'object-start' | 'array-start' | 'closing' | 'array-item' | 'empty';
  normalizedContent: string;
}

// Build detailed line metadata for accurate comparison
export const buildDetailedLineMetadata = (jsonString: string): LineMetadata[] => {
  const lines = jsonString.split('\n');
  const metadata: LineMetadata[] = [];
  const pathStack: string[] = [];
  const indentStack: number[] = [];
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const indent = line.match(/^\s*/)?.[0]?.length || 0;
    
    // Adjust path stack based on indentation
    while (indentStack.length > 0 && indent <= indentStack[indentStack.length - 1]) {
      indentStack.pop();
      pathStack.pop();
    }
    
    // Parse line content
    const isClosing = /^\s*[}\]],?$/.test(line);
    const keyValueMatch = trimmed.match(/^"([^"]+)"\s*:\s*(.*?)(?:,\s*)?$/);
    const arrayItemMatch = trimmed.match(/^(.*?)(?:,\s*)?$/);
    const isObjectStart = trimmed.includes('{') && !trimmed.match(/^"[^"]+"\s*:\s*\{.*\},?\s*$/);
    const isArrayStart = trimmed.includes('[') && !trimmed.match(/^"[^"]+"\s*:\s*\[.*\],?\s*$/);
    
    let currentKey: string | null = null;
    let currentValue: any = null;
    let lineType: LineMetadata['lineType'] = 'empty';
    
    if (trimmed === '') {
      lineType = 'empty';
    } else if (isClosing) {
      lineType = 'closing';
    } else if (keyValueMatch) {
      currentKey = keyValueMatch[1];
      currentValue = keyValueMatch[2].replace(/,$/, '');
      
      if (isObjectStart) {
        lineType = 'object-start';
        pathStack.push(currentKey);
        indentStack.push(indent);
      } else if (isArrayStart) {
        lineType = 'array-start';
        pathStack.push(currentKey);
        indentStack.push(indent);
      } else {
        lineType = 'key-value';
      }
    } else {
      lineType = 'array-item';
      currentValue = trimmed.replace(/,$/, '');
    }
    
    metadata.push({
      indent,
      path: [...pathStack],
      key: currentKey,
      value: currentValue,
      lineType,
      normalizedContent: normalizeLineContent(line)
    });
  });
  
  return metadata;
};

// Normalize line content for comparison
export const normalizeLineContent = (line: string): string => {
  return line
    .trim()
    .replace(/,\s*$/, '') // Remove trailing comma
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/:\s+/g, ': ') // Normalize colon spacing
    .replace(/^\s+|\s+$/g, ''); // Trim
};

// Compare two lines semantically
export const compareLinesSemantically = (
  line1: string, 
  meta1: LineMetadata,
  line2: string,
  meta2: LineMetadata
): boolean => {
  // Quick content comparison
  if (meta1.normalizedContent === meta2.normalizedContent) {
    return true;
  }
  
  // Compare by semantic meaning
  if (meta1.lineType !== meta2.lineType) {
    return false;
  }
  
  // Compare paths
  if (meta1.path.join('.') !== meta2.path.join('.')) {
    return false;
  }
  
  // Compare keys
  if (meta1.key !== meta2.key) {
    return false;
  }
  
  // For values, do deep comparison
  if (meta1.lineType === 'key-value' || meta1.lineType === 'array-item') {
    try {
      const value1 = meta1.value === 'null' ? null : 
                   meta1.value === 'true' ? true :
                   meta1.value === 'false' ? false :
                   isNaN(Number(meta1.value)) ? meta1.value.replace(/^"|"$/g, '') : Number(meta1.value);
      
      const value2 = meta2.value === 'null' ? null : 
                   meta2.value === 'true' ? true :
                   meta2.value === 'false' ? false :
                   isNaN(Number(meta2.value)) ? meta2.value.replace(/^"|"$/g, '') : Number(meta2.value);
      
      return value1 === value2;
    } catch (e) {
      return meta1.value === meta2.value;
    }
  }
  
  return true;
};

// Find matching lines between two JSON structures
export const findMatchingLines = (
  lines1: string[],
  lines2: string[]
): Map<number, number> => {
  const metadata1 = buildDetailedLineMetadata(lines1.join('\n'));
  const metadata2 = buildDetailedLineMetadata(lines2.join('\n'));
  
  const matches = new Map<number, number>();
  const used2 = new Set<number>();
  
  // First pass: exact path and content matches
  metadata1.forEach((meta1, index1) => {
    if (matches.has(index1)) return;
    
    for (let index2 = 0; index2 < metadata2.length; index2++) {
      if (used2.has(index2)) continue;
      
      const meta2 = metadata2[index2];
      if (compareLinesSemantically(lines1[index1], meta1, lines2[index2], meta2)) {
        matches.set(index1, index2);
        used2.add(index2);
        break;
      }
    }
  });
  
  return matches;
};

// Get different lines by comparing two JSON structures
export const getDifferentLines = (jsonA: any, jsonB: any): {
  linesA: Set<number>;
  linesB: Set<number>;
} => {
  const stringA = JSON.stringify(jsonA, null, 2);
  const stringB = JSON.stringify(jsonB, null, 2);
  const linesA = stringA.split('\n');
  const linesB = stringB.split('\n');
  
  const matches = findMatchingLines(linesA, linesB);
  
  const differentLinesA = new Set<number>();
  const differentLinesB = new Set<number>();
  
  // Mark unmatched lines from A
  linesA.forEach((_, index) => {
    if (!matches.has(index)) {
      differentLinesA.add(index);
    }
  });
  
  // Mark unmatched lines from B
  const matchedInB = new Set(Array.from(matches.values()));
  linesB.forEach((_, index) => {
    if (!matchedInB.has(index)) {
      differentLinesB.add(index);
    }
  });
  
  return {
    linesA: differentLinesA,
    linesB: differentLinesB
  };
};

// Enhanced path utilities (keeping existing ones)
export function getValueByPath(obj: any, path: string[]): any {
  return path.reduce((acc, key) => (acc !== undefined ? acc[key] : undefined), obj);
}

export function copyToClipboard(data: any, type: string) {
  const text = JSON.stringify(data, null, 2);
  copy(text);
  
  const typeLabels = {
    diff: 'Diff',
    a: 'JSON A',
    b: 'JSON B'
  };
  
  alert(`${typeLabels[type as keyof typeof typeLabels]} copied to clipboard`);
}

export function exportFile(data: any, type: 'diff' | 'a' | 'b') {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  
  const filenames = {
    diff: "diff.json",
    a: "json_a.json",
    b: "json_b.json"
  };
  
  saveAs(blob, filenames[type]);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Legacy utilities for backward compatibility
export const normalizePath = (path: string[]) => {
  return path.map(p => String(p).replace(/"/g, '').replace(/'/g, ''));
};

export const isPathInLine = (path: string[], line: string): boolean => {
  if (!path || path.length === 0) return false;
  
  const normalizedPath = normalizePath(path);
  const trimmedLine = line.trim();
  
  const lastSegment = normalizedPath[normalizedPath.length - 1];
  if (trimmedLine.includes(`"${lastSegment}"`)) {
    return true;
  }
  
  const arrayIndexPattern = /^\s*\d+\s*:/;
  if (arrayIndexPattern.test(trimmedLine)) {
    const indexMatch = trimmedLine.match(/^\s*(\d+)\s*:/);
    if (indexMatch && normalizedPath.includes(indexMatch[1])) {
      return true;
    }
  }
  
  for (let i = 0; i < normalizedPath.length; i++) {
    const segment = normalizedPath[i];
    const patterns = [
      `"${segment}"\\s*:`,
      `'${segment}'\\s*:`,
      `${segment}\\s*:`,
    ];
    
    for (const pattern of patterns) {
      const regex = new RegExp(pattern);
      if (regex.test(trimmedLine)) {
        return true;
      }
    }
  }
  
  return false;
};


