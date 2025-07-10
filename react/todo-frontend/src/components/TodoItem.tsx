import React, { useState } from 'react';
import { 
  Checkbox, 
  Button, 
  Space, 
  Spin, 
  Popconfirm, 
  Input, 
  Tag, 
  DatePicker, 
  Select,
  Badge,
  Tooltip,
  Divider
} from 'antd';
import { 
  DeleteOutlined, 
  EditOutlined, 
  CheckOutlined, 
  CloseOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useTodos } from '../hooks/useTodos';
import dayjs from 'dayjs';
import { Priority, type Todo } from '../todo.types';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface TodoItemProps {
  todo: Todo;
}

const priorityOptions = [
  { value: Priority.Low, label: 'Low', color: 'green' },
  { value: Priority.Medium, label: 'Medium', color: 'orange' },
  { value: Priority.High, label: 'High', color: 'red' },
];

const statusIcons = {
  overdue: <ExclamationCircleOutlined style={{ color: 'red' }} />,
  dueSoon: <ClockCircleOutlined style={{ color: 'orange' }} />,
  completed: <CheckCircleOutlined style={{ color: 'green' }} />,
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { updateTodo, deleteTodo, isUpdating, isDeleting } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editTags, setEditTags] = useState<string[]>(todo.tags || []);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ? dayjs(todo.dueDate) : null);

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
    setEditDueDate(todo.dueDate ? dayjs(todo.dueDate) : null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const getPriorityColor = (priority: Priority) => {
    const option = priorityOptions.find(opt => opt.value === priority);
    return option ? option.color : 'blue';
  };

  const getStatus = () => {
    if (todo.completed) return 'completed';
    if (!todo.dueDate) return null;
    
    const dueDate = dayjs(todo.dueDate);
    const now = dayjs();
    
    if (dueDate.isBefore(now)) return 'overdue';
    if (dueDate.diff(now, 'hour') <= 24) return 'dueSoon';
    
    return null;
  };

  const status = getStatus();

  return (
    <div className={`p-4 border-b hover:bg-gray-50 transition-colors duration-200 
      ${status === 'overdue' ? 'bg-red-50' : ''}
      ${status === 'dueSoon' ? 'bg-orange-50' : ''}
      ${todo.completed ? 'opacity-80' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <Checkbox
            checked={todo.completed}
            onChange={(e) => handleUpdate({ completed: e.target.checked })}
            disabled={isUpdating}
            className="mr-3"
          />
          
          {isEditing ? (
            <div className="flex flex-col ml-2 flex-1 space-y-3 w-full">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onPressEnter={() => handleUpdate({ title: editValue })}
                autoFocus
                className="flex-1"
                showCount
                maxLength={100}
              />
              
              <Space wrap>
                <Select
                  value={editPriority}
                  onChange={setEditPriority}
                  style={{ width: 120 }}
                  optionLabelProp="label"
                >
                  {priorityOptions.map(opt => (
                    <Select.Option key={opt.value} value={opt.value} label={opt.label}>
                      <Tag color={opt.color}>{opt.label}</Tag>
                    </Select.Option>
                  ))}
                </Select>
                
                <DatePicker
                  showTime
                  value={editDueDate}
                  onChange={setEditDueDate}
                  format="YYYY-MM-DD HH:mm"
                  placeholder="Select due date"
                  style={{ width: 200 }}
                />
                
                <Select
                  mode="tags"
                  style={{ minWidth: 200 }}
                  placeholder="Tags"
                  value={editTags}
                  onChange={setEditTags}
                  maxTagCount={3}
                  maxTagTextLength={20}
                  tokenSeparators={[',', ' ']}
                />
              </Space>
              
              <Space>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleUpdate({ 
                    title: editValue,
                    priority: editPriority,
                    tags: editTags.filter(tag => tag.trim() !== ''),
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
              <div className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {todo.title}
                {status && (
                  <Tooltip 
                    title={
                      status === 'overdue' ? 'Overdue' : 
                      status === 'dueSoon' ? 'Due soon' : 'Completed'
                    }
                  >
                    <span className="ml-2">
                      {statusIcons[status]}
                    </span>
                  </Tooltip>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Tag color={getPriorityColor(todo.priority)}>
                  {todo.priority}
                </Tag>
                
                {todo.tags?.map(tag => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
                
                {todo.dueDate && (
                  <Tooltip title={`Due ${dayjs(todo.dueDate).fromNow()}`}>
                    <Tag color={status === 'overdue' ? 'red' : status === 'dueSoon' ? 'orange' : 'blue'}>
                      {dayjs(todo.dueDate).format('MMM D, YYYY h:mm A')}
                      {status === 'overdue' && ' (Overdue)'}
                    </Tag>
                  </Tooltip>
                )}
              </div>
            </div>
          )}
          
          {(isUpdating || isDeleting) && <Spin size="small" className="ml-2" />}
        </div>
        
        {!isEditing && !todo.completed && (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={startEditing}
              disabled={isUpdating || isDeleting}
              className="text-blue-500"
            />
            <Popconfirm
              title="Delete this todo?"
              description="This action cannot be undone"
              onConfirm={handleDelete}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
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
        <div className="text-xs text-gray-500 mt-2 flex items-center">
          <span>Created: {dayjs(todo.createdAt).format('MMM D, YYYY h:mm A')}</span>
          {todo.updatedAt && todo.updatedAt !== todo.createdAt && (
            <>
              <Divider type="vertical" />
              <span>Updated: {dayjs(todo.updatedAt).format('MMM D, YYYY h:mm A')}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};