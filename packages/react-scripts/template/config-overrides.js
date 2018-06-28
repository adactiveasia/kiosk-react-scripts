const path = require('path');

module.exports = function override(config, env) {
    //do stuff with the webpack config...

    let babelLoader = getBabelLoader(config.module.rules);
    const include = babelLoader.include;
    delete babelLoader.include;
    babelLoader.include = [include, path.resolve('node_modules/@adactive')]

    return config;
};