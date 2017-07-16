"use strict";

const atomic = require('../index.js');

exports.builder = {
  d:{
  	alias: 'dist',
  	describe: 'set atomic-lab directory',
  	default: 'styleguide'
  },
  s:{
  	alias: 'src',
  	describe: 'set your component\'s directory',
  	default: 'components'
  }
}

exports.handler = function (argv) {
  atomic.init({
    dist: argv.dist,
    src: argv.src
  });
};
