const prompt = require('prompt');
const chalk = require('chalk');

const firebaseCredentialsSchema = require('./schemas/firebaseCredentialsSchema');
const askNpmTokenSchema = require('./schemas/askNpmTokenSchema');

module.exports = {
  askForToken() {
    prompt.start();

    return new Promise((resolve, reject) => {
      prompt.get(askNpmTokenSchema, function (err, result) {
        if (err) {
          console.log(chalk.red(`Error in: ${err}`));
          reject(err);
        }

        console.log(chalk.cyan(`You said your token is: ${result.token}`));
        resolve(result.token);
      });
    });
  },

  askFirebaseProjectId() {
    prompt.start();

    return new Promise((resolve, reject) => {
      prompt.get(firebaseCredentialsSchema, function (err, result) {
        if (err) {
          console.log(chalk.red(`Error in: ${err}`));
          reject(err);
        }

        console.log(`Your firebase projectId is: ${result.projectId}`);
        console.log(`Your firebase Staging projectId is: ${result.projectId}-stg`);
        console.log(`Your firebase Dev projectId is: ${result.projectId}-dev`);

        resolve(result.projectId);
      });
    });
  }
};
