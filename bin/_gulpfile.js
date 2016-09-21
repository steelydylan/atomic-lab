var gulp = require('gulp');
var atomic = require('atomic-lab');
var bs = require('browser-sync').create();

gulp.task('atomic-init', function(){
		bs.init({
        server: "{dist}"
    });
		atomic.init({
			dist:"{dist}"
		}).then(bs.reload());
});

gulp.task('atomic', function(){
		atomic.build({
			src:"{src}",
			dist:"{dist}/resources/setting.json",
			markup:"{markup}"
		}).then(bs.reload());
});

gulp.task('atomic-watch', function () {
    gulp.watch('{src}/**',['atomic']);
});
