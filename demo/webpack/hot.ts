import * as webpack from 'webpack';
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import config from './base';
import { CONSTANTS } from './constants';
import HtmlWebpackPlugin from 'html-webpack-plugin';

interface Configuration extends webpack.Configuration {
  devServer?: WebpackDevServerConfiguration;
}

const hotConfig: Configuration = {
  ...config,
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [
    ...(config.plugins || []),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: '🔗-able Components',
      template: 'demo/index.html'
    })
  ],
  devServer: {
    static: {
      directory: CONSTANTS.BUILD_DIR
    },
    historyApiFallback: true,
    hot: true,
    port: CONSTANTS.DEV_SERVER_PORT,
    open: true
  }
};

export default hotConfig;
