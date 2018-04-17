const fs = require('fs');

const packageJson = require('../package.json');
const scriptsToAdd = {
  serve: "cd build && ws --spa",
  "compile-server": "webpack --config ./build-conf/webpack.config.server.js",
  doc: "jsdoc -c ./build-conf/jsdoc_conf.app.json -t ./node_modules/ink-docstrap/template",
  "doc-server": "jsdoc -c ./build-conf/jsdoc_conf.server.json -t ./node_modules/ink-docstrap/template",
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

deleteFolderRecursive(__dirname);
