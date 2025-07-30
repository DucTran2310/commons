import { Button } from '@/components/ui/button';
import { useFieldStore } from '@/lib/store';
import { generateCSV, generateJSON } from '@/utils/fakerData';
import { FileCode, FileText } from 'lucide-react';

export function ExportButtons() {
  const { generatedData, fields } = useFieldStore();

  const handleExportCSV = () => {
    if (!generatedData) return;
    const csv = generateCSV(generatedData, fields);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fake_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!generatedData) return;
    const json = generateJSON(generatedData);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fake_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-4">
      <Button variant="outline" onClick={handleExportCSV} disabled={!generatedData}
        className="border-light-divider dark:border-dark-divider hover:bg-light-hoverBg dark:hover:bg-dark-hoverBg"
      >
        <FileText className="mr-2 h-4 w-4" /> CSV
      </Button>
      <Button variant="outline" onClick={handleExportJSON} disabled={!generatedData} 
      className="border-light-divider dark:border-dark-divider hover:bg-light-hoverBg dark:hover:bg-dark-hoverBg"
      >
        <FileCode className="mr-2 h-4 w-4" /> JSON
      </Button>
    </div>
  );
}