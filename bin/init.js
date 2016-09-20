var atomic = require('../index.js');
exports.builder = {
  d:{
  	alias: 'dist',
  	describe: 'set styleguide directory',
  	default:"styleguide"
  },
  sample:{
  	default:true
  }
}

exports.handler = function (argv) {
	atomic.init({
		dist:argv.dist,
		sample:argv.sample
	});
};
