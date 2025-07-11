import type { Priority } from "../todo.types";

export interface TodoFilters {
  tag?: string;
  priority?: Priority;
  sortBy?: 'dueDate' | 'priority' | 'createdAt' | 'title'; // <-- thêm 'title' nếu hợp lệ
}