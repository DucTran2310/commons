import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SavedPaletteItem } from "./SavedPaletteItem";
import type { SavedPalette } from "@/types/color.types";

interface SavedPalettesCardProps {
  savedPalettes: SavedPalette[];
  onDelete: (id: string) => void;
  onLoad: (palette: SavedPalette) => void;
  onCopyAll: (colors: string) => void;
}

export function SavedPalettesCard({ savedPalettes, onDelete, onLoad, onCopyAll }: SavedPalettesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Palettes</CardTitle>
        <CardDescription>Your previously saved color palettes</CardDescription>
      </CardHeader>
      <CardContent>
        {savedPalettes.length === 0 ? (
          <div className="text-center py-8 text-light-sectionHeader dark:text-dark-sectionHeader">
            No saved palettes yet. Generate and save your first palette!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPalettes
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((palette) => (
                <SavedPaletteItem
                  key={palette.id}
                  palette={palette}
                  onDelete={onDelete}
                  onLoad={onLoad}
                  onCopyAll={onCopyAll}
                />
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}