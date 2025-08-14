import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { PaletteMethod } from "@/types/color.types";

interface ColorSettingsCardProps {
  baseColor: string;
  method: PaletteMethod;
  shadesCount: number;
  onBaseColorChange: (color: string) => void;
  onMethodChange: (method: PaletteMethod) => void;
  onShadesCountChange: (count: number) => void;
  onRegenerate: () => void;
  onRandomColor: () => void;
}

export function ColorSettingsCard({
  baseColor,
  method,
  shadesCount,
  onBaseColorChange,
  onMethodChange,
  onShadesCountChange,
  onRegenerate,
  onRandomColor
}: ColorSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="baseColor">Base Color</Label>
            <div className="flex gap-2">
              <Input
                id="baseColor"
                value={baseColor}
                onChange={(e) => onBaseColorChange(e.target.value)}
                placeholder="#3b82f6"
                className="w-32"
              />
              <input
                type="color"
                value={baseColor}
                onChange={(e) => onBaseColorChange(e.target.value)}
                className="w-12 h-10 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <Label>Generation Method</Label>
            <Select value={method} onValueChange={(v) => onMethodChange(v as PaletteMethod)} >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="lightness">Lightness Scale</SelectItem>
                <SelectItem value="hue">Hue Spectrum</SelectItem>
                <SelectItem value="analogous">Analogous</SelectItem>
                <SelectItem value="complementary">Complementary</SelectItem>
                <SelectItem value="triadic">Triadic</SelectItem>
                <SelectItem value="tetradic">Tetradic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(method === 'lightness' || method === 'hue') && (
          <div className="space-y-2">
            <Label>Number of Shades: {shadesCount}</Label>
            <Slider
              value={[shadesCount]}
              onValueChange={([value]) => onShadesCountChange(value)}
              min={3}
              max={12}
              step={1}
              className="[&>div:first-child]:bg-gray-300 [&>div:first-child>div]:bg-black"
            />
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button onClick={onRegenerate}>
            <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
          </Button>
          <Button variant="outline" onClick={onRandomColor}>
            Random Color
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}