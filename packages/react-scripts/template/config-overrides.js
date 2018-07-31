"use strict";

const path = require('path');
const { getBabelLoader } = require('react-app-rewired');

module.exports = function override(config /* , env */) {
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
};
