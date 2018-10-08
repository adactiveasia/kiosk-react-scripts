const chalk = require('chalk');

module.exports = {
  properties: {
    token: {
      required: true,
      description: chalk.cyan(`What's your Adactive private npm token bro?`)
    }
  }
};
