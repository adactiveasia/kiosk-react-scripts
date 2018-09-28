const path = require('path');

module.exports = {
    scriptsToAdd: {
        start: "npm run compile-server && npm run build-css && run-p -ncr watch-css start-js",
        eject: "react-scripts eject",
        "start-js": "react-app-rewired start --scripts-version @adactive/kiosk-react-scripts",
        build: "npm run compile-server && run-s -n build-css build-js",
        "build-js": "react-app-rewired build --scripts-version @adactive/kiosk-react-scripts",
        test: "run-s -n build-css test-js",
        "test-js": "react-app-rewired test --env=jsdom --scripts-version @adactive/kiosk-react-scripts",
        "build-css": "node-less-chokidar src",
        "watch-css": "node-less-chokidar src --watch",
        serve: "cd build && ws --spa",
        "compile-server": "webpack --config ./build-conf/webpack.config.server.js",
        "adloader:step:setup": "adloader setup",
        "adloader:step:package": "adloader package",
        "adloader:step:installer": "adloader installer",
        "adloader": "npm run adloader:step:setup && npm run adloader:step:package && npm run adloader:step:install"
    },
    dependenciesToAdd: {
        "@adactive/adactive-abstract-options": "^1.0.0",
        "@adactive/adactive-logger": "^1.0.0",
        "@adactive/adsum-adloader": "^3.0.0-alpha.1",
        "@adactive/adsum-client-analytics": "^3.0.0-rc.4",
        "@adactive/adsum-client-api": "^2.3.2",
        "@adactive/adsum-utils": "^0.0.2-y.44.46",
        "@adactive/adsum-web-map": "^5.4.0",
        "@adactive/arc-map": "^0.0.2-y.44.46",
        "body-parser": "^1.18.2",
        "check-types": "^7.3.0",
        "compression": "^1.7.2",
        "cors": "^2.8.4",
        "express": "^4.16.3",
        "flow-bin": "^0.72.0",
        "fs-extra": "6.0.1",
        "lodash": "^4.17.10",
        "prop-types": "^15.6.2",
        "react": "^16.4.2",
        "react-dom": "^16.4.2",
        "react-responsive": "^4.1.0",
        "redux": "^3.7.2",
        "redux-saga": "^0.16.0",
        "serve-static": "^1.13.2",
        "winston": "^3.0.0"
    },
    devDependenciesToAdd: {
        "babel-eslint": "^10.0.1",
        "babel-loader": "^7.1.2",
        "babel-preset-airbnb": "^2.5.3",
        "eslint": "^4.0.0",
        "eslint-config-airbnb": "^17.1.0",
        "eslint-plugin-flowtype": "^2.50.3",
        "eslint-plugin-import": "^2.14.0",
        "eslint-plugin-jsx-a11y": "^6.1.1",
        "eslint-plugin-react": "^7.11.1",
        "glob": "^7.1.2",
        "imports-loader": "^0.8.0",
        "uglifyjs-webpack-plugin": "^1.2.7",
        "webpack": "^3.12.0"
    },
    dependenciesToRemove: ['npm', 'prompt', 'chalk'],
    fileLocations: {
        packageJsonLocation: path.resolve(__dirname, '../package.json'),
        firebaseConfigLocation: path.resolve(__dirname, '../src/services/firebaseConfig.json'),
        firebaseServiceLocation: path.resolve(__dirname, '../src/services/FirebaseService.js'),
        adsumConfigLocation: path.resolve(__dirname, '../public', 'config.json')
    }
};
