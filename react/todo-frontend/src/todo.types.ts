// src/todos.ts
export enum Priority {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH'
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  tags?: string[];
  dueDate?: string; // ISO string from backend
  createdAt: string;
  updatedAt: string;
}