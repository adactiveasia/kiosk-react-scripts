const {getBabelLoader} = require('react-app-rewired');

module.exports = function override(config, env) {
    //do stuff with the webpack config...

    let babelLoader = getBabelLoader(config.module.rules);
    delete babelLoader.include;

    return config;
};