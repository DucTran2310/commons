import { DocumentationPanel } from "@/pages/Development/ToolFakeData/components/DocumentationPanel";
import { ExportButtons } from "@/pages/Development/ToolFakeData/components/ExportButtons";
import { FieldConfigurator } from "@/pages/Development/ToolFakeData/components/FieldConfigurator";
import { GeneratorControls } from "@/pages/Development/ToolFakeData/components/GeneratorControls";
import { ImportExportManager } from "@/pages/Development/ToolFakeData/components/ImportExportManager";
import { PreviewTable } from "@/pages/Development/ToolFakeData/components/PreviewTable";
import { TemplateManager } from "@/pages/Development/ToolFakeData/components/TemplateManager";
import { useState } from "react";

export default function ToolFakeData() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className={`min-h-screen dark:bg-gray-900 bg-gray-100 p-6 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`dark:bg-gray-800 bg-white p-6 rounded-lg shadow-sm transition-colors duration-300`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Enhanced Fake Data Generator
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Configure fields and generate realistic fake data for testing and development
              </p>
            </div>
            <DocumentationPanel />
          </div>
        </div>

        {/* Templates & Import/Export */}
        <div className={`dark:bg-gray-800 bg-white p-6 rounded-lg shadow-sm transition-colors duration-300`}>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <TemplateManager  />
            <ImportExportManager  />
          </div>
        </div>

        {/* Generator Controls */}
        <GeneratorControls 
          onPreviewClick={() => setIsPreviewOpen(true)} 
        />

        {/* Export Options */}
        <div className={`dark:bg-gray-800 bg-white p-4 rounded-lg shadow-sm transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold dark:text-white text-gray-900`}>
              Export Options
            </h2>
            <ExportButtons  />
          </div>
        </div>

        {/* Field Configuration */}
        <div className={`dark:bg-gray-800 bg-white p-6 rounded-lg shadow-sm transition-colors duration-300`}>
          <FieldConfigurator  />
        </div>

        {/* Preview Modal */}
        {isPreviewOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`dark:bg-gray-800 bg-white p-6 rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] flex flex-col transition-colors duration-300`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-semibold dark:text-white text-gray-900`}>
                  Data Preview
                </h2>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className={`dark:text-gray-300 dark:hover:text-white text-gray-500 hover:text-gray-700`}
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <PreviewTable  />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}