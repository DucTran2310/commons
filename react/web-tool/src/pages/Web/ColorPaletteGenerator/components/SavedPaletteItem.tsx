import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SavedPalette } from "@/types/color.types";

interface SavedPaletteItemProps {
  palette: SavedPalette;
  onDelete: (id: string) => void;
  onLoad: (palette: SavedPalette) => void;
  onCopyAll: (colors: string) => void;
}

export function SavedPaletteItem({ palette, onDelete, onLoad, onCopyAll }: SavedPaletteItemProps) {
  return (
    <Card key={palette.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{palette.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(palette.id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
        <CardDescription>
          {palette.baseColor} • {palette.method} • {palette.createdAt.toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-1 h-6 rounded overflow-hidden">
          {palette.palette.map((color) => (
            <div key={color} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" onClick={() => onLoad(palette)}>
            Load
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onCopyAll(palette.palette.join(', '))}
          >
            Copy All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}