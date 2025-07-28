import { Button } from "@/components/ui/button";
import copy from "copy-to-clipboard";
import type { HtmlDiffViewProps } from "@/types/json-diff.types";
import * as htmlFormatter from 'jsondiffpatch/formatters/html';
import 'jsondiffpatch/formatters/styles/html.css';

export function generateHtmlDiff(delta: any, jsonA: any): string {
  if (!delta) return "";
  try {
    return htmlFormatter.format(delta, jsonA) ?? ""; // fallback về "" nếu undefined
  } catch (e) {
    console.error("Failed to generate HTML diff:", e);
    return "<div>Could not generate HTML diff view</div>";
  }
}

export function HtmlDiffView({ diff, jsonA }: HtmlDiffViewProps) {
  const handleCopyHtml = () => {
    const htmlContent = document.querySelector('.html-diff-view')?.innerHTML || '';
    copy(htmlContent);
    alert('HTML copied to clipboard');
  };

  return (
    <>
      <div className="flex justify-end mb-2">
        <Button variant="ghost" size="sm" onClick={handleCopyHtml}>
          Copy HTML
        </Button>
      </div>
      <div
        className="html-diff-view mt-4 p-4 border rounded overflow-auto max-h-[500px] prose prose-sm dark:bg-slate-700 dark:border-slate-600 dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: generateHtmlDiff(diff, jsonA) }}
      />
    </>
  );
}
