import { ApolloClient, InMemoryCache } from '@apollo/client'

export const apolloClient = new ApolloClient({
  uri: 'http://localhost:5555/graphql', // URL của NestJS backend
  cache: new InMemoryCache(),
})