require("dotenv/config");

module.exports = {
  client: {
    service: {
      name: "task",
      url: "http://localhost:8080/graphql",
    },
    excludes: ["src/generated/**/*"],
  },
};
