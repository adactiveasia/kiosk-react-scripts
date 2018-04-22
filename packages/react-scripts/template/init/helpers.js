const npm = require('npm');

module.exports = {
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
