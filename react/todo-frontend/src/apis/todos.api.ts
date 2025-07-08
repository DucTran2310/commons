import { gql } from '@apollo/client'

export const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      completed
      createdAt
    }
  }
`

export const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $completed: Boolean) {
    createTodo(createTodoInput: { title: $title, completed: $completed }) {
      id
      title
      completed
    }
  }
`

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: Int!, $title: String, $completed: Boolean) {
    updateTodo(updateTodoInput: { id: $id, title: $title, completed: $completed }) {
      id
      title
      completed
    }
  }
`

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!) {
    removeTodo(id: $id)
  }
`