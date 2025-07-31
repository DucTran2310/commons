import { create } from "zustand";
import { BUILT_IN_TEMPLATES, type Field, type Template } from "@/types/fakeData.types";

// =======================
// 📦 STORE ZUSTAND
// =======================
interface FieldStore {
  fields: Field[];
  generatedData: Record<string, any>[];
  templates: Template[];
  history: Field[][];
  historyIndex: number;
  errors: string[];

  // actions
  addField: () => void;
  updateField: (id: string, updates: Partial<Field>) => void;
  removeField: (id: string) => void;
  reorderFields: (activeId: string, overId: string) => void;
  undo: () => void;
  redo: () => void;
  importFields: (fields: Field[]) => void;
  saveAsTemplate: (name: string, description: string) => void;
  loadTemplate: (template: Template) => void;
  setGeneratedData: (data: Record<string, any>[]) => void;

  // helper
  validateFields: (fields: Field[]) => string[];
}

// =======================
// 🏗 TẠO STORE
// =======================
export const useFieldStore = create<FieldStore>((set, get) => ({
  fields: [],
  generatedData: [],
  templates: BUILT_IN_TEMPLATES,
  history: [[]],
  historyIndex: 0,
  errors: [],

  // =======================
  // ⚙️ Hàm validate
  // =======================
  validateFields: (fields) => {
    const errors: string[] = [];
    const fieldNames = new Set<string>();
    const fieldIds = new Set<string>();

    const validateField = (field: Field, path: string = "") => {
      const currentPath = path ? `${path}.${field.name}` : field.name;

      if (!field.name.trim()) {
        errors.push(`Field name cannot be empty at ${currentPath}`);
      }

      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field.name)) {
        errors.push(
          `Invalid field name at ${currentPath}: "${field.name}". Use only letters, numbers, and underscores.`
        );
      }

      if (fieldNames.has(currentPath)) {
        errors.push(`Duplicate field name at ${currentPath}: "${field.name}"`);
      }

      if (fieldIds.has(field.id)) {
        errors.push(`Duplicate field ID: "${field.id}"`);
      }

      fieldNames.add(currentPath);
      fieldIds.add(field.id);

      if (field.fields) {
        field.fields.forEach((nested) => validateField(nested, currentPath));
      }
    };

    fields.forEach((field) => validateField(field));
    return errors;
  },

  // =======================
  // 📝 History helper
  // =======================
  addField: () => {
    const { fields, history, historyIndex, validateFields } = get();
    const newField: Field = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `field${fields.length + 1}`,
      type: "string",
    };

    const newFields = [...fields, newField];
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newFields)));

    set({
      fields: newFields,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      errors: validateFields(newFields),
    });
  },

  // =======================
  // ✏️ Update Field
  // =======================
  updateField: (id, updates) => {
    const { fields, history, historyIndex, validateFields } = get();

    const updateNestedFields = (list: Field[]): Field[] =>
      list.map((field) => {
        if (field.id === id) return { ...field, ...updates };
        if (field.fields) {
          return { ...field, fields: updateNestedFields(field.fields) };
        }
        return field;
      });

    const newFields = updateNestedFields(fields);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newFields)));

    set({
      fields: newFields,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      errors: validateFields(newFields),
    });
  },

  setGeneratedData: (data) => set({ generatedData: data }),

  // =======================
  // ❌ Remove Field
  // =======================
  removeField: (id) => {
    const { fields, history, historyIndex, validateFields } = get();

    const removeNested = (list: Field[]): Field[] =>
      list
        .filter((field) => field.id !== id)
        .map((field) => ({
          ...field,
          fields: field.fields ? removeNested(field.fields) : undefined,
        }));

    const newFields = removeNested(fields);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newFields)));

    set({
      fields: newFields,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      errors: validateFields(newFields),
    });
  },

  // =======================
  // 🔀 Reorder Fields
  // =======================
  reorderFields: (activeId, overId) => {
    const { fields, history, historyIndex } = get();

    const findIndex = (list: Field[], id: string) =>
      list.findIndex((f) => f.id === id);

    const reorder = (list: Field[]): Field[] => {
      const activeIndex = findIndex(list, activeId);
      const overIndex = findIndex(list, overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        const newList = [...list];
        const [moved] = newList.splice(activeIndex, 1);
        newList.splice(overIndex, 0, moved);
        return newList;
      }

      return list.map((f) =>
        f.fields ? { ...f, fields: reorder(f.fields) } : f
      );
    };

    const newFields = reorder(fields);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newFields)));

    set({
      fields: newFields,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  // =======================
  // ⏪ Undo / Redo
  // =======================
  undo: () => {
    const { historyIndex, history, validateFields } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        historyIndex: newIndex,
        fields: history[newIndex],
        errors: validateFields(history[newIndex]),
      });
    }
  },

  redo: () => {
    const { historyIndex, history, validateFields } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        historyIndex: newIndex,
        fields: history[newIndex],
        errors: validateFields(history[newIndex]),
      });
    }
  },

  // =======================
  // 📥 Import Fields
  // =======================
  importFields: (importedFields) => {
    const { history, historyIndex, validateFields } = get();

    const generateNewIds = (list: Field[]): Field[] =>
      list.map((field) => ({
        ...field,
        id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        fields: field.fields ? generateNewIds(field.fields) : undefined,
      }));

    const newFields = generateNewIds(importedFields);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newFields)));

    set({
      fields: newFields,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      errors: validateFields(newFields),
    });
  },

  // =======================
  // 💾 Save Template
  // =======================
  saveAsTemplate: (name, description) => {
    const { fields, templates } = get();
    const newTemplate: Template = {
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      fields: JSON.parse(JSON.stringify(fields)),
      isBuiltIn: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTemplates = [...templates, newTemplate];
    localStorage.setItem(
      "userTemplates",
      JSON.stringify([...JSON.parse(localStorage.getItem("userTemplates") || "[]"), newTemplate])
    );

    set({ templates: updatedTemplates });
  },

  // =======================
  // 📂 Load Template
  // =======================
  loadTemplate: (template) => {
    get().importFields(template.fields);
  },
}));