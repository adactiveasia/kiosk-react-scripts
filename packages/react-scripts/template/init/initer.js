const {
  scriptsToAdd,
  dependenciesToAdd,
  dependenciesToRemove,
  fileLocations
} = require('./config');

const {
  installPackages,
  removeIniterDependencies,
} = require('./helpers');

const {
  askForToken,
  askIfFirebaseNeeded,
  askFirebaseCredentials,
  askAdsumCredentials
} = require('./promptUtils');

const {
  addTokenToNpmrc,
  writeJsonFile,
  deleteFolderRecursive
} = require('./fileUtils');

const packageJson = require('../package.json');
packageJson.scripts = { ...packageJson.scripts, ...scriptsToAdd };
packageJson.dependencies = { ...packageJson.dependencies, ...dependenciesToAdd };

Promise.resolve()
  .then(askForToken)
  .then(addTokenToNpmrc)
  .then(askIfFirebaseNeeded)
  .then(askFirebaseCredentials)
  .then(writeJsonFile.bind(null, fileLocations.firebaseConfigLocation))
  .then(askAdsumCredentials)
  .then(writeJsonFile.bind(null, fileLocations.adsumConfigLocation))
  .then(installPackages)
  .then(removeIniterDependencies.bind(null, dependenciesToRemove, packageJson))
  .then(writeJsonFile.bind(null, fileLocations.packageJsonLocation, packageJson))
  .then(installPackages)
  .then(deleteFolderRecursive.bind(null, __dirname));
