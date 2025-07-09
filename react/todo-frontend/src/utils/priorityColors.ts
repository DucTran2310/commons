import { Priority } from '../todo.types';

export const priorityColorMap: Record<Priority, string> = {
  [Priority.High]: 'red',
  [Priority.Medium]: 'orange',
  [Priority.Low]: 'green',
};

export const getPriorityColor = (priority: Priority) => {
  return priorityColorMap[priority] || 'blue';
};