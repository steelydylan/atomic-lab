#! /usr/bin/env node
var atomic = require('../index.js');
var bs = require('browser-sync').create();
exports.builder = {
  d:{
  	alias: 'dist',
  	describe: 'set styleguide directory',
  	default:"resources/setting.json"
  },
  m:{
  	alias: 'markup',
  	describe: 'set template engine',
  	default:"ejs"
  },
  s:{
  	alias: 'source',
  	describe: 'set component directory',
  	default:"styleguide/components/"
  },
  sample:{
  	default:true
  }
}

exports.handler = function (argv) {
	bs.init({
    server: "./styleguide"
	});
	atomic.build({
		src:argv.source,
		dist:argv.dist,
		markup:argv.markup
	}).then(bs.reload());
};
