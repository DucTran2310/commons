import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PaletteMethod, SavedPalette } from "@/types/color.types";
import { generatePalette } from "@/utils/colorUtils";
import { Palette } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ColorSettingsCard } from "./components/ColorSettingsCard";
import { GeneratedPaletteCard } from "./components/GeneratedPaletteCard";
import { PalettePreviewCard } from "./components/PalettePreviewCard";
import { SavePaletteCard } from "./components/SavePaletteCard";
import { SavedPalettesCard } from "./components/SavedPalettesCard";

const DEFAULT_COLOR = '#3b82f6';
const DEFAULT_METHOD = 'lightness';
const DEFAULT_SHADES_COUNT = 7;

export default function AdvancedColorPaletteGenerator() {
  // State management
  const [baseColor, setBaseColor] = useState(DEFAULT_COLOR);
  const [palette, setPalette] = useState<string[]>(() => generatePalette(DEFAULT_COLOR));
  const [method, setMethod] = useState<PaletteMethod>(DEFAULT_METHOD);
  const [shadesCount, setShadesCount] = useState(DEFAULT_SHADES_COUNT);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [paletteName, setPaletteName] = useState('');

  // Load saved palettes from localStorage
  useEffect(() => {
    const loadPalettes = () => {
      const saved = localStorage.getItem('colorPalettes');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSavedPalettes(parsed.map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt)
          })));
        } catch (e) {
          console.error('Failed to parse saved palettes', e);
        }
      }
    };

    loadPalettes();
  }, []);

  // Generate palette when settings change
  useEffect(() => {
    setPalette(generatePalette(baseColor, method, shadesCount));
  }, [baseColor, method, shadesCount]);

  // Utility functions
  const downloadFile = useCallback((filename: string, type: string, content: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Event handlers
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast(`${text} copied to clipboard`);
  }, []);

  const exportPalette = useCallback((format: 'json' | 'css' | 'svg') => {
    const date = new Date().toISOString().split('T')[0];
    const filename = `palette-${baseColor.replace('#', '')}-${date}`;
    
    const paletteData = {
      baseColor,
      palette,
      method,
      generatedAt: new Date().toISOString()
    };

    switch (format) {
      case 'json':
        downloadFile(`${filename}.json`, 'application/json', JSON.stringify(paletteData, null, 2));
        break;
      case 'css':
        const css = `:root {\n${palette.map((color, i) => `  --color-${i + 1}: ${color};`).join('\n')}\n}`;
        downloadFile(`${filename}.css`, 'text/css', css);
        break;
      case 'svg':
        const svgWidth = 100 * palette.length;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="100" viewBox="0 0 ${svgWidth} 100">
          ${palette.map((color, i) => `<rect x="${i * 100}" width="100" height="100" fill="${color}" />`).join('\n')}
        </svg>`;
        downloadFile(`${filename}.svg`, 'image/svg+xml', svg);
        break;
    }
  }, [baseColor, palette, method, downloadFile]);

  const savePalette = useCallback(() => {
    if (!paletteName.trim()) {
      toast("Please enter a name for your palette");
      return;
    }

    const newPalette: SavedPalette = {
      id: Date.now().toString(),
      name: paletteName,
      baseColor,
      palette,
      method,
      createdAt: new Date()
    };

    const updatedPalettes = [...savedPalettes, newPalette];
    setSavedPalettes(updatedPalettes);
    localStorage.setItem('colorPalettes', JSON.stringify(updatedPalettes));
    setPaletteName('');
    toast("Your palette has been saved");
  }, [paletteName, baseColor, palette, method, savedPalettes]);

  const deletePalette = useCallback((id: string) => {
    const updatedPalettes = savedPalettes.filter(p => p.id !== id);
    setSavedPalettes(updatedPalettes);
    localStorage.setItem('colorPalettes', JSON.stringify(updatedPalettes));
    toast("Palette has been removed");
  }, [savedPalettes]);

  const loadPalette = useCallback((palette: SavedPalette) => {
    setBaseColor(palette.baseColor);
    setMethod(palette.method);
    setPalette(palette.palette);
    setShadesCount(palette.palette.length);
    toast(`${palette.name} palette has been loaded`);
  }, []);

  const generateRandomColor = useCallback(() => {
    setBaseColor(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
  }, []);

  const regeneratePalette = useCallback(() => {
    setPalette(generatePalette(baseColor, method, shadesCount));
  }, [baseColor, method, shadesCount]);

  return (
    <div className="min-h-screen bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text transition-colors mx-8 mt-[12rem] mb-8 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center my-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Palette className="w-6 h-6" />
            Advanced Color Palette Generator
          </h1>
        </div>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-xs">
            <TabsTrigger value="generator">Generator</TabsTrigger>
            <TabsTrigger value="saved">Saved Palettes</TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ColorSettingsCard
                  baseColor={baseColor}
                  method={method}
                  shadesCount={shadesCount}
                  onBaseColorChange={setBaseColor}
                  onMethodChange={setMethod}
                  onShadesCountChange={setShadesCount}
                  onRegenerate={regeneratePalette}
                  onRandomColor={generateRandomColor}
                />

                <GeneratedPaletteCard 
                  palette={palette} 
                  onCopy={copyToClipboard}
                  onExport={exportPalette}
                />
              </div>

              <div className="space-y-6">
                <SavePaletteCard
                  paletteName={paletteName}
                  onNameChange={setPaletteName}
                  onSave={savePalette}
                />

                <PalettePreviewCard palette={palette} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <SavedPalettesCard
              savedPalettes={savedPalettes}
              onDelete={deletePalette}
              onLoad={loadPalette}
              onCopyAll={copyToClipboard}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}