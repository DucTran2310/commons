import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UUIDControls } from "@/pages/Development/UUIDGenerator/components/UUIDControls";
import { UUIDDisplay } from "@/pages/Development/UUIDGenerator/components/UUIDDisplay";
import type { UUIDOptions, UUIDResult } from "@/types/uuid.types";
import { formatUUID, generateUUID } from "@/utils/uuidUtils";
import { useCallback, useEffect, useState } from "react";

export default function UUIDGenerator() {
  const [options, setOptions] = useState<UUIDOptions>({
    version: "v4",
    count: 10,
    upperCase: false,
    format: "standard",
    autoGenerate: false,
    autoGenerateInterval: 5,
    namespace: "",
    name: "",
  });

  const [uuids, setUuids] = useState<UUIDResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateUUIDs = useCallback(() => {
    const newUuids: UUIDResult[] = [];
    for (let i = 0; i < options.count; i++) {
      try {
        let uuid = generateUUID(options.version, options.namespace, options.name);
        if (options.upperCase) uuid = uuid.toUpperCase();
        uuid = formatUUID(uuid, options.format);
        
        newUuids.push({
          id: `${Date.now()}-${i}`,
          uuid,
        });
      } catch (error) {
        console.error("Error generating UUID:", error);
      }
    }
    setUuids(newUuids);
  }, [options]);

  const handleExport = (type: 'csv' | 'txt' | 'zip') => {
    switch (type) {
      case 'csv':
        // Implement CSV export
        break;
      case 'txt':
        // Implement TXT export
        break;
      case 'zip':
        // Implement ZIP export
        break;
    }
  };

  useEffect(() => {
    if (options.autoGenerate) {
      setIsGenerating(true);
      const interval = setInterval(() => {
        generateUUIDs();
      }, options.autoGenerateInterval * 1000);

      return () => {
        clearInterval(interval);
        setIsGenerating(false);
      };
    }
  }, [options.autoGenerate, options.autoGenerateInterval, generateUUIDs]);

  return (
    <Card className="w-[90%] bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <CardHeader>
        <CardTitle>UUID Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <UUIDControls
          options={options}
          onOptionsChange={setOptions}
          onGenerate={generateUUIDs}
          onExport={handleExport}
        />
        <UUIDDisplay
          uuids={uuids}
          format={options.format}
          onCopy={(id) => console.log(`Copied UUID ${id}`)}
        />
      </CardContent>
    </Card>
  );
}