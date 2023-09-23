module.exports = {
  client: {
    service: {
      name: "my-graphql-app",
      url:
        process.env.APP_GATEWAY_GRAPHQL_URL || "http://localhost:8080/graphql",
    },
  },
};
