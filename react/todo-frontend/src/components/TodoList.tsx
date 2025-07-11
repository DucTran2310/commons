import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Empty, Select, Space, Spin, Tabs, Tag } from 'antd';
import React, { useMemo, useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import { TodoItem } from './TodoItem';
import type { Priority } from '../todo.types';

const { Option } = Select;

const priorityOptions = [
  { value: 'LOW' as Priority, label: 'Low', color: 'green' },
  { value: 'MEDIUM' as Priority, label: 'Medium', color: 'orange' },
  { value: 'HIGH' as Priority, label: 'High', color: 'red' },
];

const sortOptions = [
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'title', label: 'Title' },
];

const tabItems = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'dueSoon', label: 'Due Soon' },
];

export const TodoList: React.FC = () => {
  const [filters, setFilters] = useState<{
    tag?: string;
    priority?: Priority;
    sortBy?: 'title' | 'dueDate' | 'priority' | 'createdAt';
    sortOrder?: 'ASC' | 'DESC';
  }>({});

  const [activeTab, setActiveTab] = useState('all');

  const {
    todos,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useTodos(filters);

  // Extract all unique tags from todos
  const allTags = Array.from(
    new Set(todos?.flatMap(todo => todo.tags || []))
  ).sort();

  const filteredTodos = useMemo(() => {
    const now = new Date();
    const soon = new Date();
    soon.setHours(soon.getHours() + 24); // Due within 24 hours

    return todos.filter(todo => {
      if (activeTab === 'completed') return todo.completed;
      if (activeTab === 'active') return !todo.completed;
      if (activeTab === 'overdue') {
        return todo.dueDate && new Date(todo.dueDate) < now && !todo.completed;
      }
      if (activeTab === 'dueSoon') {
        return (
          todo.dueDate &&
          new Date(todo.dueDate) > now &&
          new Date(todo.dueDate) < soon &&
          !todo.completed
        );
      }
      return true;
    });
  }, [todos, activeTab]);

  const handleSortChange = (value: 'title' | 'dueDate' | 'priority' | 'createdAt') => {
    setFilters(prev => ({
      ...prev,
      sortBy: value,
      sortOrder: value === 'priority' ? 'DESC' : 'ASC'
    }));
  };

  if (isLoading) return <Spin size="large" className="flex justify-center mt-8" />;

  if (isError) {
    return (
      <Alert
        message="Error"
        description={`Failed to load todos: ${error?.message}`}
        type="error"
        showIcon
        action={
          <Button size="small" icon={<ReloadOutlined />} onClick={() => refetch()}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Todo Manager</h2>
        <Space>
          {isFetching && <Spin size="small" />}
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isFetching}
          />
        </Space>
      </div>

      <Card
        title="Todo List"
        className="mb-4"
      >
        <Tabs
          items={tabItems}
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-500">
                {filteredTodos.length} {filteredTodos.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          }
        />

        <div className="my-4">
          <Space wrap>
            <Select
              placeholder="Filter by priority"
              allowClear
              style={{ width: 150 }}
              value={filters.priority}
              onChange={(value) => setFilters({ ...filters, priority: value })}
              suffixIcon={<FilterOutlined />}
            >
              {priorityOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>
                  <Tag color={opt.color}>{opt.label}</Tag>
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Filter by tag"
              allowClear
              style={{ width: 150 }}
              value={filters.tag}
              onChange={(value) => setFilters({ ...filters, tag: value })}
              suffixIcon={<FilterOutlined />}
            >
              {allTags.map(tag => (
                <Option key={tag} value={tag}>
                  <Tag color="blue">{tag}</Tag>
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Sort by"
              allowClear
              style={{ width: 150 }}
              value={filters.sortBy}
              onChange={handleSortChange}
            >
              {sortOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>

            <Button onClick={() => setFilters({})} disabled={!filters.priority && !filters.tag && !filters.sortBy}>
              Clear Filters
            </Button>
          </Space>
        </div>

        {filteredTodos.length === 0 ? (
          <Empty
            description={
              activeTab === 'all' ? "No todos found" :
                activeTab === 'completed' ? "No completed todos" :
                  activeTab === 'overdue' ? "No overdue todos" :
                    activeTab === 'dueSoon' ? "No todos due soon" : "No active todos"
            }
          />
        ) : (
          <div className="space-y-2">
            {filteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};