const chalk = require('chalk');

module.exports = {
  properties: {
    apiKey: {
      required: true,
      description: chalk.cyan(`Provide a Firebase key`)
    },
    authDomain: {
      required: true,
      description: chalk.cyan(`Provide a Firebase authDomain`)
    },
    databaseURL: {
      required: true,
      description: chalk.cyan(`Provide a Firebase databaseURL`)
    },
    projectId: {
      required: true,
      description: chalk.cyan(`Provide a Firebase projectId`)
    },
    storageBucket: {
      required: true,
      description: chalk.cyan(`Provide a Firebase storageBucket`)
    },
    messagingSenderId: {
      required: true,
      description: chalk.cyan(`Provide a Firebase messagingSenderId`)
    }
  }
};
