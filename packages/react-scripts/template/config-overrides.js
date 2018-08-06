"use strict";

const path = require('path');
const { getBabelLoader } = require('react-app-rewired');

module.exports = {
    // The Webpack config to use when compiling your react app for development or production.
    webpack: function (config /* , env */) {
        // do stuff with the webpack config...

        const babelLoader = getBabelLoader(config.module.rules);
        const { include } = babelLoader;
        delete babelLoader.include;
        babelLoader.include = [
            include,
            path.resolve('node_modules/@adactive'),
            path.resolve('node_modules/prex-es5'),
        ];

        return config;
    },
    // The function to use to create a webpack dev server configuration when running the development
    // server with 'npm run start' or 'yarn start'.
    devServer: function (configFunction) {
        // Return the replacement function for create-react-app to use to generate the Webpack
        // Development Server config. "configFunction" is the function that would normally have
        // been used to generate the Webpack Development server config - you can use it to create
        // a starting configuration to then modify instead of having to create a config from scratch.
        return function(proxy, allowedHost) {
            // Create the default config by calling configFunction with the proxy/allowedHost parameters
            const config = configFunction(proxy, allowedHost);

            // Comment next line to watch changes in public folder
            config.watchContentBase = false;

            // Return your customised Webpack Development Server config.
            return config;
        }
    }
};
