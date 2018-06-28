const path = require('path');

module.exports = {
  scriptsToAdd: {
    start: "npm run build-css && run-p -ncr watch-css start-js",
    "start-js": "react-app-rewired start --scripts-version @adactive/kiosk-react-scripts",
    build: "run-s -n build-css build-js",
    "build-js": "react-app-rewired build --scripts-version @adactive/kiosk-react-scripts",
    test: "run-s -n build-css test-js",
    "test-js": "react-app-rewired test --env=jsdom --scripts-version @adactive/kiosk-react-scripts",
    "build-css": "node-less-chokidar src",
    "watch-css": "node-less-chokidar src --watch",
    serve: "cd build && ws --spa",
    "compile-server": "webpack --config ./build-conf/webpack.config.server.js",
    doc: "jsdoc -c ./build-conf/jsdoc_conf.app.json -t ./node_modules/ink-docstrap/template",
    "doc-server": "jsdoc -c ./build-conf/jsdoc_conf.server.json -t ./node_modules/ink-docstrap/template",
    "startServer": "node ./public/startServer --port 9001 --jsonConfigFile ./public/config.json --data_folder ./public/local"
  },
  dependenciesToAdd: {
    "@adactive/adsum-client-api": "^2.2.0-rc.1",
    "@adactive/adsum-web-map": "5.3.0-alpha.buffer.1",
    "@adactive/arc-map": "0.0.2-y.44.25",
    "@adactive/adsum-utils": "0.0.2-y.44.16",
    "babel-loader": "7.1.2",
    "fs-extra": "6.0.1",
    "lodash": "^4.17.10",
    "react-responsive": "^4.1.0",
    "eslint-config-airbnb": "^16.1.0",
    "flow-bin": "^0.72.0"
  },
  dependenciesToRemove: ['npm', 'prompt', 'chalk'],
  fileLocations: {
    packageJsonLocation: path.resolve(__dirname, '../package.json'),
    firebaseConfigLocation: path.resolve(__dirname, '../src/services/firebaseConfig.json'),
    adsumConfigLocation: path.resolve(__dirname, '../public', 'config.json')
  }
};
