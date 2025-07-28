import { DiffPatcher } from "jsondiffpatch";

const diffpatcher = new DiffPatcher({ 
  arrays: { detectMove: false }, 
  textDiff: { minLength: 60 } as any,
  objectHash: (obj: any) => obj.id || JSON.stringify(obj)
});

interface DiffStats {
  added: number;
  removed: number;
  modified: number;
  unchanged: number;
}

export function useDiffCalculation() {
  const calculateDiff = (jsonA: any, jsonB: any) => {
    return diffpatcher.diff(jsonA, jsonB);
  };

  const extractDiffPaths = (diff: any, basePath: string[] = []): string[][] => {
    const paths: string[][] = [];
    for (const key in diff) {
      if (key === "_t") continue;
      const value = diff[key];
      if (Array.isArray(value) && value.length >= 2 && typeof value[2] !== "object") {
        paths.push([...basePath, key]);
      } else if (typeof value === "object") {
        paths.push(...extractDiffPaths(value, [...basePath, key]));
      }
    }
    return paths;
  };

  const calculateDiffStats = (diff: any, jsonA: any, jsonB: any): DiffStats => {
    if (!diff) return { added: 0, removed: 0, modified: 0, unchanged: 0 };

    let added = 0;
    let removed = 0;
    let modified = 0;
    
    function traverse(delta: any, left: any, path: string[] = []) {
      if (!delta) return;

      for (const key in delta) {
        if (key === '_t') continue;
        
        const currentPath = [...path, key];
        const deltaValue = delta[key];
        
        if (Array.isArray(deltaValue)) {
          if (deltaValue.length === 1) {
            // Added
            added++;
          } else if (deltaValue.length === 2 && deltaValue[0] === 0 && deltaValue[1] === 0) {
            // Removed
            removed++;
          } else if (deltaValue.length === 3) {
            // Modified
            modified++;
          }
        } else if (typeof deltaValue === 'object') {
          traverse(deltaValue, left?.[key], currentPath);
        }
      }
    }

    traverse(diff, jsonA);

    const totalKeysA = countKeys(jsonA);
    const totalKeysB = countKeys(jsonB);
    const unchanged = Math.min(totalKeysA, totalKeysB) - modified;

    return { added, removed, modified, unchanged };
  };

  const countKeys = (obj: any): number => {
    if (typeof obj !== 'object' || obj === null) return 0;
    
    let count = 0;
    for (const key in obj) {
      count++;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        count += countKeys(obj[key]);
      }
    }
    return count;
  };

  return {
    calculateDiff,
    extractDiffPaths,
    calculateDiffStats
  };
}