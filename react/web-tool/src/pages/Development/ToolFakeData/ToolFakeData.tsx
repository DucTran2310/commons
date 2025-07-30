import { ModalCustom } from "@/components/common/Modal/ModalCustom";
import { ExportButtons } from "@/pages/Development/ToolFakeData/components/ExportButtons";
import { FieldConfigurator } from "@/pages/Development/ToolFakeData/components/FieldConfigurator";
import { GeneratorControls } from "@/pages/Development/ToolFakeData/components/GeneratorControls";
import { PreviewTable } from "@/pages/Development/ToolFakeData/components/PreviewTable";
import { useState } from "react";

export default function ToolFakeData() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="container mx-auto p-8 space-y-8 h-full bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Fake Data Generator</h1>
          <p className="text-muted-foreground">
            Configure fields and generate realistic fake data for testing and development
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-8">
        <div className="flex items-center gap-4">
          <GeneratorControls 
            onPreviewClick={() => setIsPreviewOpen(true)}
          />
          <ExportButtons />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <FieldConfigurator />
        </div>
      </div>

      <ModalCustom
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Preview Data"
      >
        <PreviewTable />
      </ModalCustom>
    </div>
  );
}