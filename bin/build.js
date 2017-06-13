#! /usr/bin/env node
"use strict";

const atomic = require('../index.js');
exports.builder = {
  d:{
  	alias: 'dist',
  	describe: 'set atomic-lab directory',
  	default:"atomic-lab/resources/setting.json"
  },
  m:{
  	alias: 'markup',
  	describe: 'set template engine',
  	default:"html"
  },
  s:{
  	alias: 'src',
  	describe: 'set component directory',
  	default:"components/"
  }
}

exports.handler = function (argv) {
	atomic.build({
	src:argv.src,
	dist:argv.dist,
	markup:argv.markup
	});
};
