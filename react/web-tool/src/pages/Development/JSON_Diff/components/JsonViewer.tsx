import { Button } from "@/components/ui/button";
import type { JsonViewerProps } from "@/types/json-diff.types";
import ReactJson from "react-json-view";

export function JsonViewer({ title, data, theme, className, onCopy, onExport }: JsonViewerProps) {
  return (
    <div className={`${className} border rounded p-4 dark:bg-slate-700 dark:border-slate-600`}>
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
      <ReactJson
        src={data}
        theme={theme === 'dark' ? 'ashes' : 'rjv-default'}
        name={false}
        collapsed={2}
        displayDataTypes={true}
        iconStyle="square"
        style={{ backgroundColor: 'transparent' }}
        enableClipboard={false}
      />
    </div>
  );
}