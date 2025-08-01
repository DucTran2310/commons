import { useFieldStore } from "@/lib/store";
import { generateFakeData } from "@/utils/fakerData";
import { Eye, RotateCw } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const GeneratorControls = ({
  onPreviewClick
}: {
  onPreviewClick?: () => void
}) => {
  const store = useFieldStore();
  const { t } = useTranslation("fakeData"); 

  const [count, setCount] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (store.fields.length === 0) {
      alert(t('generatorControls.alertNoField'))
      return;
    }

    if (store.errors.length > 0) {
      alert(t('generatorControls.alertFixErrors'));
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate async generation for large datasets
      await new Promise(resolve => setTimeout(resolve, 100));
      const data = generateFakeData(store.fields, count);
      store.setGeneratedData(data);
    } catch (error) {
      console.error('Error generating data:', error);
      alert(t('generatorControls.alertError'));
    } finally {
      setIsGenerating(false);
    }
  };
  
  // 👉 Tính memory (MB)
  const memoryUsed = Math.round(
    (((performance as any).memory?.usedJSHeapSize || 0) / 1024 / 1024) || 0
  );

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg 
      dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200
     border`}>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label className={`text-sm font-medium 
          dark:text-gray-300 text-gray-700
        `}>
          {t('generatorControls.recordsLabel')}:
        </label>
        <input
          type="number"
          min="1"
          max="100000"
          value={count}
          onChange={(e) => {
            const value = Math.min(100000, Math.max(1, Number(e.target.value) || 1));
            setCount(value);
          }}
          className={`w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
              dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:text-white
              bg-white border-gray-300 focus:ring-blue-500
          }`}
        />
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <button
          onClick={handleGenerate}
          disabled={store.fields.length === 0 || isGenerating}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg ${isGenerating
            ? 'bg-green-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center`}
        >
          {isGenerating ? (
            <>
              <RotateCw className="h-4 w-4 animate-spin" />
              {t('generatorControls.generating')}
            </>
          ) : t('generatorControls.generateButton')}
        </button>

        <button
          onClick={onPreviewClick}
          disabled={!store.generatedData || store.generatedData.length === 0}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg
            dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:opacity-50 dark:text-white
              border-gray-300 hover:bg-gray-50 disabled:opacity-50
          } w-full sm:w-auto justify-center`}
        >
          <Eye className="h-4 w-4" />
          {t('generatorControls.previewButton')}
        </button>
      </div>

      <div className={`text-sm
        dark:text-gray-400 text-gray-600
       w-full sm:w-auto text-center sm:text-left`}>
        {store.generatedData?.length > 0 && (
          <>
            {t("generatorControls.recordsGenerated", {
              count: store.generatedData.length,
            })}
            {store.fields.length > 0 && (
              <span className="ml-2">
                ({t("generatorControls.memoryUsed", { memory: memoryUsed })})
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};