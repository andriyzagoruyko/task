import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "http://localhost/api/graphql",
  cache: new InMemoryCache(),
});
