import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contrastRatio } from '../../../../utils/colorUtils';

interface PalettePreviewCardProps {
  palette: string[];
}

export function PalettePreviewCard({ palette }: PalettePreviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-6 rounded-lg" style={{ backgroundColor: palette[0] }}>
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: palette[palette.length - 1] }}
          >
            Heading Example
          </h3>
          <p
            className="text-sm"
            style={{ color: palette[Math.floor(palette.length / 2)] }}
          >
            This is an example of body text using colors from your palette.
          </p>
          <div className="mt-4 flex gap-2">
            <Button
              style={{
                backgroundColor: palette[1],
                color: contrastRatio(palette[1], '#ffffff') > contrastRatio(palette[1], '#000000') ? 'white' : 'black'
              }}
            >
              Primary
            </Button>
            <Button
              variant="outline"
              style={{
                borderColor: palette[2],
                color: palette[2]
              }}
            >
              Secondary
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div
            className="h-16 rounded flex items-center justify-center text-sm font-medium"
            style={{
              backgroundColor: palette[1],
              color: contrastRatio(palette[1], '#ffffff') > contrastRatio(palette[1], '#000000') ? 'white' : 'black'
            }}
          >
            Button
          </div>
          <div
            className="h-16 rounded flex items-center justify-center text-sm font-medium border"
            style={{
              borderColor: palette[2],
              color: palette[2]
            }}
          >
            Outline Button
          </div>
        </div>
      </CardContent>
    </Card>
  );
}