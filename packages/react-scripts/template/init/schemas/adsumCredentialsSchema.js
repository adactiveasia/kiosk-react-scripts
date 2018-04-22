const chalk = require('chalk');

module.exports = {
  properties: {
    siteId: {
      type: 'integer',
      required: true,
      description: chalk.cyan(`Provide Adsum siteId`)
    },
    deviceId: {
      type: 'integer',
      required: true,
      description: chalk.cyan(`Provide Adsum deviceId`)
    },
    apiEndpoint: {
      required: true,
      description: chalk.cyan(`Provide Adsum API endpoint`)
    },
    apiSite: {
      type: 'integer',
      required: true,
      description: chalk.cyan(`Provide Adsum API site`)
    },
    apiUsername: {
      required: true,
      description: chalk.cyan(`Provide Adsum API username`)
    },
    apiKey: {
      required: true,
      description: chalk.cyan(`Provide Adsum API key`)
    }
  }
};
