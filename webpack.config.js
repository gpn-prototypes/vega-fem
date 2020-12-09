const merge = require('webpack-merge');
const dotenv = require('dotenv');
const webpack = require('webpack');
const path = require('path');

const appConfig = require('./app-config').getAppConfig();

dotenv.config();

const gpnWebpack = require('@gpn-prototypes/frontend-configs/webpack.config')({
  appConfig,
  // eslint-disable-next-line global-require
  postCssConfig: { postcssOptions: { ...require('./postcss.config') } },
});

const commonWebpack = () => {
  const envConfig = dotenv.config();

  const env = envConfig.error ? {} : envConfig.parsed;

  const envKeys = Object.keys(env).reduce((prev, next) => {
    // eslint-disable-next-line no-param-reassign
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    plugins: [new webpack.DefinePlugin(envKeys)],
  };
};

const appWebpack = {
  devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : false,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  devServer: {
    ...gpnWebpack.devServer,
    historyApiFallback: true,
  },
};

module.exports = merge(commonWebpack(), gpnWebpack, appWebpack);
