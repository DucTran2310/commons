import React, { useState } from 'react';
import { Checkbox, Button, Space, Spin, Popconfirm, Input, Tag, DatePicker, Select } from 'antd';
import { DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useTodos } from '../hooks/useTodos';
import dayjs from 'dayjs';
import { Priority, type Todo } from '../todo.types';

interface TodoItemProps {
  todo: Todo;
}

const priorityOptions = [
  { value: Priority.Low, label: 'Low' },
  { value: Priority.Medium, label: 'Medium' },
  { value: Priority.High, label: 'High' },
];

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { updateTodo, deleteTodo, isUpdating, isDeleting } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editTags, setEditTags] = useState<string[]>(todo.tags || []);
  const [editDueDate, setEditDueDate] = useState(dayjs(todo.dueDate));

  const handleUpdate = (updates: Partial<Todo>) => {
    updateTodo({ 
      id: todo.id, 
      ...updates 
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const startEditing = () => {
    setEditValue(todo.title);
    setEditPriority(todo.priority);
    setEditTags(todo.tags || []);
    setEditDueDate(dayjs(todo.dueDate));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.High: return 'red';
      case Priority.Medium: return 'orange';
      case Priority.Low: return 'green';
      default: return 'blue';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No deadline';
    return dayjs(dateString).format('MMM D, YYYY h:mm A');
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <div className={`flex flex-col p-4 border-b hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <Checkbox
            checked={todo.completed}
            onChange={(e) => handleUpdate({ completed: e.target.checked })}
            disabled={isUpdating}
          />
          
          {isEditing ? (
            <div className="flex flex-col ml-2 flex-1 space-y-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onPressEnter={() => handleUpdate({ title: editValue })}
                autoFocus
                className="flex-1"
              />
              
              <Space>
                <Select
                  value={editPriority}
                  onChange={setEditPriority}
                  style={{ width: 120 }}
                >
                  {priorityOptions.map(opt => (
                    <Select.Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
                
                <DatePicker
                  showTime
                  value={editDueDate}
                  onChange={(date) => setEditDueDate(date || dayjs())}
                />
                
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Tags"
                  value={editTags}
                  onChange={setEditTags}
                />
              </Space>
              
              <Space>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleUpdate({ 
                    title: editValue,
                    priority: editPriority,
                    tags: editTags,
                    dueDate: editDueDate?.toISOString()
                  })}
                  disabled={editValue.trim() === ''}
                >
                  Save
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  onClick={cancelEditing}
                >
                  Cancel
                </Button>
              </Space>
            </div>
          ) : (
            <div className="ml-2 flex-1">
              <div className={`${todo.completed ? 'line-through text-gray-400' : ''}`}>
                {todo.title}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Tag color={getPriorityColor(todo.priority)}>
                  {todo.priority}
                </Tag>
                
                {todo.tags?.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
                
                {todo.dueDate && (
                  <Tag color={isOverdue ? 'red' : 'blue'}>
                    {formatDate(todo.dueDate)}
                    {isOverdue && ' (Overdue)'}
                  </Tag>
                )}
              </div>
            </div>
          )}
          
          {(isUpdating || isDeleting) && <Spin size="small" className="ml-2" />}
        </div>
        
        {!isEditing && (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={startEditing}
              disabled={isUpdating || isDeleting}
            />
            <Popconfirm
              title="Delete this todo?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
              disabled={isDeleting}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                loading={isDeleting}
                disabled={isUpdating}
              />
            </Popconfirm>
          </Space>
        )}
      </div>
      
      {!isEditing && (
        <div className="text-xs text-gray-500 mt-1">
          Created: {dayjs(todo.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      )}
    </div>
  );
};