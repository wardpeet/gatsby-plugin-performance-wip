/** @type {import('gatsby').GatsbyNode["pluginOptionsSchema"]} */
exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    splitStyles: Joi.boolean()
      .default(false)
      .description(`Split styles in files per page`),
  });
};

/** @type {import('gatsby').GatsbyNode["onCreateWebpackConfig"]} */
exports.onCreateWebpackConfig = ({ getConfig, actions }, pluginOptions) => {
  const webpackConfig = getConfig();

  if (
    pluginOptions.splitStyles &&
    webpackConfig?.optimization?.splitChunks?.cacheGroups?.styles
  ) {
    delete webpackConfig?.optimization?.splitChunks?.cacheGroups?.styles;

    actions.replaceWebpackConfig(webpackConfig);
  }
};
