export type PaletteMethod = 'lightness' | 'hue' | 'analogous' | 'complementary' | 'triadic' | 'tetradic';

export type SavedPalette = {
  id: string;
  name: string;
  baseColor: string;
  palette: string[];
  method: PaletteMethod;
  createdAt: Date;
};