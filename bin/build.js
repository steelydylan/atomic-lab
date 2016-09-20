var atomic = require('./index.js');
var bs = require('browser-sync').create();

atomic.build({
	src:"components/",
	dist:"./resources/setting.json",
	markup:"ejs"
}).then(bs.reload());
