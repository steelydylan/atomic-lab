#! /usr/bin/env node
var argv = require('yargs')
	.command('init','Copy template & theme & config file',require('./init.js'))
	.command('build','update component guide',require('./build.js'))
	.alias('v', 'version')
  .version(function() { return require('../package').version; })
  .describe('v', 'show version information')
  .detectLocale(false)
  .alias('h', 'help')
  .strict()
  .argv
