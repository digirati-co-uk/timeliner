const Config = require('webpack-config').default;

module.exports = new Config().extend('@fesk/scripts/webpack').merge({
  /* Your config overrides go here */
});
