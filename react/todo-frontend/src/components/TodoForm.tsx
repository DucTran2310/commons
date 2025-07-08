import React, { useState } from 'react'
import { Input, Button, Alert } from 'antd'
import { useTodos } from '../hooks/useTodos'

export const TodoForm: React.FC = () => {
  const [title, setTitle] = useState('')
  const { createTodo, isCreating, createError } = useTodos()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      createTodo(title, {
        onSuccess: () => setTitle('')
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <div className="flex-1">
        <Input
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isCreating}
        />
        {createError && (
          <Alert
            message="Error"
            description={createError.message}
            type="error"
            showIcon
            className="mt-2"
          />
        )}
      </div>
      <Button 
        type="primary" 
        htmlType="submit" 
        loading={isCreating}
        disabled={!title.trim()}
      >
        Add Todo
      </Button>
    </form>
  )
}