var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('sass', function () {
    gulp.src(['css/src/**/*.scss'])
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
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(browserify())
        .pipe(gulp.dest('js/dist'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('js/dist'))
        .pipe(reload({
            stream: true
        }))
        .pipe(notify('js task finished'))
});
gulp.task('default', function () {
    browserSync.init({
        server: "./"
    });
    gulp.watch('js/src/**/*.js', ['js']);
    gulp.watch('css/src/**/*.scss', ['sass']);
});
gulp.task('sass-watch', function () {
    gulp.watch('css/src/**/*.scss', ['sass']);
});
