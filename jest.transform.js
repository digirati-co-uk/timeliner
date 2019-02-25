module.exports = require('babel-jest').createTransformer({
  presets: [
    '@babel/preset-react',
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          browsers: 'last 1 chrome versions',
        },
      },
    ],
  ],
  plugins: ['transform-class-properties'],
});
