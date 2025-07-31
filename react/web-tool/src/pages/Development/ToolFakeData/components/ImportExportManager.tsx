import { useFieldStore } from "@/lib/store";
import { Download, Upload, X } from "lucide-react";
import { useState } from "react";

export const ImportExportManager = () => {
  const store = useFieldStore();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [error, setError] = useState('');

  const handleExportConfig = () => {
    const config = {
      fields: store.fields,
      version: '1.0',
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fake-data-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = () => {
    try {
      const config = JSON.parse(importJson);
      if (config.fields && Array.isArray(config.fields)) {
        if (store.fields.length > 0 && !confirm('Importing will replace your current fields. Continue?')) {
          return;
        }
        store.importFields(config.fields);
        setShowImportDialog(false);
        setImportJson('');
        setError('');
      } else {
        setError('Invalid configuration format: missing fields array');
      }
    } catch (error) {
      setError('Invalid JSON format: ' + (error as Error).message);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setShowImportDialog(true)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white
            border-gray-300 hover:bg-gray-50
        `}
      >
        <Upload className="h-4 w-4" />
        Import Config
      </button>
      <button
        onClick={handleExportConfig}
        disabled={store.fields.length === 0}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:opacity-50 dark:text-white
            border-gray-300 hover:bg-gray-50 disabled:opacity-50
        `}
      >
        <Download className="h-4 w-4" />
        Export Config
      </button>

      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col dark:bg-gray-800 bg-white
          `}>
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className={`text-lg font-semibold dark:text-white text-gray-900`}>
                Import Configuration
              </h3>
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setError('');
                }}
                className={`p-1 rounded-full dark:hover:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 text-gray-500`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden p-6">
              <label className={`block text-sm font-medium mb-2 dark:text-gray-300 text-gray-700`}>
                Paste JSON Configuration
              </label>
              <textarea
                value={importJson}
                onChange={(e) => {
                  setImportJson(e.target.value);
                  setError('');
                }}
                className={`w-full h-96 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:text-white
                    bg-white border-gray-300 focus:ring-blue-500
                `}
                placeholder={`Paste your exported configuration here, e.g.:\n{\n  "fields": [\n    {\n      "id": "field1",\n      "name": "firstName",\n      "type": "firstName"\n    }\n  ],\n  "version": "1.0"\n}`}
              />
              
              {error && (
                <div className={`mt-4 p-3 rounded-lg dark:bg-red-900 dark:border-red-800 bg-red-50 border-red-200 border`}>
                  <div className="flex items-start gap-2">
                    <div>
                      <h3 className={`font-medium dark:text-red-100 text-red-800`}>
                        Import Error
                      </h3>
                      <p className={`text-sm dark:text-red-300 text-red-700`}>
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 p-6 border-t">
              <button
                onClick={handleImportConfig}
                disabled={!importJson.trim()}
                className={`flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white`}
              >
                Import
              </button>
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setError('');
                }}
                className={`flex-1 px-4 py-2 border rounded-lg dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white
                    border-gray-300 hover:bg-gray-50`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};