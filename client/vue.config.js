const path = require('path');

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  outputDir: 'build',
  chainWebpack: config => {
    config.resolve.alias
      .set('@', path.resolve('./src'))
      .set('@assets', path.resolve('./src/assets'))
      .set('@models', path.resolve('./src/models'))
      .set('@components', path.resolve('./src/components'))
      .set('@composables', path.resolve('./src/composables'))
      .set('@utils', path.resolve('./src/utils'));
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "@/styles/_variables.scss";
        `,
      },
    },
  },
};
