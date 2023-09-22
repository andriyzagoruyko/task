module.exports = function (options) {
  return {
    ...options,
    devtool: 'inline-source-map',
    output: {
      ...options.output,
      devtoolModuleFilenameTemplate: '      [resource-path]',
    },
  };
};
