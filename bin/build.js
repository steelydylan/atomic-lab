#! /usr/bin/env node
var atomic = require('../index.js');
var bs = require('browser-sync').create();

bs.init({
    server: "./styleguide"
});

atomic.build({
	src:"styleguide/components/",
	dist:"resources/setting.json",
	markup:"ejs"
}).then(bs.reload());
