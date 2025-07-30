import { useFieldStore } from '@/lib/store';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateFakeData } from '@/utils/fakerData';

// Thêm interface cho props
interface GeneratorControlsProps {
  onPreviewClick?: () => void;
}

export function GeneratorControls({ onPreviewClick }: GeneratorControlsProps) {
  const { fields, setGeneratedData, generatedData } = useFieldStore();
  const [count, setCount] = useState<number>(100);

  const handleGenerate = () => {
    const data = generateFakeData(fields, count);
    setGeneratedData(data);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span>Records:</span>
          <Input
            type="number"
            min="1"
            max="10000"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <Button onClick={handleGenerate}>Generate</Button>
      </div>
      
      {/* Thêm nút Preview và kết nối với onPreviewClick */}
      <Button 
        variant="outline" 
        onClick={onPreviewClick}
        disabled={!generatedData || generatedData.length === 0}
        className="border-light-divider dark:border-dark-divider hover:bg-light-hoverBg dark:hover:bg-dark-hoverBg"
      >
        Preview Data
      </Button>
    </div>
  );
}