var atomic = require('../index.js');
exports.builder = {
  d:{
  	alias: 'dist',
  	describe: 'set styleguide directory',
  	default:"styleguide"
  },
  s:{
  	alias: 'src',
  	describe: 'set your component\'s directory',
  	default:"components"
  },
  sample:{
  	default:true
  }
}

exports.handler = function (argv) {
	atomic.init({
		dist:argv.dist,
		src:argv.src,
		sample:argv.sample
	});
};
