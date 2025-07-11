import type { Priority } from "../todo.types";

export const priorityColorMap: Record<Priority, string> = {
  HIGH: 'red',
  MEDIUM: 'orange',
  LOW: 'green',
};

export const getPriorityColor = (priority: Priority) => {
  return priorityColorMap[priority] || 'blue';
};