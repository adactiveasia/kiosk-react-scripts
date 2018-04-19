module.exports = {
  scriptsToAdd: {
    serve: "cd build && ws --spa",
    "compile-server": "webpack --config ./build-conf/webpack.config.server.js",
    doc: "jsdoc -c ./build-conf/jsdoc_conf.app.json -t ./node_modules/ink-docstrap/template",
    "doc-server": "jsdoc -c ./build-conf/jsdoc_conf.server.json -t ./node_modules/ink-docstrap/template",
    "startServer": "node ./public/startServer --port 9001 --xml_file ./public/config.xml --data_folder ./public/local",
  },
  dependenciesToAdd: {
    "@adactive/adsum-client-api": "^2.0.0",
    "@adactive/adsum-react-native-map": "^5.0.0",
  },
  dependenciesToRemove: ['npm', 'prompt', 'chalk']
};
