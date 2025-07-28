import { Button } from "@/components/ui/button";
import type { RawJsonPanelProps } from "@/types/json-diff.types";

export function RawJsonPanel({ title, data, onCopy, onExport }: RawJsonPanelProps) {
  return (
    <div className="border rounded p-4 dark:bg-slate-700 dark:border-slate-600">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold dark:text-white">{title}</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onCopy}>
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={onExport}>
            Export
          </Button>
        </div>
      </div>
      <pre className="font-mono text-sm whitespace-pre-wrap dark:text-white">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}