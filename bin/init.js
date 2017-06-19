"use strict";

const atomic = require('../index.js');
const fs = require("fs");
const path = require('path');
const processPath = process.cwd();

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
  },
  m:{
  	alias: 'markup',
  	default: 'ejs'
  },
  e:{
    alias: 'examples',
  	default: true
  }
}

const replace = function(str,before,after){
	const regExp = new RegExp(before,"g");
	return str.replace(regExp,after);
}

exports.handler = function (argv) {
  atomic.init({
    dist: argv.dist,
    src: argv.src,
    examples: argv.examples
  });
};
