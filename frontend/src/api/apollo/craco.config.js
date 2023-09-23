const { gqlLoader } = require("./gql-loader");

module.exports = {
  plugins: [{ plugin: gqlLoader }],
};
