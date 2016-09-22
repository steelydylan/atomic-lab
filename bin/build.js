#! /usr/bin/env node
var atomic = require('../index.js');
var bs = require('browser-sync').create();
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
  },
  server:{
  	default:"atomic-lab"
  }
}

exports.handler = function (argv) {
	bs.init({
    server: argv.server
	});
	atomic.build({
		src:argv.src,
		dist:argv.dist,
		markup:argv.markup
	}).then(bs.reload());
};
