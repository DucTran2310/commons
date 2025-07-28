import { FunctionDiffView } from "@/pages/Development/JSON_Diff/components/FunctionDiffView";
import { JsonViewer } from "@/pages/Development/JSON_Diff/components/JsonViewer";
import type { Theme } from "@/types/context.types";
import type { SideBySideViewProps } from "@/types/json-diff.types";
import { useEffect } from "react";

function highlightNode(node: HTMLElement, diffPaths: string[][], isLeftSide: boolean, theme: Theme) {
  const highlightKeys = diffPaths.map(p => p.join("."));
  const keys = node.querySelectorAll(".object-key");

  keys.forEach((el) => {
    const fullPath = el.getAttribute("title") || el.textContent;
    if (fullPath && highlightKeys.some((key) => fullPath.includes(key))) {
      const row = el.closest("li");
      if (row) {
        (row as HTMLElement).style.backgroundColor = isLeftSide
          ? theme === 'dark' ? '#7f1d1d' : '#fee2e2'
          : theme === 'dark' ? '#14532d' : '#dcfce7';

        const valueEl = row.querySelector(".object-value");
        if (valueEl) {
          (valueEl as HTMLElement).style.fontWeight = "bold";
        }
      }
    }
  });
}

function useSideBySideHighlight(diffPaths: string[][], theme: Theme) {
  useEffect(() => {
    if (!diffPaths.length) return;

    const highlightElements = () => {
      const viewerA = document.querySelector(".json-viewer-a");
      const viewerB = document.querySelector(".json-viewer-b");
      if (viewerA) highlightNode(viewerA as HTMLElement, diffPaths, true, theme);
      if (viewerB) highlightNode(viewerB as HTMLElement, diffPaths, false, theme);
    };

    const timer = setTimeout(highlightElements, 100);
    return () => clearTimeout(timer);
  }, [diffPaths, theme]);
}

export function SideBySideView({ 
  jsonA, 
  jsonB, 
  diffPaths, 
  theme, 
  onCopy, 
  onExport 
}: SideBySideViewProps) {
  useSideBySideHighlight(diffPaths, theme);

  // Check if dealing with function strings
  const isFunctionDiff = typeof jsonA === "string" && 
                        typeof jsonB === "string" && 
                        (jsonA.includes("function") || jsonB.includes("function"));

  if (isFunctionDiff) {
    return <FunctionDiffView jsonA={jsonA} jsonB={jsonB} theme={theme} onCopy={onCopy} />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 overflow-auto mt-4">
      <JsonViewer
        title="JSON A"
        data={jsonA}
        theme={theme}
        className="json-viewer-a"
        onCopy={() => onCopy('a')}
        onExport={() => onExport('a')}
      />
      
      <JsonViewer
        title="JSON B"
        data={jsonB}
        theme={theme}
        className="json-viewer-b"
        onCopy={() => onCopy('b')}
        onExport={() => onExport('b')}
      />
    </div>
  );
}