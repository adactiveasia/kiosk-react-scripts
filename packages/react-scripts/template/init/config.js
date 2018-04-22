const path = require('path');

module.exports = {
  scriptsToAdd: {
    start: "npm run build-css && run-p -ncr watch-css start-js",
    "start-js": "react-scripts start",
    build: "run-s -n build-css build-js",
    "build-js": "react-scripts build",
    test: "run-s -n build-css test-js",
    "test-js": "react-scripts test --env=jsdom",
    "build-css": "node-less-chokidar src",
    "watch-css": "node-less-chokidar src --watch",
    serve: "cd build && ws --spa",
    "compile-server": "webpack --config ./build-conf/webpack.config.server.js",
    doc: "jsdoc -c ./build-conf/jsdoc_conf.app.json -t ./node_modules/ink-docstrap/template",
    "doc-server": "jsdoc -c ./build-conf/jsdoc_conf.server.json -t ./node_modules/ink-docstrap/template",
    "startServer": "node ./public/startServer --port 9001 --jsonConfigFile ./public/config.json --data_folder ./public/local"
  },
  dependenciesToAdd: {
    "@adactive/adsum-client-api": "^2.0.0",
    "@adactive/adsum-react-native-map": "^5.0.0",
  },
  dependenciesToRemove: ['npm', 'prompt', 'chalk'],
  fileLocations: {
    packageJsonLocation: path.resolve(__dirname, '../package.json'),
    firebaseConfigLocation: path.resolve(__dirname, '../firebaseConfig.json'),
    adsumConfigLocation: path.resolve(__dirname, '../public', 'config-created.json')
  }
};
