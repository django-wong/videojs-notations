/*
* @Author: Django Wong
* @Date:   2017-04-27 17:49:31
* @Last Modified by:   Django Wong
* @Last Modified time: 2017-05-17 03:32:05
* @File Name: gulpfile.js
*/

'use strict';

const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();

gulp.task('build', function(){
	return gulp.src('src/*.js').
		pipe($.babel()).
		pipe(gulp.dest('dist/'));
});

gulp.task('less', function(){
	return gulp.src('src/*.less').
		pipe($.less()).
		pipe(gulp.dest('dist/'));
});

gulp.task('watch', function(){
	gulp.watch('src/*.js', ['build']);
	gulp.watch('src/*.less', ['less'])
});

gulp.task('default', ['watch', 'less', 'build']);