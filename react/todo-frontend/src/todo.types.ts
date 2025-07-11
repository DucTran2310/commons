export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

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