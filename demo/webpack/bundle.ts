import config from './base';
import { Configuration } from 'webpack';

const bundleConfig: Configuration = {
  ...config,
  mode: 'production'
};

export default bundleConfig;
