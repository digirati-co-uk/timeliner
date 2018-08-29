import { css } from 'docz-plugin-css';

export default {
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
};
