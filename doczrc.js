import { css } from 'docz-plugin-css';

export default {
  title: 'Timeliner documentation',
  description: 'Timeliner interactive documentation website',
  src: './src/components',
  dest: './dist/docs',
  base: '/docs/',
  hashRouter: true,
  debug: false,
  port: 5001,
  protocol: 'http',
  plugins: [
    css({
      preprocessor: 'sass',
    }),
  ],
  modifyBundlerConfig: config => {
    // Taking too long to optimize.
    config.optimization = {
      minimize: false,
    };
    return config;
  },
};
