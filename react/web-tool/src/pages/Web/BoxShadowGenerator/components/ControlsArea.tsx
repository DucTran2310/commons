import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { ShadowLayer } from "@/pages/Web/BoxShadowGenerator/BoxShadowGenerator";
import { Layers, Palette, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

interface ControlsAreaProps {
  layers: ShadowLayer[];
  addLayer: () => void;
  removeLayer: (id: string) => void;
  toggleLayer: (id: string) => void;
  moveLayer: (id: string, direction: "up" | "down") => void;
  updateLayer: (id: string, property: string, value: number | boolean | string) => void;
}

export default function ControlsArea({
  layers,
  addLayer,
  removeLayer,
  toggleLayer,
  moveLayer,
  updateLayer,
}: ControlsAreaProps) {
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 h-fit sticky top-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Shadow Layers
        </h2>
        <Button size="sm" onClick={addLayer} className="gap-1">
          <Plus className="h-4 w-4" />
          Add Layer
        </Button>
      </div>

      <div className="space-y-8">
        {layers.map((layer, index) => (
          <ShadowLayerControl
            key={layer.id}
            layer={layer}
            index={index}
            totalLayers={layers.length}
            removeLayer={removeLayer}
            toggleLayer={toggleLayer}
            moveLayer={moveLayer}
            updateLayer={updateLayer}
            showColorPicker={showColorPicker}
            setShowColorPicker={setShowColorPicker}
          />
        ))}
      </div>
    </div>
  );
}

function ShadowLayerControl({
  layer,
  index,
  totalLayers,
  removeLayer,
  toggleLayer,
  moveLayer,
  updateLayer,
  showColorPicker,
  setShowColorPicker,
}: {
  layer: ShadowLayer;
  index: number;
  totalLayers: number;
  removeLayer: (id: string) => void;
  toggleLayer: (id: string) => void;
  moveLayer: (id: string, direction: "up" | "down") => void;
  updateLayer: (id: string, property: string, value: number | boolean | string) => void;
  showColorPicker: string | null;
  setShowColorPicker: (id: string | null) => void;
}) {
  return (
    <div
      className={`p-4 rounded-lg border transition-all ${layer.active ? "border-gray-300 bg-gray-50" : "border-gray-200 bg-gray-100/50"}`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={layer.active}
            onCheckedChange={() => toggleLayer(layer.id)}
            className="data-[state=checked]:bg-blue-600"
          />
          <Label className="font-medium">
            Layer {index + 1} {layer.inset && "(Inset)"}
          </Label>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => moveLayer(layer.id, "up")}
            disabled={index === 0}
          >
            ↑
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => moveLayer(layer.id, "down")}
            disabled={index === totalLayers - 1}
          >
            ↓
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeLayer(layer.id)}
            disabled={totalLayers <= 1}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>

      <div className="space-y-4 pl-2">
        <SliderControl
          label={`Horizontal: ${layer.hOffset}px`}
          id={`hOffset-${layer.id}`}
          value={layer.hOffset}
          min={-50}
          max={50}
          onChange={(value) => updateLayer(layer.id, "hOffset", value)}
        />

        <SliderControl
          label={`Vertical: ${layer.vOffset}px`}
          id={`vOffset-${layer.id}`}
          value={layer.vOffset}
          min={-50}
          max={50}
          onChange={(value) => updateLayer(layer.id, "vOffset", value)}
        />

        <SliderControl
          label={`Blur: ${layer.blur}px`}
          id={`blur-${layer.id}`}
          value={layer.blur}
          min={0}
          max={100}
          onChange={(value) => updateLayer(layer.id, "blur", value)}
        />

        <SliderControl
          label={`Spread: ${layer.spread}px`}
          id={`spread-${layer.id}`}
          value={layer.spread}
          min={-50}
          max={50}
          onChange={(value) => updateLayer(layer.id, "spread", value)}
        />

        <div>
          <Label>Color</Label>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer flex items-center justify-center"
              style={{ backgroundColor: layer.color }}
              onClick={() => setShowColorPicker(layer.id)}
            >
              <Palette className="h-4 w-4 text-white/80 mix-blend-overlay" />
            </div>
            <HexColorInput
              color={layer.color}
              onChange={(color) => updateLayer(layer.id, "color", color)}
              className="border rounded-md px-2 py-1 w-full max-w-[120px]"
              prefixed
            />
          </div>
          {showColorPicker === layer.id && (
            <div className="mt-2">
              <HexColorPicker
                color={layer.color}
                onChange={(color) => updateLayer(layer.id, "color", color)}
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id={`inset-${layer.id}`}
            checked={layer.inset}
            onCheckedChange={(checked) =>
              updateLayer(layer.id, "inset", checked)
            }
            className="data-[state=checked]:bg-blue-600"
          />
          <Label htmlFor={`inset-${layer.id}`}>Inset Shadow</Label>
        </div>
      </div>
    </div>
  );
}

function SliderControl({
  label,
  id,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  id: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Slider
        id={id}
        value={[value]}
        max={max}
        min={min}
        step={1}
        onValueChange={(value) => onChange(value[0])}
      />
    </div>
  );
}