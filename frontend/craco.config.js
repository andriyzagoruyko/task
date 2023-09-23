const { addBeforeLoader, loaderByName } = require("@craco/craco");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.extensions.push(".gql");

      const htmlLoader = {
        loader: require.resolve("graphql-tag/loader"),
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
      };

      addBeforeLoader(webpackConfig, loaderByName("babel-loader"), htmlLoader);

      return webpackConfig;
    },
  },
};
  