import React from 'react'
import { TodoItem } from './TodoItem'
import { Empty, Spin, Alert, Button } from 'antd'
import { useTodos } from '../hooks/useTodos'

export const TodoList: React.FC = () => {
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
  } = useTodos()

  if (isLoading) return <Spin size="large" className="flex justify-center mt-8" />

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
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Todo List</h2>
        {(isFetching || isCreating || isUpdating || isDeleting) && (
          <Spin size="small" />
        )}
      </div>

      {todos.length === 0 ? (
        <Empty description="No todos yet" />
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  )
}