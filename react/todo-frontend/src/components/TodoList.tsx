import { Alert, Button, Empty, Select, Space, Spin, Tabs } from 'antd';
import React, { useMemo, useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import { Priority } from '../todo.types';
import { TodoItem } from './TodoItem';

const { Option } = Select;

const priorityOptions = [
  { value: Priority.Low, label: 'Low' },
  { value: Priority.Medium, label: 'Medium' },
  { value: Priority.High, label: 'High' },
];

const tabItems = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'overdue', label: 'Overdue' },
];

export const TodoList: React.FC = () => {
  const [filters, setFilters] = useState<{
    tag?: string;
    priority?: Priority;
    sortBy?: 'dueDate' | 'priority' | 'createdAt';
  }>({});

  const [activeTab, setActiveTab] = useState('all');

  const {
    todos,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    isCreating,
    isUpdating,
    isDeleting
  } = useTodos(filters);

  // Extract all unique tags from todos
  const allTags = Array.from(
    new Set(todos?.flatMap(todo => todo.tags || []))
  ).sort();

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (activeTab === 'completed') return todo.completed;
      if (activeTab === 'active') return !todo.completed;
      if (activeTab === 'overdue') {
        return todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;
      }
      return true;
    });
  }, [todos, activeTab]);

  if (isLoading) return <Spin size="large" className="flex justify-center mt-8" />;

  if (isError) {
    return (
      <Alert
        message="Error"
        description={`Failed to load todos: ${error?.message}`}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Todo List</h2>
        {(isFetching || isCreating || isUpdating || isDeleting) && (
          <Spin size="small" />
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <Tabs
          items={tabItems}
          activeKey={activeTab}
          onChange={setActiveTab}
        />

        <Space className="mb-4">
          <Select
            placeholder="Filter by priority"
            allowClear
            style={{ width: 150 }}
            value={filters.priority} // Thêm value hiện tại
            onChange={(value) => setFilters({ ...filters, priority: value })}
          >
            {priorityOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Filter by tag"
            allowClear
            style={{ width: 150 }}
            value={filters.tag}
            onChange={(value) => setFilters({ ...filters, tag: value })}
          >
            {allTags.map(tag => (
              <Option key={tag} value={tag}>
                {tag}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Sort by"
            allowClear
            style={{ width: 150 }}
            value={filters.sortBy}
            onChange={(value) => setFilters({ ...filters, sortBy: value })}
          >
            <Option value="dueDate">Due Date</Option>
            <Option value="priority">Priority</Option>
            <Option value="createdAt">Created At</Option>
          </Select>

          <Button onClick={() => setFilters({})}>Reset Filters</Button>
        </Space>
      </div>

      {filteredTodos.length === 0 ? (
        <Empty description="No todos found" />
      ) : (
        <div className="space-y-2">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
};