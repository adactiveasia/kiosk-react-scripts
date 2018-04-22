const chalk = require('chalk');

module.exports = {
  properties: {
    isFirebaseRequired: {
      type: 'boolean',
      required: true,
      description: chalk.cyan(`If you need firebase in the project, just type true or just t, if no -> type false or just f`)
    }
  }
};
