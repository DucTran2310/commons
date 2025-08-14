import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SavePaletteCardProps {
  paletteName: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
}

export function SavePaletteCard({ paletteName, onNameChange, onSave }: SavePaletteCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Save Palette</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="paletteName">Palette Name</Label>
          <Input
            id="paletteName"
            value={paletteName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="My Awesome Palette"
          />
        </div>
        <Button className="w-full" onClick={onSave}>
          <Save className="w-4 h-4 mr-2" /> Save Palette
        </Button>
      </CardContent>
    </Card>
  );
}