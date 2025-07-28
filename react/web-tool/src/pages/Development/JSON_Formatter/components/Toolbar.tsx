import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Check,
  ClipboardCopy,
  Download,
  Expand,
  History,
  Shrink,
} from 'lucide-react';
import React from 'react';

interface ToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  allExpanded: boolean;
  setAllExpanded: (expanded: boolean) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  sortKeys: boolean;
  setSortKeys: (sort: boolean) => void;
  indent: number;
  setIndent: (indent: number) => void;
  outputObj: any;
  copied: boolean;
  handleCopy: () => void;
  handleDownload: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  allExpanded,
  setAllExpanded,
  showHistory,
  setShowHistory,
  sortKeys,
  setSortKeys,
  indent,
  setIndent,
  outputObj,
  copied,
  handleCopy,
  handleDownload,
}) => {
  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search in JSON..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button variant="outline" onClick={() => setAllExpanded(!allExpanded)}>
          {allExpanded ? <Shrink size={16} /> : <Expand size={16} />}
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </Button>

        <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
          <History size={16} />
          History
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <label className="font-medium">Sort Keys</label>
          <Switch checked={sortKeys} onCheckedChange={setSortKeys} />
        </div>

        <div className="flex items-center gap-2">
          <label className="font-medium">Indent Size</label>
          <Input
            type="number"
            min={0}
            max={10}
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="w-16"
          />
        </div>

        <Button onClick={handleCopy} variant="outline" disabled={!outputObj}>
          {copied ? <Check size={16} /> : <ClipboardCopy size={16} />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>

        <Button onClick={handleDownload} variant="outline" disabled={!outputObj}>
          <Download size={16} />
          Download
        </Button>
      </div>
    </>
  );
};