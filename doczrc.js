import { css } from 'docz-plugin-css';

export default {
  title: 'Timeliner documentation',
  description: 'Timeliner interactive documentation website',
  src: './src/components',
  dest: './dist/docs',
  base: '/docs/',
  hashRouter: true,
  debug: true,
  port: 5001,
  protocol: 'http',
  plugins: [
    css({
      preprocessor: 'sass',
    }),
  ],
  modifyBundlerConfig: (config, ...args) => {
    config.module.rules = config.module.rules.map(rule => {
      rule.exclude = [/node_modules/];
      return rule;
    });

    config.plugins[0].config.threads = 1;
    config.plugins[1].config.threads = 1;
    config.watchOptions = config.watchOptions || {};
    config.watchOptions.ignored = /node_modules/;

    return config;
  },
};
