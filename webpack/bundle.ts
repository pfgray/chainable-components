import config from './base';

const bundleConfig = {
  ...config,
  optimization: {
    minimize: true
  },
  plugins: [
    ...(config.plugins || []),
  ],
};

export default bundleConfig;
