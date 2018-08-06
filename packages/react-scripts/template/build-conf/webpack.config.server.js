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
        filename: 'application-server.js'
    },
    module: {
        rules: [
            {
                // Disable AMD which is messing up with is-windows
                test: /\.js$/,
                use: "imports-loader?define=>false"
            },
            {
                test: /\.js$/,
                include: [
                    path.join(__dirname + '/../server'),
                    path.join(__dirname + '/../node_modules/@adactive'),
                ],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: [
                            ['airbnb', { targets: { node: 8 } }],
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
