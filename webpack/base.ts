import * as webpack from 'webpack';
import { CONSTANTS } from './constants';

// tslint:disable-next-line no-var-requires

const config: webpack.Configuration = {
  entry: CONSTANTS.APP_ENTRY,
  output: {
    filename: 'chainable-components.js',
    path: CONSTANTS.BUILD_DIR,
  },
  devtool: '#source-map',
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.json', '.ts', '.js', '.tsx'],
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              noEmit: false,
              declaration: false,
            },
          },
        },
      ],
    }, {
      test: /node_modules.*\.js$/,
      loader: 'source-map-loader',
    }, {
      test: /\.css$/,
      use: [
        {
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        },
      ],
    }, {
      test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.eot$/,
      loader: 'file-loader',
    }, {
      test: /\.less/,
      use: [
        {
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        }, {
          loader: 'less-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    },
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
  ],
};

export default config;
