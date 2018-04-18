const path = require('path');
const fs = require('fs');

const prompt = require('prompt');
const chalk = require('chalk');
const npm = require('npm');

module.exports = {
  askForToken() {
    //
    // Start the prompt
    //
    prompt.start();

    return new Promise((resolve, reject) => {
      prompt.get({
        properties: {
          token: {
            description: chalk.cyan(`What's your Adactive private npm token bro?`)
          }
        }
      }, function (err, result) {
        if (err) {
          console.log(chalk.red(`Error in: ${err}`));
          reject(err);
        }

        console.log(chalk.cyan(`You said your token is: ${result.token}`));
        resolve(result.token);
      });
    });
  },

  writePackageJson(data) {
    const stringifiedPackageJson = JSON.stringify(data, null, 4);

    fs.writeFileSync(path.resolve(__dirname, '../package.json'), stringifiedPackageJson);
  },

  deleteFolderRecursive(pathToFolder) {
    const recursive = (pathToFolder) => {
      if (fs.existsSync(pathToFolder)) {
        fs.readdirSync(pathToFolder).forEach((file) => {
          const curPath = `${pathToFolder}/${file}`;

          if (fs.lstatSync(curPath).isDirectory()) {
            recursive(curPath);
          } else { // delete file
            fs.unlinkSync(curPath);
          }
        });

        fs.rmdirSync(pathToFolder);
      }
    };

    recursive(pathToFolder);
  },

  addTokenToNpmrc(token) {
    fs.appendFileSync('.npmrc', token);
  },

  installPackages() {
    return new Promise((resolve, reject) => {
      npm.load(function(err) {
        // handle errors

        // install module ffi
        npm.commands.install([], function(er, data) {
          if (er) {
            console.error(`Something went wrong while installing packages. Error: ${er}`);
            reject();
          }
          resolve();
        });

        npm.on('log', function(message) {
          // log installation progress
          console.log(message);
        });
      });
    });
  },

  removeIniterDependencies(dependenciesToRemove, packageJson) {
    dependenciesToRemove.forEach((depName) => {
      delete packageJson[depName];
    });
  }
};
