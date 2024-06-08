const path = require('path');

module.exports = function override(config, env) {
  // Exclude mapbox-gl from being transpiled by Babel
  config.module.rules.push({
    test: /\.js$/,
    include: path.resolve('node_modules/mapbox-gl'),
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-transform-runtime']
      }
    }
  });

  return config;
};