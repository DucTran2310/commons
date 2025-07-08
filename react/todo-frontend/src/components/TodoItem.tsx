import React, { useState } from 'react'
import { Checkbox, Button, Space, Spin, Popconfirm, Input } from 'antd'
import { DeleteOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useTodos } from '../hooks/useTodos'
import type { Todo } from '../todos'

interface TodoItemProps {
  todo: Todo
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { updateTodo, deleteTodo, isUpdating, isDeleting } = useTodos()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)

  const handleUpdate = (updates: Partial<Todo>) => {
    updateTodo({ id: todo.id, ...updates })
    setIsEditing(false)
  }

  const handleDelete = () => {
    deleteTodo(todo.id)
  }

  const startEditing = () => {
    setEditValue(todo.title)
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
  }

  return (
    <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50">
      <div className="flex items-center flex-1">
        <Checkbox
          checked={todo.completed}
          onChange={(e) => handleUpdate({ completed: e.target.checked })}
          disabled={isUpdating}
        />
        
        {isEditing ? (
          <div className="flex items-center ml-2 flex-1">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onPressEnter={() => handleUpdate({ title: editValue })}
              autoFocus
              className="flex-1"
            />
            <Space className="ml-2">
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => handleUpdate({ title: editValue })}
                disabled={editValue.trim() === ''}
              />
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={cancelEditing}
              />
            </Space>
          </div>
        ) : (
          <span 
            className={`ml-2 flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}
            onDoubleClick={startEditing}
          >
            {todo.title}
          </span>
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
  )
}