const path = require('path');
const { name } = require('../package.json');

module.exports = {
  s3BucketName: `adloader-${name}`,
  s3BucketRegion: 'ap-southeast-1',
  externalDependencies: [],
  app: {
    build: path.join(__dirname, '..', 'build'),
  },
  server: {
    build: path.join(__dirname, '..', 'server', 'build'),
  },
  killExplorer: true,
};
