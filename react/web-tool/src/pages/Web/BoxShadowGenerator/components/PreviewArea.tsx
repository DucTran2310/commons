import { HexColorInput } from "react-colorful";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { PreviewElement } from "@/pages/Web/BoxShadowGenerator/BoxShadowGenerator";
import { useState } from "react";

interface PreviewAreaProps {
  cssValue: string;
  previewBg: string;
  previewElement: PreviewElement;
  setPreviewBg: (color: string) => void;
  setPreviewElement: React.Dispatch<React.SetStateAction<PreviewElement>>;
}

export default function PreviewArea({
  cssValue,
  previewBg,
  previewElement,
  setPreviewBg,
  setPreviewElement,
}: PreviewAreaProps) {
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="previewBg">Background Color</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
                style={{ backgroundColor: previewBg }}
                onClick={() => setShowColorPicker("previewBg")}
              />
              <HexColorInput
                id="previewBg"
                color={previewBg}
                onChange={setPreviewBg}
                className="border rounded-md px-2 py-1 w-full max-w-[120px]"
                prefixed
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="elementBg">Element Color</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
                style={{ backgroundColor: previewElement.bgColor }}
                onClick={() => setShowColorPicker("elementBg")}
              />
              <HexColorInput
                id="elementBg"
                color={previewElement.bgColor}
                onChange={(color) => setPreviewElement(prev => ({ ...prev, bgColor: color }))}
                className="border rounded-md px-2 py-1 w-full max-w-[120px]"
                prefixed
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="elementWidth">Width: {previewElement.width}px</Label>
            <Slider
              id="elementWidth"
              value={[previewElement.width]}
              max={400}
              min={50}
              step={1}
              onValueChange={(value) => setPreviewElement(prev => ({ ...prev, width: value[0] }))}
            />
          </div>
          
          <div>
            <Label htmlFor="elementHeight">Height: {previewElement.height}px</Label>
            <Slider
              id="elementHeight"
              value={[previewElement.height]}
              max={400}
              min={50}
              step={1}
              onValueChange={(value) => setPreviewElement(prev => ({ ...prev, height: value[0] }))}
            />
          </div>
          
          <div>
            <Label htmlFor="borderRadius">Border Radius: {previewElement.borderRadius}px</Label>
            <Slider
              id="borderRadius"
              value={[previewElement.borderRadius]}
              max={100}
              min={0}
              step={1}
              onValueChange={(value) => setPreviewElement(prev => ({ ...prev, borderRadius: value[0] }))}
            />
          </div>
        </div>
        
        <div 
          className="w-full flex items-center justify-center p-8 rounded-lg"
          style={{ backgroundColor: previewBg }}
        >
          <div
            className="flex items-center justify-center transition-all"
            style={{
              width: `${previewElement.width}px`,
              height: `${previewElement.height}px`,
              borderRadius: `${previewElement.borderRadius}px`,
              backgroundColor: previewElement.bgColor,
              boxShadow: cssValue,
            }}
          >
            <div className="text-center p-4 bg-white/80 rounded">
              <p className="text-sm text-gray-600">Shadow Preview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}