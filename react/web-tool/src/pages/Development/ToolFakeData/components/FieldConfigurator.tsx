import { useFieldStore } from "@/lib/store";
import { FieldRow } from "@/pages/Development/ToolFakeData/components/FieldRow";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AlertTriangle, Plus, Redo, Undo } from "lucide-react";
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useTranslation } from "react-i18next";

export const FieldConfigurator = () => {
  const store = useFieldStore();
  const { t } = useTranslation("field");

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      store.reorderFields(active.id, over.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-semibold 
          dark:text-white text-gray-900
        `}>
          {t("configurator.title")}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={store.undo}
            disabled={store.historyIndex <= 0}
            className={`p-2 rounded 
               dark:hover:bg-gray-700 dark:disabled:opacity-50 dark:text-white
                hover:bg-gray-100 disabled:opacity-50
            `}
            title={t("configurator.undo")}
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={store.redo}
            disabled={store.historyIndex >= store.history.length - 1}
            className={`p-2 rounded 
              dark:hover:bg-gray-700 dark:disabled:opacity-50 dark:text-white
                hover:bg-gray-100 disabled:opacity-50
            `}
            title={t("configurator.redo")}
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>
      </div>

      {store.errors.length > 0 && (
        <div className={`p-3 rounded-lg 
          dark:bg-red-900 dark:border-red-800 bg-red-50 border-red-200
         border`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className={`h-5 w-5 
              dark:text-red-300 text-red-600
             mt-0.5`} />
            <div>
              <h3 className={`font-medium 
                dark:text-red-100 text-red-800
              `}>
                {t("configurator.validationErrors")}
              </h3>
              <ul className={`mt-1 text-sm list-disc list-inside 
                dark:text-red-300 text-red-700
              `}>
                {store.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={store.fields} strategy={verticalListSortingStrategy}>
          {store.fields.map((field) => (
            <FieldRow key={field.id} field={field} />
          ))}
        </SortableContext>
      </DndContext>

      <button
        onClick={store.addField}
        className={`flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg w-full justify-center 
          dark:border-gray-600 dark:hover:border-gray-500 dark:text-white
            border-gray-300 hover:border-gray-400
        `}
      >
        <Plus className="h-4 w-4" />
        {t("configurator.addField")}
      </button>
    </div>
  );
};