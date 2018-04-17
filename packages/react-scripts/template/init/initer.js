const fs = require('fs');

const packageJson = require('../package.json');
const scriptsToAdd = {
  serve: "cd build && ws --spa"
};

packageJson.scripts = { ...packageJson.scripts, ...scriptsToAdd };

const stringifiedPackageJson = JSON.stringify(packageJson, null, 4);

fs.writeFileSync('package.json', stringifiedPackageJson);

const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file) {
      const curPath = path + "/" + file;

      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });

    fs.rmdirSync(path);
  }
};

deleteFolderRecursive('./');
