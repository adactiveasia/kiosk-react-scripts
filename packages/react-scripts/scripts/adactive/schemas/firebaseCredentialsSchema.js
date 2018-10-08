const chalk = require('chalk');

module.exports = {
  properties: {
    projectId: {
      required: true,
      description: chalk.cyan(`Provide your Firebase projectId`)
    },
  }
};
