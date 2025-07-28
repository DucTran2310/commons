import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import type { ActionButtonsProps } from "@/types/json-diff.types";

export function ActionButtons({
  isLoading,
  hasDiff,
  hasJsonA,
  hasJsonB,
  hasInput,
  onCompare,
  onCopyDiff,
  onExportDiff,
  onCopyA,
  onCopyB,
  onLoadSample,
  onSwap,
  onClear
}: ActionButtonsProps) {
  return (
    <CardContent className="flex gap-2 pt-4 flex-wrap">
      <Button onClick={onCompare} disabled={isLoading}>
        {isLoading ? "Comparing..." : "Compare"}
      </Button>
      
      <Button variant="outline" onClick={onCopyDiff} disabled={!hasDiff}>
        Copy Diff
      </Button>
      
      <Button variant="outline" onClick={onExportDiff} disabled={!hasDiff}>
        Export Diff
      </Button>
      
      <Button variant="outline" onClick={onCopyA} disabled={!hasJsonA}>
        Copy A
      </Button>
      
      <Button variant="outline" onClick={onCopyB} disabled={!hasJsonB}>
        Copy B
      </Button>
      
      <Button variant="ghost" onClick={onLoadSample}>
        Load Sample
      </Button>
      
      <Button variant="ghost" onClick={onSwap} disabled={!hasInput}>
        Swap
      </Button>
      
      <Button variant="ghost" onClick={onClear}>
        Clear
      </Button>
    </CardContent>
  );
}