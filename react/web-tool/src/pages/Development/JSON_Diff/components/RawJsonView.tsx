import { HighlightedJsonPanel } from "@/pages/Development/JSON_Diff/components/HighlightedJsonPanel";
import type { RawJsonViewProps } from "@/types/json-diff.types";

export function RawJsonView({ jsonA, jsonB, diffPaths, onCopy, onExport }: RawJsonViewProps) {
  return (
    <div className="grid grid-cols-2 gap-4 overflow-auto mt-4">
      <HighlightedJsonPanel
        title="JSON A (Original)"
        data={jsonA}
        compareWith={jsonB}
        highlightMode="comprehensive-diff"
        onCopy={() => onCopy?.('a')}
        onExport={() => onExport?.('a')}
        type="a"
      />
      
      <HighlightedJsonPanel
        title="JSON B (Comparing with A)"
        data={jsonB}
        compareWith={jsonA}
        highlightMode="comprehensive-diff"
        onCopy={() => onCopy?.('b')}
        onExport={() => onExport?.('b')}
        type="b"
      />
    </div>
  );
}