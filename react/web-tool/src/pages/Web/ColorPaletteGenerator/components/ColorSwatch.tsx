import { contrastRatio } from "@/utils/colorUtils";

interface ColorSwatchProps {
  color: string;
  index: number;
  onCopy: (color: string) => void;
}

export function ColorSwatch({ color, index, onCopy }: ColorSwatchProps) {
  const contrastWhite = contrastRatio(color, '#ffffff');
  const contrastBlack = contrastRatio(color, '#000000');
  const textColor = contrastWhite > contrastBlack ? 'white' : 'black';

  return (
    <div
      className="rounded-lg overflow-hidden shadow-sm border border-light-divider dark:border-dark-divider cursor-pointer"
      onClick={() => onCopy(color)}
    >
      <div className="h-20 flex items-end p-2" style={{ backgroundColor: color }}>
        <span
          className="text-xs font-medium px-1 rounded"
          style={{
            color: textColor,
            backgroundColor: textColor === 'white' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'
          }}
        >
          {color}
        </span>
      </div>
      <div className="p-2 bg-light-hoverBg dark:bg-dark-hoverBg text-xs">
        <div className="flex justify-between">
          <span>Contrast:</span>
          <span className="font-medium">{contrastWhite.toFixed(1)}:1</span>
        </div>
      </div>
    </div>
  );
}