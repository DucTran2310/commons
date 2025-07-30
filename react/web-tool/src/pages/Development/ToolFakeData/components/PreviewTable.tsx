// components/PreviewTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useFieldStore } from '@/lib/store';

export function PreviewTable() {
  const { generatedData, fields } = useFieldStore();

  if (!generatedData || generatedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No data generated yet
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden border-light-divider dark:border-dark-divider">
      <div className="overflow-auto max-h-[60vh]">
        <Table>
          <TableHeader className="sticky top-0 bg-light-background dark:bg-dark-background">
            <TableRow className="hover:bg-light-hoverBg dark:hover:bg-dark-hoverBg">
              {fields.map((field) => (
                <TableHead key={field.id}>{field.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {generatedData.slice(0, 10).map((row, i) => (
              <TableRow key={i}
                className="hover:bg-light-hoverBg dark:hover:bg-dark-hoverBg"
              >
                {fields.map((field) => (
                  <TableCell key={field.id} className="whitespace-nowrap">
                    {row[field.name]?.toString()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {generatedData.length > 10 && (
        <div className="p-2 text-sm text-muted-foreground text-center">
          Showing 10 of {generatedData.length} records
        </div>
      )}
    </div>
  );
}