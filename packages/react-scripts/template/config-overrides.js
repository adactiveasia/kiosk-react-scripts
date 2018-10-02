/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const { getBabelLoader } = require('react-app-rewired');
const { Server, DataUpdater } = require('./server/build/application-server'); // eslint-disable-line import/no-unresolved

module.exports = {
  // The Webpack config to use when compiling your react app for development or production.
  webpack(config, env) {
    // do stuff with the webpack config...

    const babelLoader = getBabelLoader(config.module.rules);
    const { include } = babelLoader;

    if (env === 'production') {
      babelLoader.include = [
        include,
        path.resolve('node_modules'),
      ];
    } else {
      babelLoader.include = [
        include,
        path.resolve('node_modules/@adactive'),
        path.resolve('node_modules/prex-es5'),
      ];
    }

    return config;
  },
  // The function to use to create a webpack dev server configuration when running the development
  // server with 'npm run start' or 'yarn start'.
  devServer(configFunction) {
    // Return the replacement function for create-react-app to use to generate the Webpack
    // Development Server config. "configFunction" is the function that would normally have
    // been used to generate the Webpack Development server config - you can use it to create
    // a starting configuration to then modify instead of having to create a config from scratch.
    return function configDevServer(proxy, allowedHost) {
      // Start update data
      const updater = new DataUpdater();
      updater.update('./public');

      // Create the default config by calling configFunction with the proxy/allowedHost parameters
      const config = configFunction(proxy, allowedHost);

      // Comment next line to watch changes in public folder
      config.watchContentBase = false;

      const baseBefore = config.before;
      config.before = (app, ...rest) => {
        const appServer = new Server({
          port: 8080,
          production: false,
          path: path.resolve(__dirname, '..'),
        });
        appServer.bindApis(app);

        if (typeof baseBefore === 'function') {
          baseBefore(app, ...rest);
        }
      };

      // Return your customised Webpack Development Server config.
      return config;
    };
  },
};
