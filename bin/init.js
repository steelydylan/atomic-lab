"use strict";

const atomic = require('../index.js');
const fs = require("fs");
const path = require('path');
const processPath = process.cwd();

exports.builder = {
  d:{
  	alias: 'dist',
  	describe: 'set atomic-lab directory',
  	default:"atomic-lab"
  },
  s:{
  	alias: 'src',
  	describe: 'set your component\'s directory',
  	default:"components"
  },
  m:{
  	alias: 'markup',
  	default:'html'
  },
  sample:{
  	default:true
  }
}

const replace = function(str,before,after){
	const regExp = new RegExp(before,"g");
	return str.replace(regExp,after);
}

exports.handler = function (argv) {
  atomic.init({
    dist:argv.dist,
    src:argv.src,
    sample:argv.sample
  });
  fs.readFile(__dirname+"/_gulpfile.js", 'utf8', function (err, data) {
    if (err) throw err;
    data = replace(data,"{src}",argv.src);
    data = replace(data,"{dist}",argv.dist);
    data = replace(data,"{markup}",argv.markup);
    fs.writeFile(path.resolve(processPath,"./_gulpfile.js"),data,function(err){
    if (err) throw err;
    });
  });
};
