import { useState } from "react";

export function useUndoRedo<T>(initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [undoStack, setUndoStack] = useState<T[]>([]);
  const [redoStack, setRedoStack] = useState<T[]>([]);

  const update = (newVal: T) => {
    setUndoStack((prev) => [...prev, value]);
    setValue(newVal);
    setRedoStack([]);
    log("UPDATE", newVal);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, value]);
    setValue(last);
    log("UNDO", last);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, value]);
    setValue(last);
    log("REDO", last);
  };

  const clear = () => {
    setUndoStack([]);
    setRedoStack([]);
    setValue(initial);
    log("CLEAR", value);
  };

  const log = (action: string, payload: any) => {
    console.log(`[${new Date().toISOString()}] ${action}`, payload);
  };

  return { value, update, undo, redo, clear, canUndo: undoStack.length > 0, canRedo: redoStack.length > 0 };
}