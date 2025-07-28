import { Textarea } from "@/components/ui/textarea";
import type { JsonInputProps } from "@/types/json-diff.types";

export function JsonInput({ 
  label, 
  value, 
  onChange, 
  error, 
  sizeInfo, 
  placeholder 
}: JsonInputProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium dark:text-white">{label}</label>
        {sizeInfo && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {sizeInfo}
          </span>
        )}
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-64 font-mono text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
      />
      {error && (
        <div className="text-red-500 dark:text-red-400 text-xs mt-1">
          {error}
        </div>
      )}
    </div>
  );
}