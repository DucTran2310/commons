import type { DiffStatsProps } from "@/types/json-diff.types";

export function DiffStats({ stats }: DiffStatsProps) {
  return (
    <div className="flex gap-4 text-sm">
      <span className="text-green-600 dark:text-green-400">
        +{stats.added}
      </span>
      <span className="text-red-600 dark:text-red-400">
        -{stats.removed}
      </span>
      <span className="text-yellow-600 dark:text-yellow-400">
        ~{stats.modified}
      </span>
      <span className="text-gray-600 dark:text-gray-400">
        {stats.unchanged} unchanged
      </span>
    </div>
  );
}