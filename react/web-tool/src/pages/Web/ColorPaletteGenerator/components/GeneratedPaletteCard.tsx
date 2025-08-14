import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorSwatch } from "./ColorSwatch";

interface GeneratedPaletteCardProps {
  palette: string[];
  onCopy: (color: string) => void;
  onExport: (format: 'json' | 'css' | 'svg') => void;
}

export function GeneratedPaletteCard({ palette, onCopy, onExport }: GeneratedPaletteCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Palette</CardTitle>
        <CardDescription>Click on any color to copy its value</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {palette.map((color, index) => (
            <ColorSwatch key={index} color={color} index={index} onCopy={onCopy} />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={() => onExport('json')}>
            <Download className="w-4 h-4 mr-2" /> Export JSON
          </Button>
          <Button variant="outline" onClick={() => onExport('css')}>
            <Download className="w-4 h-4 mr-2" /> Export CSS
          </Button>
          <Button variant="outline" onClick={() => onExport('svg')}>
            <Download className="w-4 h-4 mr-2" /> Export SVG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}