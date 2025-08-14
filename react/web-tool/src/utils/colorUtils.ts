import type { PaletteMethod } from "@/types/color.types";

export function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

export function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`.toLowerCase();
}

export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb(h: number, s: number, l: number) {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
  };
}

export function generatePalette(hex: string, method: PaletteMethod = 'lightness', count = 7): string[] {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const palette: string[] = [];

  switch (method) {
    case 'lightness':
      for (let i = 0; i < count; i++) {
        const lightness = (i / (count - 1)) * 100;
        const rgb = hslToRgb(h, s, lightness);
        palette.push(rgbToHex(rgb.r, rgb.g, rgb.b));
      }
      break;

    case 'hue':
      const hueStep = 360 / count;
      for (let i = 0; i < count; i++) {
        const hue = (h + i * hueStep) % 360;
        const rgb = hslToRgb(hue, s, l);
        palette.push(rgbToHex(rgb.r, rgb.g, rgb.b));
      }
      break;

    case 'analogous':
      for (let i = -2; i <= 2; i++) {
        const hue = (h + i * 30 + 360) % 360;
        const rgb = hslToRgb(hue, s, l);
        palette.push(rgbToHex(rgb.r, rgb.g, rgb.b));
      }
      break;

    case 'complementary':
      palette.push(hex);
      const compRgb = hslToRgb((h + 180) % 360, s, l);
      palette.push(rgbToHex(compRgb.r, compRgb.g, compRgb.b));
      break;

    case 'triadic':
      palette.push(hex);
      const triad1Rgb = hslToRgb((h + 120) % 360, s, l);
      const triad2Rgb = hslToRgb((h + 240) % 360, s, l);
      palette.push(rgbToHex(triad1Rgb.r, triad1Rgb.g, triad1Rgb.b));
      palette.push(rgbToHex(triad2Rgb.r, triad2Rgb.g, triad2Rgb.b));
      break;

    case 'tetradic':
      palette.push(hex);
      const tetra1Rgb = hslToRgb((h + 90) % 360, s, l);
      const tetra2Rgb = hslToRgb((h + 180) % 360, s, l);
      const tetra3Rgb = hslToRgb((h + 270) % 360, s, l);
      palette.push(rgbToHex(tetra1Rgb.r, tetra1Rgb.g, tetra1Rgb.b));
      palette.push(rgbToHex(tetra2Rgb.r, tetra2Rgb.g, tetra2Rgb.b));
      palette.push(rgbToHex(tetra3Rgb.r, tetra3Rgb.g, tetra3Rgb.b));
      break;
  }

  return palette;
}

// Kiểm tra độ tương phản
export function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function contrastRatio(hex1: string, hex2: string) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
