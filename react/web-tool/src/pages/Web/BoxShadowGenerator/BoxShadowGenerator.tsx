import ControlsArea from "@/pages/Web/BoxShadowGenerator/components/ControlsArea";
import CssOutput from "@/pages/Web/BoxShadowGenerator/components/CssOutput";
import PreviewArea from "@/pages/Web/BoxShadowGenerator/components/PreviewArea";
import { useState } from "react";

export type ShadowLayer = {
  id: string;
  hOffset: number;
  vOffset: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
  active: boolean;
};

export type PreviewElement = {
  width: number;
  height: number;
  borderRadius: number;
  bgColor: string;
};

export default function BoxShadowGenerator() {
  const [layers, setLayers] = useState<ShadowLayer[]>([
    {
      id: crypto.randomUUID(),
      hOffset: 10,
      vOffset: 10,
      blur: 15,
      spread: 0,
      color: "#000000",
      inset: false,
      active: true,
    },
  ]);
  const [previewBg, setPreviewBg] = useState("#ffffff");
  const [previewElement, setPreviewElement] = useState({
    width: 200,
    height: 200,
    borderRadius: 0,
    bgColor: "#e2e8f0",
  });

  // Generate CSS value for all active layers
  const cssValue = layers
    .filter(layer => layer.active)
    .map(layer => 
      `${layer.inset ? "inset " : ""}${layer.hOffset}px ${layer.vOffset}px ${layer.blur}px ${layer.spread}px ${layer.color}`
    )
    .join(", ");

  const updateLayer = (id: string, property: string, value: number | boolean | string) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === id ? { ...layer, [property]: value } : layer
      )
    );
  };

  const addLayer = () => {
    setLayers(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        hOffset: 0,
        vOffset: 0,
        blur: 10,
        spread: 0,
        color: "#00000080",
        inset: false,
        active: true,
      },
    ]);
  };

  const removeLayer = (id: string) => {
    if (layers.length > 1) {
      setLayers(prev => prev.filter(layer => layer.id !== id));
    }
  };

  const toggleLayer = (id: string) => {
    updateLayer(id, "active", !layers.find(layer => layer.id === id)?.active);
  };

  const moveLayer = (id: string, direction: "up" | "down") => {
    const index = layers.findIndex(layer => layer.id === id);
    if (index === -1) return;

    const newLayers = [...layers];
    if (direction === "up" && index > 0) {
      [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
    } else if (direction === "down" && index < newLayers.length - 1) {
      [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
    }
    setLayers(newLayers);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Advanced Box Shadow Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <PreviewArea 
            cssValue={cssValue}
            previewBg={previewBg}
            previewElement={previewElement}
            setPreviewBg={setPreviewBg}
            setPreviewElement={setPreviewElement}
          />
          
          <ControlsArea
            layers={layers}
            addLayer={addLayer}
            removeLayer={removeLayer}
            toggleLayer={toggleLayer}
            moveLayer={moveLayer}
            updateLayer={updateLayer}
          />
        </div>

        <CssOutput cssValue={cssValue} />
      </div>
    </div>
  );
}