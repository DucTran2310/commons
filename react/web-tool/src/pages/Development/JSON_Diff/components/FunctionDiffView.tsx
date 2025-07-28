import { Button } from "@/components/ui/button";
import type { FunctionDiffViewProps } from "@/types/json-diff.types";

function highlightFunctionDiff(
  textA: string,
  textB: string,
  theme: string
): { highlightedA: string; highlightedB: string; } {
  const linesA = textA.split("\n");
  const linesB = textB.split("\n");

  let firstDiffLine = -1;
  const maxLines = Math.max(linesA.length, linesB.length);
  for (let i = 0; i < maxLines; i++) {
    if (i >= linesA.length || i >= linesB.length || linesA[i] !== linesB[i]) {
      firstDiffLine = i;
      break;
    }
  }

  const leftColor = theme === "dark" ? "#7f1d1d" : "#fee2e2";
  const rightColor = theme === "dark" ? "#14532d" : "#dcfce7";

  const highlightedA = linesA
    .map((line, i) =>
      i >= firstDiffLine && firstDiffLine !== -1
        ? `<span style="background-color: ${leftColor}">${line}</span>`
        : line
    )
    .join("\n");

  const highlightedB = linesB
    .map((line, i) =>
      i >= firstDiffLine && firstDiffLine !== -1
        ? `<span style="background-color: ${rightColor}">${line}</span>`
        : line
    )
    .join("\n");

  return { highlightedA, highlightedB };
}

export function FunctionDiffView({ jsonA, jsonB, theme, onCopy }: FunctionDiffViewProps) {
  const { highlightedA, highlightedB } = highlightFunctionDiff(jsonA, jsonB, theme);

  return (
    <div className="grid grid-cols-2 gap-4 overflow-auto mt-4">
      <div className="border rounded p-4 dark:bg-slate-700 dark:border-slate-600">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold dark:text-white">Function A</h3>
          <Button variant="ghost" size="sm" onClick={() => onCopy('a')}>
            Copy
          </Button>
        </div>
        <pre
          className="font-mono text-sm whitespace-pre-wrap dark:text-white"
          dangerouslySetInnerHTML={{ __html: highlightedA }}
        />
      </div>
      <div className="border rounded p-4 dark:bg-slate-700 dark:border-slate-600">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold dark:text-white">Function B</h3>
          <Button variant="ghost" size="sm" onClick={() => onCopy('b')}>
            Copy
          </Button>
        </div>
        <pre
          className="font-mono text-sm whitespace-pre-wrap dark:text-white"
          dangerouslySetInnerHTML={{ __html: highlightedB }}
        />
      </div>
    </div>
  );
}