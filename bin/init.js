var atomic = require('./index.js');
var bs = require('browser-sync').create();

bs.init({
    server: "./styleguide"
});
atomic.init({
	dist:"styleguide"
}).then(bs.reload());
