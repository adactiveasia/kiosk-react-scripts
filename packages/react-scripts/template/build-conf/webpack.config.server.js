const path = require('path');
const { DefinePlugin } = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    cache: true,
    target: 'node',
    entry: ['./server/index'],
    output: {
        path: path.join(`${__dirname}/../`, '/public/server'),
        libraryTarget: 'commonjs2',
        filename: 'application-server.min.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [path.join(__dirname + '/../', "server")],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: [
                            ['airbnb', { node: 8 }],
                        ]
                    }
                }]
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin(),
        new DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
    ]
};
