#! /usr/bin/env node
"use strict";

const atomic = require('../index.js');

exports.builder = {
  d: {
    alias: 'dist',
    describe: 'set atomic-lab directory',
    default: 'styleguide/',
  },
  s: {
    alias: 'src',
    describe: 'set component directory',
    default: 'components/'
  },
  e: {
    alias: 'exts',
    describe: 'set component directory',
    default: 'html,ejs,jade,haml,pug,css,scss,less,txt,text'
  }
}

exports.handler = function (argv) {
  atomic.build({
    src: argv.src,
    dist: argv.dist,
    exts: argv.exts
  });
};
