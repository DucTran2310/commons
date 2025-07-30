import { DndContext, closestCenter } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useFieldStore } from '@/lib/store';
import { FieldRow } from '@/pages/Development/ToolFakeData/components/FieldRow';

export function FieldConfigurator() {
  const { fields, addField, reorderFields } = useFieldStore();

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      reorderFields(active.id, over.id);
    }
  };

  return (
    <div className="space-y-4">
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          {fields.map((field) => (
            <FieldRow key={field.id} field={field} />
          ))}
        </SortableContext>
      </DndContext>

      <Button variant="outline" onClick={addField}>
        <Plus className="mr-2 h-4 w-4" /> Add Field
      </Button>
    </div>
  );
}