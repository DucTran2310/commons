import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const DocumentationPanel = () => {
  const { t } = useTranslation("docs");
  const [showDocs, setShowDocs] = useState(false);

  // Lấy field examples từ file dịch (returnObjects:true giúp trả về object)
  const fieldExamples = t("fieldTypes.examples", { returnObjects: true }) as Record<string, string>;

  return (
    <div>
      <button
        onClick={() => setShowDocs(!showDocs)}
        className="flex items-center gap-2 px-4 py-2 border rounded-lg 
          dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white
          border-gray-300 hover:bg-gray-50"
      >
        <HelpCircle className="h-4 w-4" />
        {t("documentation")}
      </button>

      {showDocs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto dark:bg-gray-800 bg-white">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold dark:text-white text-gray-900">
                {t("title")}
              </h2>
              <button
                onClick={() => setShowDocs(false)}
                className="dark:text-gray-300 dark:hover:text-white text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* ================= Getting Started ================= */}
              <section>
                <h3 className="text-lg font-semibold mb-3 dark:text-white text-gray-900">
                  {t("gettingStarted.title")}
                </h3>
                <ol className="list-decimal list-inside space-y-2 dark:text-gray-300 text-gray-700">
                  {(t("gettingStarted.steps", { returnObjects: true }) as string[]).map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </section>

              {/* ================= Field Types & Examples ================= */}
              <section>
                <h3 className="text-lg font-semibold mb-3 dark:text-white text-gray-900">
                  {t("fieldTypes.title")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(fieldExamples).map(([field, description]) => (
                    <div
                      key={field}
                      className="p-3 rounded-lg dark:bg-gray-700 bg-gray-50"
                    >
                      <h4 className="font-medium capitalize dark:text-white text-gray-900">
                        {field.replace(/([A-Z])/g, " $1")}
                      </h4>
                      <p className="text-sm mt-1 dark:text-gray-300 text-gray-600">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ================= Advanced Features ================= */}
              <section>
                <h3 className="text-lg font-semibold mb-3 dark:text-white text-gray-900">
                  {t("advanced.title")}
                </h3>
                <div className="space-y-3">
                  {Object.entries(t("advanced.items", { returnObjects: true }) as Record<string, any>).map(([key, value]) => (
                    <div key={key}>
                      <h4 className="font-medium dark:text-white text-gray-900">
                        {value.title}
                      </h4>
                      <p className="text-sm dark:text-gray-300 text-gray-600">
                        {value.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ================= Templates ================= */}
              <section>
                <h3 className="text-lg font-semibold mb-3 dark:text-white text-gray-900">
                  {t("templates.title")}
                </h3>
                <p className="mb-2 dark:text-gray-300 text-gray-700">
                  {t("templates.desc")}
                </p>
                <ul className="list-disc list-inside space-y-1 dark:text-gray-300 text-gray-600">
                  {Object.entries(t("templates.list", { returnObjects: true }) as Record<string, string>).map(([key, val]) => (
                    <li key={key}>
                      <strong>{t(`templates.names.${key}`)}:</strong> {val}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};