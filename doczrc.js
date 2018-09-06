const sass = require('@fesk/webpack-config/lib/loaders/sass');
const miniCss = require('@fesk/webpack-config/lib/plugins/mini-css');
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: 1 });

module.exports = {
  title: 'Timeliner',
  description: 'IIIF Timeliner application',
  src: './src/components',
  dest: './dist/docs',
  base: '/docs/',
  debug: false,
  port: 5001,
  protocol: 'http',
  modifyBundlerConfig: config => {
    config.module.rules.push(sass);
    config.plugins[0].config.threadPool = happyThreadPool;
    config.plugins[1].config.threadPool = happyThreadPool;
    config.plugins.push(miniCss);
    return config;
  },
};
