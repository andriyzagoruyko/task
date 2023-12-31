import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client";

const httpLink = new HttpLink({ uri: "http://localhost/api/graphql" });

/*const wsLink = new GraphQLWsLink(
  createClient({ url: "ws://localhost:8082/subscriptions" })
);

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);*/

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      RecognitionTaskEntity: {
        fields: {
          //fix progress race condition
          progress: {
            merge: (existing, incoming) => {
              return incoming < existing ? existing : incoming;
            },
          },
        },
      },
    },
  }),
});
