const Config = require('webpack-config').default;

module.exports = new Config().extend('@fesk/scripts/webpack').merge({
  /* Your config overrides go here */
  resolve: {
    alias: {
      soundmanager2: 'soundmanager2/script/soundmanager2-nodebug-jsmin.js',
    },
  },
});
