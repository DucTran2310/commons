import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { Field, FieldType } from "@/types/fakeData.types";

type Store = {
  fields: Field[];
  generatedData: Record<string, any>[] | null;
  addField: () => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<Omit<Field, "id">>) => void;
  reorderFields: (fromId: string, toId: string) => void;
  setGeneratedData: (data: Record<string, any>[] | null) => void;
  updateNestedField: (
    parentId: string,
    fieldId: string,
    updates: Partial<Field>
  ) => void;
};

export const useFieldStore = create<Store>((set) => ({
  fields: [
    { id: uuidv4(), name: "id", type: "id" },
    { id: uuidv4(), name: "name", type: "fullName" },
    { id: uuidv4(), name: "email", type: "email", options: "@example.com" },
  ],
  generatedData: null,

  addField: () =>
    set((state) => ({
      fields: [
        ...state.fields,
        {
          id: uuidv4(),
          name: `field_${state.fields.length + 1}`,
          type: "text" as FieldType,
        },
      ],
    })),

  removeField: (id) =>
    set((state) => ({
      fields: state.fields.filter((field) => field.id !== id),
    })),

  updateField: (id, updates) =>
    set((state) => ({
      fields: state.fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    })),

  reorderFields: (fromId, toId) =>
    set((state) => {
      const fromIndex = state.fields.findIndex((f) => f.id === fromId);
      const toIndex = state.fields.findIndex((f) => f.id === toId);

      if (fromIndex === -1 || toIndex === -1) return state;

      const newFields = [...state.fields];
      const [movedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedField);

      return { fields: newFields };
    }),

  setGeneratedData: (data) => set({ generatedData: data }),

  // In your store implementation (e.g., useFieldStore.ts)
  updateNestedField: (
    parentId: string,
    fieldId: string,
    updates: Partial<Field>
  ) => {
    set((state) => {
      const updateRecursive = (fields: Field[]): Field[] => {
        return fields.map((f) => {
          if (f.id === parentId && f.fields) {
            return {
              ...f,
              fields: f.fields.map((nested) =>
                nested.id === fieldId ? { ...nested, ...updates } : nested
              ),
            };
          }
          if (f.fields) {
            return { ...f, fields: updateRecursive(f.fields) };
          }
          return f;
        });
      };
      return { fields: updateRecursive(state.fields) };
    });
  },
}));
