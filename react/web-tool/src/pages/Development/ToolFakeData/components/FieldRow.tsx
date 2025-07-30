import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FIELD_CATEGORIES } from '@/constants/typeData.constants';
import { useFieldStore } from '@/lib/store';
import ModalType from '@/pages/Development/ToolFakeData/components/ModalType';
import type { Field, FieldType } from '@/types/fakeData.types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function FieldRow({ field, depth = 0, parentId }: { field: Field; depth?: number; parentId?: string }) {
  const { updateField, removeField, updateNestedField } = useFieldStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optionsInput, setOptionsInput] = useState(field.options || '');
  const [nullPercentage, setNullPercentage] = useState('');

  useEffect(() => {
    const nullMatch = field.options?.match(/(\d+)% NULL/);
    if (nullMatch) {
      setNullPercentage(nullMatch[1]);
      setOptionsInput(field.options?.replace(/\d+% NULL,?\s?/, '') || '');
    } else {
      setOptionsInput(field.options || '');
    }
  }, [field.options]);

  const TYPE_LABELS = FIELD_CATEGORIES.reduce((acc, category) => {
    category.types.forEach((type) => {
      acc[type.value as FieldType] = type.label;
    });
    return acc;
  }, {} as Record<FieldType, string>);

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
    if (parentId) {
      updateNestedField(parentId, field.id, { name: e.target.value });
    } else {
      updateField(field.id, { ...field, name: e.target.value });
    }
  };

  const handleOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOptionsInput(value);
    updateOptions(value);
  };

  const handleNullPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const percentage = Math.min(100, Math.max(0, parseInt(value) || 0));
    setNullPercentage(percentage.toString());
    updateOptions(optionsInput, percentage.toString());
  };

  const updateOptions = (options: string, percentage: string = nullPercentage) => {
    let newOptions = options;
    if (percentage && parseInt(percentage) > 0) {
      newOptions = `${percentage}% NULL${options ? `, ${options}` : ''}`;
    }
    updateField(field.id, { ...field, options: newOptions });
  };

  const handleAddNestedField = () => {
    const newField: Field = {
      id: `field-${Date.now()}`,
      name: 'newField',
      type: 'string',
    };
    updateField(field.id, {
      ...field,
      fields: [...(field.fields || []), newField],
    });
  };

  const handleTypeChange = (value: FieldType) => {
    const updates: Partial<Field> = { type: value };

    if (value === 'object' || value === 'array') {
      updates.fields = updates.fields || [];
      updates.isArray = value === 'array';
    } else {
      updates.fields = undefined;
      updates.isArray = undefined;
    }

    updateField(field.id, { ...field, ...updates });
  };

  const getInputProps = () => {
    switch (field.type) {
      case 'email':
        return {
          type: 'email',
          placeholder: 'Domain (e.g., example.com)',
          pattern: '[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
        };
      case 'date':
        return {
          type: 'text',
          placeholder: 'Format: dd/mm/yyyy or mm/dd/yyyy',
          pattern: '(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}|(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/\\d{4}'
        };
      case 'age':
      case 'number':
        return {
          type: 'number',
          placeholder: 'Range (e.g., 18-65)',
          pattern: '\\d+-\\d+'
        };
      case 'boolean':
        return {
          type: 'text',
          placeholder: 'true or false',
          pattern: 'true|false'
        };
      case 'phone':
        return {
          type: 'tel',
          placeholder: 'Phone format',
          pattern: '[0-9\\-\\+\\s]+'
        };
      default:
        return {
          type: 'text',
          placeholder: 'Options'
        };
    }
  };

  const inputProps = getInputProps();

  return (
    <div className="space-y-2">
      <div
        ref={setNodeRef}
        style={{ ...style, marginLeft: `${depth * 20}px` }}
        className="flex items-center gap-2 p-2 border rounded-md bg-light-background dark:bg-dark-background border-light-divider dark:border-dark-divider"
      >
        <button
          {...attributes}
          {...listeners}
          className="p-1 rounded hover:bg-accent cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        <Input
          placeholder="Field name"
          value={field.name}
          onChange={handleNameChange}
          className="w-40"
        />

        <Button
          variant="outline"
          className="w-40 justify-start"
          onClick={() => setIsModalOpen(true)}
        >
          {TYPE_LABELS[field.type] || "Select type"}
        </Button>

        <div className="relative w-20">
          <Input
            type="number"
            placeholder="NULL %"
            value={nullPercentage}
            onChange={handleNullPercentageChange}
            min="0"
            max="100"
            className="pr-6"
          />
          <span className="absolute right-2 top-2 text-xs text-muted-foreground">%</span>
        </div>

        <Input
          {...inputProps}
          value={optionsInput}
          onChange={handleOptionsChange}
          className="flex-1"
        />

        {(field.type === 'object' || field.type === 'array') && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddNestedField}
            title="Add nested field"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}

        <Button variant="ghost" size="icon" onClick={() => removeField(field.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>

        <ModalType
          field={field}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          onTypeChange={handleTypeChange}
        />
      </div>

      {field.fields?.map((nestedField) => (
        <FieldRow
          key={nestedField.id}
          field={nestedField}
          depth={depth + 1}
          parentId={field.id}  // Pass the current field as parent
        />
      ))}
    </div>
  );
}