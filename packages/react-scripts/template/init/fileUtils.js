const fs = require('fs');

module.exports = {
  addTokenToNpmrc(token) {
    fs.appendFileSync('.npmrc', token);
  },

  writeJsonFile(absolutePath, obj) {
    const stringifiedObj = JSON.stringify(obj, null, 4);

    fs.writeFileSync(absolutePath, stringifiedObj);
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
};
