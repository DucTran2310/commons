import { ApolloError, type DocumentNode } from "@apollo/client";
import { apolloClient } from "../libs/apollo-client";

export async function fetchGraphQL<T>(
  mutation: DocumentNode,
  variables?: Record<string, any>
): Promise<T> {
  try {
    const { data, errors } = await apolloClient.mutate({
      mutation,
      variables,
      errorPolicy: "all", // nhận cả data lẫn error nếu có
    });

    if (errors?.length) {
      console.error("GraphQL Errors:", errors);
      throw new Error(errors.map(e => e.message).join("\n"));
    }

    if (!data) {
      throw new Error("Không nhận được dữ liệu từ server.");
    }

    return data;
  } catch (err: any) {
    const apolloError = err as ApolloError;

    const graphQLErrors = apolloError.graphQLErrors ?? [];
    const networkError = apolloError.networkError;

    let message = "Lỗi không xác định.";

    if (graphQLErrors.length > 0) {
      message = graphQLErrors.map(e => e.message).join("\n");
    } else if (networkError) {
      message = networkError.message;
    } else if (err.message) {
      message = err.message;
    }

    console.error("GraphQL Error Stack:", message);
    throw new Error(message);
  }
}