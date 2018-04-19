const {
  scriptsToAdd,
  dependenciesToAdd,
  dependenciesToRemove
} = require('./config');

const {
  askForToken,
  writePackageJson,
  deleteFolderRecursive,
  addTokenToNpmrc,
  installPackages,
  removeIniterDependencies
} = require('./helpers');

const packageJson = require('../package.json');
packageJson.scripts = { ...packageJson.scripts, ...scriptsToAdd };
packageJson.dependencies = { ...packageJson.dependencies, ...dependenciesToAdd };

askForToken()
  .then(addTokenToNpmrc)
  .then(removeIniterDependencies.bind(null, dependenciesToRemove, packageJson))
  .then(writePackageJson.bind(null, packageJson))
  .then(installPackages)
  .then(deleteFolderRecursive.bind(null, __dirname));
