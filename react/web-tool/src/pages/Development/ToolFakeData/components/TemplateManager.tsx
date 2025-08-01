import { useFieldStore } from "@/lib/store";
import type { Template } from "@/types/fakeData.types";
import { BookTemplate, Save, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const TemplateManager = () => {
  const store = useFieldStore();
  const { t } = useTranslation("fakeData");

  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert(t("templateManager.nameEmpty"));
      return;
    }
    if (store.fields.length === 0) {
      alert(t("templateManager.emptyTemplate"));
      return;
    }
    store.saveAsTemplate(templateName, templateDescription);
    setTemplateName("");
    setTemplateDescription("");
    setShowSaveDialog(false);
  };

  const handleLoadTemplate = (template: Template) => {
    if (
      store.fields.length > 0 &&
      !confirm(t("templateManager.confirmReplace"))
    ) {
      return;
    }
    store.loadTemplate(template);
    setShowTemplates(false);
  };

  const filteredTemplates = store.templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white
                     bg-blue-600 hover:bg-blue-700 text-white"
        >
          <BookTemplate className="h-4 w-4" />
          {t("templateManager.templates")}
        </button>
        <button
          onClick={() => setShowSaveDialog(true)}
          disabled={store.fields.length === 0}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:opacity-50 dark:text-white 
                     border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {t("templateManager.saveAsTemplate")}
        </button>
      </div>

      {/* Templates Panel */}
      {showTemplates && (
        <div className="border rounded-lg p-4 dark:bg-gray-800 dark:border-gray-700 bg-gray-50 border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium dark:text-white text-gray-900">
              {t("templateManager.availableTemplates")}
            </h3>
            <button
              onClick={() => setShowTemplates(false)}
              className="p-1 rounded-full dark:hover:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder={t("templateManager.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:text-white 
                         bg-white border-gray-300 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-3 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="p-4 text-center dark:text-gray-400 text-gray-500">
              {t("templateManager.noTemplates")}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="p-3 rounded-lg dark:bg-gray-700 dark:border-gray-600 bg-white border-gray-200 border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium dark:text-white text-gray-900">
                      {template.name}
                    </h4>
                    {template.isBuiltIn && (
                      <span className="text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200 bg-blue-100 text-blue-800">
                        {t("templateManager.builtIn")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-3 dark:text-gray-300 text-gray-600">
                    {template.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoadTemplate(template)}
                      className="flex-1 px-3 py-1 rounded hover:bg-blue-700 text-sm dark:bg-blue-600 dark:text-white bg-blue-600 text-white"
                    >
                      {t("templateManager.load")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg max-w-md w-full mx-4 dark:bg-gray-800 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold dark:text-white text-gray-900">
                {t("templateManager.saveTemplate")}
              </h3>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="p-1 rounded-full dark:hover:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 text-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">
                  {t("templateManager.templateName")}
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:text-white 
                             bg-white border-gray-300 focus:ring-blue-500"
                  placeholder={t("templateManager.enterTemplateName")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700">
                  {t("templateManager.description")}
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:text-white
                             bg-white border-gray-300 focus:ring-blue-500"
                  placeholder={t("templateManager.enterDescription")}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveTemplate}
                disabled={!templateName.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white"
              >
                {t("common.save")}
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2 border rounded-lg dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white
                           border-gray-300 hover:bg-gray-50"
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};