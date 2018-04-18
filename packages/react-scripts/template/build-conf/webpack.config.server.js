const path = require('path');
const webpack = require('webpack');

const SUPPORT = {
    ES6: 'es6'
};

const getConfig = (support, isProd) => {
    let filename = 'application-server';

    switch (support) {
    case SUPPORT.ES6:
        filename += '.es6';
        break;
    case SUPPORT.ES5:
        filename += '.es5';
        break;
    default: throw new Error('Unhandled switch case');
    }

    if (isProd) {
        filename += '.min';
    }

    const babelLoader = {
        test: /\.js$/,
        include: [path.join(`${__dirname}/../`, 'server')],
        loader: 'babel-loader',
        query: {
            cacheDirectory: true
        }
    };

    const config = {
        cache: true,
        target: 'node',
        entry: ['./server/index'],
        output: {
            path: path.join(`${__dirname}/../`, '/public/server'),
            library: 'APB',
            libraryTarget: 'umd',
            filename: `${filename}.js`
        },
        plugins: [
            new webpack.optimize.AggressiveMergingPlugin()
        ],
        module: {
            rules: [
                babelLoader
            ]
        }/* ,
        externals: {send: "send", compression: "compression", "body-parser": "body-parser", connect: "connect", "serve-static": "serve-static"} */
    };

    if (isProd) {
        config.plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            minimize: true,
            mangle: false
        }));
        config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    }

    switch (support) {
    case SUPPORT.ES5:
        babelLoader.query.presets = ['es2015'];
        break;
    default: break;
    }

    return config;
};

module.exports = [
    getConfig(SUPPORT.ES6, false)
];
