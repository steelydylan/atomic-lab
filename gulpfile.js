var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var atomic = require('./index.js');
var bs = require('browser-sync').create();

gulp.task('sass', function () {
    gulp.src(['css/src/atomic-lab.scss'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(gulp.dest('css/'));
});

gulp.task('js', function () {
    gulp.src(['js/src/main.js'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(browserify())
        .pipe(gulp.dest('js/dist'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('js/dist'))
        .pipe(bs.reload())
        .pipe(notify('js task finished'))
});

gulp.task('atomic', function(){
		atomic.build({
			src:"components/",
			dist:"./resources/setting.json",
			markup:"ejs"
		}).then(bs.reload());
});

gulp.task('default', function () {
    bs.init({
        server: "./"
    });
    gulp.watch('js/src/**/*.js', ['js']);
    gulp.watch('css/src/**/*.scss', ['sass']);
    gulp.watch('components/**',['atomic']);
});

gulp.task('sass-watch', function () {
		bs.init({
        server: "./"
    });
    gulp.watch('css/src/**/*.scss', ['sass']);
});

gulp.task('js-watch', function () {
    bs.init({
        server: "./"
    });
    gulp.watch('js/src/**/*.js', ['js']);
});
