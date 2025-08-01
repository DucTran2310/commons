import { useFieldStore } from "@/lib/store";
import { FIELD_CATEGORIES, type Field, type FieldType } from "@/types/fakeData.types";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical, Settings, Trash2, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { CSS } from '@dnd-kit/utilities';
import ModalType from "@/pages/Development/ToolFakeData/components/ModalType";
import { useTranslation } from "react-i18next";

export const FieldRow = ({ 
  field, 
  depth = 0
}: { 
  field: Field; 
  depth?: number;
}) => {
  const store = useFieldStore();
  const { t } = useTranslation("field");

  const [optionsInput, setOptionsInput] = useState('');
  const [nullPercentage, setNullPercentage] = useState('0');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Parse options when field changes
  useEffect(() => {
    if (field.options) {
      const nullMatch = field.options.match(/(\d+)% NULL/);
      if (nullMatch) {
        setNullPercentage(nullMatch[1]);
        setOptionsInput(field.options.replace(/\d+% NULL,?\s?/, ''));
      } else {
        setOptionsInput(field.options);
        setNullPercentage('0');
      }
    } else {
      setOptionsInput('');
      setNullPercentage('0');
    }
  }, [field.options]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: isDragging ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    store.updateField(field.id, { name: e.target.value });
  };

  const updateOptionsInStore = (options: string, percentage: string) => {
    let newOptions = options;
    const percentageNum = parseInt(percentage) || 0;
    
    if (percentageNum > 0) {
      newOptions = `${percentageNum}% NULL${options ? `, ${options}` : ''}`;
    }
    
    store.updateField(field.id, { options: newOptions });
  };

  const handleOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOptionsInput(value);
    updateOptionsInStore(value, nullPercentage);
  };

  const handleNullPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const percentage = Math.min(100, Math.max(0, parseInt(value) || 0)).toString();
    setNullPercentage(percentage);
    updateOptionsInStore(optionsInput, percentage);
  };

  const handleTypeChange = (newType: FieldType) => {
    store.updateField(field.id, { type: newType });
  };

  const addNestedField = () => {
    if (!field.fields) {
      store.updateField(field.id, { fields: [] });
    }
    const newField: Field = {
      id: `field-${Date.now()}`,
      name: `nested${field.fields ? field.fields.length + 1 : 1}`,
      type: "string",
    };
    store.updateField(field.id, {
      fields: [...(field.fields || []), newField]
    });
  };

  const removeNestedField = (nestedFieldId: string) => {
    store.updateField(field.id, {
      fields: field.fields?.filter(f => f.id !== nestedFieldId)
    });
  };

  const TYPE_LABELS = FIELD_CATEGORIES.reduce((acc, category) => {
    category.types.forEach((type) => {
      acc[type.value as FieldType] = type.label;
    });
    return acc;
  }, {} as Record<FieldType, string>);

  return (
    <div className="space-y-2">
      <div
        ref={setNodeRef}
        style={{ ...style, marginLeft: `${depth * 20}px` }}
        className={`flex items-center gap-2 p-3 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 bg-white border-gray-200 border`}
      >
        <button
          {...attributes}
          {...listeners}
          className={`p-1 rounded dark:hover:bg-gray-600 hover:bg-gray-100
          cursor-grab active:cursor-grabbing`}
        >
          <GripVertical className={`h-4 w-4 dark:text-gray-400 text-gray-500
          `} />
        </button>

        {(field.type === 'object' || field.type === 'array') && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </button>
        )}

        <input
          type="text"
          placeholder={t("row.fieldNamePlaceholder")}
          value={field.name}
          onChange={handleNameChange}
          className={`w-32 px-2 py-1 border rounded focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:text-white
              bg-white border-gray-300 focus:ring-blue-500
          `}
        />

        <button
          onClick={() => setIsModalOpen(true)}
          className={`w-36 px-2 py-1 border rounded text-left focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:text-white
              bg-white border-gray-300 focus:ring-blue-500
          `}
        >
          {TYPE_LABELS[field.type] || field.type}
        </button>

        <ModalType
          field={field}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onTypeChange={handleTypeChange}
        />

        <div className="relative w-20">
          <input
            type="number"
            placeholder={t("row.nullPlaceholder")}
            value={nullPercentage}
            onChange={handleNullPercentageChange}
            min="0"
            max="100"
            className={`w-full px-2 py-1 pr-6 border rounded focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 text-white
                bg-white border-gray-300 focus:ring-blue-500
            `}
          />
          <span className={`absolute right-2 top-2 text-xs dark:text-gray-400 text-gray-500
          `}>%</span>
        </div>

        <input
          type="text"
          placeholder={t("row.optionsPlaceholder")}
          value={optionsInput}
          onChange={handleOptionsChange}
          className={`flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:text-white
              bg-white border-gray-300 focus:ring-blue-500
          `}
        />

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`p-1 rounded dark:hover:bg-gray-600 dark:text-gray-300
              hover:bg-gray-100 text-gray-600
          `}
          title={t("row.advancedTitle")}
        >
          <Settings className="h-4 w-4" />
        </button>

        <button
          onClick={() => store.removeField(field.id)}
          className={`p-1 rounded dark:hover:bg-red-900 dark:text-red-400 hover:bg-red-100 text-red-600
          `}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {showAdvanced && (
        <div className={`ml-8 p-3 rounded-lg space-y-2 dark:bg-gray-700 bg-gray-50
        `}>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={field.unique || false}
              onChange={(e) => store.updateField(field.id, { unique: e.target.checked })}
              className={'dark:accent-blue-500'}
            />
            <span className={`text-sm dark:text-gray-300 text-gray-700'
            `}>
              {t("row.unique")}
            </span>
          </label>
          
          {field.type === 'string' && (
            <div>
              <label className={`block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700
              `}>
                {t("row.pattern")}
              </label>
              <input
                type="text"
                placeholder={t("row.patternPlaceholder")}
                value={field.pattern || ''}
                onChange={(e) => store.updateField(field.id, { pattern: e.target.value })}
                className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:text-white
                    bg-white border-gray-300 focus:ring-blue-500
                `}
              />
            </div>
          )}
          
          {(field.type === 'number' || field.type === 'age') && (
            <div>
              <label className={`block text-sm font-medium mb-1 dark:text-gray-300 text-gray-700
              `}>
                {t("row.distributionOptions.uniform")}
              </label>
              <select
                value={field.distribution || 'uniform'}
                onChange={(e) => store.updateField(field.id, { distribution: e.target.value as any })}
                className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500 dark:text-white
                    bg-white border-gray-300 focus:ring-blue-500
                `}
              >
                <option value="uniform">{t("row.distributionOptions.uniform")}</option>
                <option value="normal">{t("row.distributionOptions.normal")}</option>
                <option value="exponential">{t("row.distributionOptions.exponential")}</option>
              </select>
            </div>
          )}
        </div>
      )}

      {(field.type === 'object' || field.type === 'array') && isExpanded && (
        <div className="ml-8 space-y-2">
          {field.fields?.map((nestedField) => (
            <FieldRow 
              key={nestedField.id} 
              field={nestedField} 
              depth={depth + 1}
            />
          ))}
          <button
            onClick={addNestedField}
            className={`ml-8 flex items-center gap-2 px-3 py-1 border-2 border-dashed rounded-lg dark:border-gray-600 dark:hover:border-gray-500 text-white' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Plus className="h-3 w-3" />
            {t("row.addNestedField")}
          </button>
        </div>
      )}
    </div>
  );
};