'use strict';

var gulp = require('gulp');
var watch = require('gulp-watch');
var mainBowerFiles = require('main-bower-files');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');

var paths = {
    server: './server.js',
    build: './build/',
    lib: './build/lib/',
    src: './src/**/*'
};

gulp.task('default', ['frontend', 'lib', 'serve', 'watch']);

gulp.task('frontend', function () {
    return gulp.src(paths.src)
        .pipe(gulp.dest(paths.build))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('lib', function() {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest(paths.lib));
});

gulp.task('watch', function(){
    watch([paths.src], function() {
        gulp.start('frontend');
    });
});

gulp.task('serve', ['backend'], function () {
    browserSync.init({
        proxy: 'localhost:9000'
    });
});

gulp.task('backend', function () {
    nodemon({
        script: paths.server
    });
});