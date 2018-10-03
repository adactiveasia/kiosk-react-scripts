const {
  scriptsToAdd,
  dependenciesToAdd,
  devDependenciesToAdd,
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
  askFirebaseCredentials
} = require('./promptUtils');

const {
  addTokenToNpmrc,
  writeJsonFile,
  deleteFolderRecursive,
  deleteFile,
} = require('./fileUtils');

const packageJson = require('../package.json');
packageJson.scripts = { ...packageJson.scripts, ...scriptsToAdd };
packageJson.dependencies = { ...packageJson.dependencies, ...dependenciesToAdd };
packageJson.devDependencies = { ...packageJson.devDependencies, ...devDependenciesToAdd };

Promise.resolve()
  .then(askForToken)
  .then(addTokenToNpmrc)
  .then(askIfFirebaseNeeded)
  .then(isFirebaseRequired => askFirebaseCredentials(isFirebaseRequired))
  .then(
    (firebaseConfig) => {
      if(firebaseConfig) {
        writeJsonFile(fileLocations.firebaserc, {
          "projects": {
            "production": firebaseConfig.projectId,
            "staging": firebaseConfig.projectId + "-stg",
            "dev": firebaseConfig.projectId + "-dev"
          }
        }
      );
        writeJsonFile(fileLocations.firebaseConfigLocation,firebaseConfig)
      } else {
        deleteFile(fileLocations.firebaseServiceLocation)
      }
    }
  )
  .then(installPackages)
  .then(removeIniterDependencies.bind(null, dependenciesToRemove, packageJson))
  .then(writeJsonFile.bind(null, fileLocations.packageJsonLocation, packageJson))
  .then(installPackages)
  .then(() => {
      deleteFolderRecursive(fileLocations.init)
  });
