const sass = require('@fesk/webpack-config/lib/loaders/sass');
const miniCss = require('@fesk/webpack-config/lib/plugins/mini-css');

module.exports = {
  src: './src/components',
  dest: './dist/docs',
  base: '/docs/',
  hashRouter: true,
  debug: false,
  port: 5001,
  protocol: 'http',
  modifyBundlerConfig: config => {
    config.module.rules.push(sass);
    config.plugins.push(miniCss);
    return config;
  },
};
