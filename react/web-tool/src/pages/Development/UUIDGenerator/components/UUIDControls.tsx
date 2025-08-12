"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OutputFormat, UUIDOptions, UUIDVersion } from "@/types/uuid.types";
import { Slider } from "@/components/ui/slider";

interface UUIDControlsProps {
  options: UUIDOptions;
  onOptionsChange: (options: UUIDOptions) => void;
  onGenerate: () => void;
  onExport: (type: 'csv' | 'txt' | 'zip') => void;
}

export function UUIDControls({
  options,
  onOptionsChange,
  onGenerate,
  onExport,
}: UUIDControlsProps) {
  const handleVersionChange = (value: UUIDVersion) => {
    onOptionsChange({ ...options, version: value });
  };

  const handleFormatChange = (value: OutputFormat) => {
    onOptionsChange({ ...options, format: value });
  };

  const handleCountChange = (value: number) => {
    if (value >= 1 && value <= 10000) {
      onOptionsChange({ ...options, count: value });
    }
  };

  const handleIntervalChange = (value: number) => {
    if (value >= 1 && value <= 60) {
      onOptionsChange({ ...options, autoGenerateInterval: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Version Selection */}
        <div className="space-y-2">
          <Label>UUID Version</Label>
          <Select value={options.version} onValueChange={handleVersionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="v1">Version 1 (Time-based)</SelectItem>
              <SelectItem value="v4">Version 4 (Random)</SelectItem>
              <SelectItem value="v5">Version 5 (Namespace)</SelectItem>
              <SelectItem value="v7">Version 7 (Sortable)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <Label>Output Format</Label>
          <Select value={options.format} onValueChange={handleFormatChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="no-dashes">No Dashes</SelectItem>
              <SelectItem value="base64">Base64</SelectItem>
              <SelectItem value="hex">Hex</SelectItem>
              <SelectItem value="url-safe">URL Safe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Count Selection */}
        <div className="space-y-2">
          <Label>Number of UUIDs: {options.count}</Label>
          <Slider
            min={1}
            max={10000}
            step={1}
            value={[options.count]}
            onValueChange={([value]) => handleCountChange(value)}
          />
        </div>

        {/* Namespace Input (for v5) */}
        {options.version === 'v5' && (
          <>
            <div className="space-y-2">
              <Label>Namespace</Label>
              <Input
                value={options.namespace || ''}
                onChange={(e) =>
                  onOptionsChange({ ...options, namespace: e.target.value })
                }
                placeholder="Enter namespace UUID"
              />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={options.name || ''}
                onChange={(e) =>
                  onOptionsChange({ ...options, name: e.target.value })
                }
                placeholder="Enter name"
              />
            </div>
          </>
        )}

        {/* Auto-generate Controls */}
        <div className="flex items-center space-x-4">
          <Switch
            checked={options.autoGenerate}
            onCheckedChange={(checked) =>
              onOptionsChange({ ...options, autoGenerate: checked })
            }
          />
          <Label>Auto-generate</Label>
        </div>

        {options.autoGenerate && (
          <div className="space-y-2">
            <Label>Interval (seconds): {options.autoGenerateInterval}</Label>
            <Slider
              min={1}
              max={60}
              step={1}
              value={[options.autoGenerateInterval]}
              onValueChange={([value]) => handleIntervalChange(value)}
            />
          </div>
        )}

        {/* Case Toggle */}
        <div className="flex items-center space-x-4">
          <Switch
            checked={options.upperCase}
            onCheckedChange={(checked) =>
              onOptionsChange({ ...options, upperCase: checked })
            }
          />
          <Label>Uppercase</Label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={onGenerate}>Generate UUIDs</Button>
        <Button variant="outline" onClick={() => onExport('txt')}>
          Export as TXT
        </Button>
        <Button variant="outline" onClick={() => onExport('csv')}>
          Export as CSV
        </Button>
        <Button variant="outline" onClick={() => onExport('zip')}>
          Export as ZIP
        </Button>
      </div>
    </div>
  );
}