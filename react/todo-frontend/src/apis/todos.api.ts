import { gql } from "@apollo/client";

export const GET_TODOS = gql`
  query GetTodos($tag: String, $priority: Priority, $sortBy: String) {
    todos(tag: $tag, priority: $priority, sortBy: $sortBy) {
      id
      title
      completed
      priority
      tags
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TODO = gql`
  mutation CreateTodo(
    $title: String!
    $completed: Boolean
    $tags: [String!]
    $dueDate: DateTime
    $priority: Priority
  ) {
    createTodo(
      createTodoInput: {
        title: $title
        completed: $completed
        tags: $tags
        dueDate: $dueDate
        priority: $priority
      }
    ) {
      id
      title
      completed
      priority
      tags
      dueDate
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo(
    $id: Int!
    $title: String
    $completed: Boolean
    $tags: [String!]
    $dueDate: DateTime
    $priority: Priority
  ) {
    updateTodo(
      updateTodoInput: {
        id: $id
        title: $title
        completed: $completed
        tags: $tags
        dueDate: $dueDate
        priority: $priority
      }
    ) {
      id
      title
      completed
      priority
      tags
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!) {
    removeTodo(id: $id)
  }
`;
