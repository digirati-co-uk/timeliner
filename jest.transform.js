module.exports = require('babel-jest').createTransformer({
  presets: [
    '@babel/preset-react',
    [
      require.resolve('@babel/preset-env'),
      {
        useBuiltIns: 'usage',
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: ['transform-class-properties'],
});
