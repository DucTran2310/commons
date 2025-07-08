import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GET_TODOS,
  CREATE_TODO,
  UPDATE_TODO,
  DELETE_TODO,
} from "../apis/todos.api";
import { apolloClient } from "../libs/apollo-client";
import type { Todo } from "../todos";
import type { DocumentNode } from "graphql";
import { useNotificationContext } from "../context/NotificationContext";

export async function fetchGraphQL<T>(
  mutation: DocumentNode,
  variables?: any
): Promise<T> {
  const { data } = await apolloClient.mutate({
    mutation,
    variables,
  });
  return data;
}

export const useTodos = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotificationContext() 

  // Query to fetch todos
  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<
    Todo[],
    Error
  >({
    queryKey: ["todos"],
    queryFn: () =>
      fetchGraphQL<{ todos: Todo[] }>(GET_TODOS).then((res) => res.todos),
  });

  // Rest of your mutations remain the same
  const createMutation = useMutation({
    mutationFn: (title: string) =>
      fetchGraphQL<{ createTodo: Todo }>(CREATE_TODO, { title, completed: false }).then(
        (res) => res.createTodo
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      showSuccess("Success", "Todo created successfully");
    },
    onError: (err) => {
      showError("Create failed", err.message);
    },
  });

  // Mutation để cập nhật todo
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      ...updates
    }: {
      id: number;
      title?: string;
      completed?: boolean;
    }) =>
      fetchGraphQL<{ updateTodo: Todo }>(UPDATE_TODO, { id, ...updates }).then(
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
      showSuccess("Success", "Todo updated successfully");
    },
    onError: (err, _, context) => {
      showError("Update failed", err.message);
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Mutation để xóa todo
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetchGraphQL<{ removeTodo: boolean }>(DELETE_TODO, { id }).then(
        (res) => res.removeTodo
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      showSuccess("Success", "Todo deleted successfully");
    },
    onError: (err) => {
      showError("Delete failed", err.message);
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
