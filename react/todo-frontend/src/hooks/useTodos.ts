import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CREATE_TODO,
  DELETE_TODO,
  GET_TODOS,
  UPDATE_TODO,
} from "../apis/todos.api";
import type { Todo, Priority } from "../todo.types";
import { fetchGraphQL } from "../graphql/fetchGraphQL";
import {
  showGraphQLErrors,
  showSuccessNotification,
} from "../commons/notification";
import { useMemo } from "react";
import type { TodoFilters } from "../types/todo.types";

export const useTodos = (filters: TodoFilters = {}) => {
  const queryClient = useQueryClient();
  const stableFilters = useMemo(() => filters, [filters]);

  // Query to fetch todos with filters
  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<
    Todo[],
    Error
  >({
    queryKey: ["todos", stableFilters],
    queryFn: () => {
      return fetchGraphQL<{ todos: Todo[] }>(GET_TODOS, filters).then(
        (res) => res.todos
      );
    },
    staleTime: 60 * 1000, // Data sẽ được coi là fresh trong 1 phút
  });

  // Create mutation with all fields
  const createMutation = useMutation({
    mutationFn: (variables: {
      title: string;
      completed?: boolean;
      tags?: string[];
      dueDate?: string;
      priority?: Priority;
    }) =>
      fetchGraphQL<{ createTodo: Todo }>(CREATE_TODO, variables).then(
        (res) => res.createTodo
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      showSuccessNotification("Success", "Todo created successfully");
    },
    onError: (err) => {
      showGraphQLErrors("Lỗi tạo Todo", err);
    },
  });

  // Update mutation with all fields
  const updateMutation = useMutation({
    mutationFn: (variables: {
      id: number;
      title?: string;
      completed?: boolean;
      tags?: string[];
      dueDate?: string;
      priority?: Priority;
    }) =>
      fetchGraphQL<{ updateTodo: Todo }>(UPDATE_TODO, variables).then(
        (res) => res.updateTodo
      ),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      queryClient.setQueryData<Todo[]>(
        ["todos"],
        (old) =>
          old?.map((todo) =>
            todo.id === variables.id ? { ...todo, ...variables } : todo
          ) || []
      );

      return { previousTodos };
    },
    onSuccess: () => {
      showSuccessNotification("Success", "Todo updated successfully");
    },
    onError: (err, _, context) => {
      showGraphQLErrors("Update failed", err.message);
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Delete mutation remains the same
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetchGraphQL<{ removeTodo: boolean }>(DELETE_TODO, { id }).then(
        (res) => res.removeTodo
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      showSuccessNotification("Success", "Todo deleted successfully");
    },
    onError: (err) => {
      showGraphQLErrors("Delete failed", err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return {
    todos: data || [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,

    createTodo: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateTodo: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    deleteTodo: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
