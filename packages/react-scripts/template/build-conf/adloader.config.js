const path = require('path');

module.exports = {
  externalDependencies: [],
  app: {
    build: path.join(__dirname, '..', 'build'),
  },
  server: {
    build: path.join(__dirname, '..', 'server', 'build'),
  },
  killExplorer: true,
  logRotate: {
    enabled: true,
    interval: '0 0 * * *', // rotate everyday at midnight
    retain: 6,
  }
};
