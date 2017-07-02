"use strict";

const atomic = require('../index.js');

exports.builder = {
  d:{
  	alias: 'dist',
  	describe: 'set atomic-lab directory',
  	default: 'styleguide'
  }
}

exports.handler = function (argv) {
  atomic.update({
    dist: argv.dist,
    src: argv.src
  });
};
