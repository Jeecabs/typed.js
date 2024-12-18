require('@babel/register');
const gulp = require('gulp');
const webpack = require('webpack-stream');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const livereload = require('gulp-livereload');
const gulpDocumentation = require('gulp-documentation');
const eslint = require('gulp-eslint');
const server = require('gulp-express');

function lint() {
  return (
    gulp
      .src('src/*.js')
      .pipe(eslint({ fix: true }))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
  );
}

function build() {
  return gulp
    .src('src/*.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./lib'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(
      uglify({
        preserveComments: 'license',
        compress: {
          /*eslint-disable */
          negate_iife: false
          /*eslint-enable */
        }
      })
    )
    .pipe(rename('typed.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('lib/'))
    .pipe(livereload());
}

function mdDocs() {
  return gulp
    .src('./src/*.js')
    .pipe(gulpDocumentation('md'))
    .pipe(gulp.dest('docs'));
}

function htmlDocs() {
  return gulp
    .src('./src/*.js')
    .pipe(
      gulpDocumentation('html', {}, {
        name: 'Typed.js Docs',
        version: '2.0.12'
      })
    )
    .pipe(gulp.dest('docs'));
}

function serve() {
  server.run(['app.js']);
  gulp.watch(['docs/**/*.html'], server.notify);
  gulp.watch(['docs/styles/**/*.scss'], stylesScss);
  gulp.watch(['{.tmp,docs}/styles/**/*.css'], stylesCss);
  gulp.watch(['docs/scripts/**/*.js'], jshint);
  gulp.watch(['docs/images/**/*'], server.notify);
}

function stylesScss() {
  // Add your styles:scss implementation here
}

function stylesCss() {
  // Add your styles:css implementation here
}

function jshint() {
  // Add your jshint implementation here
}

function watch() {
  livereload({ start: true });
  gulp.watch('src/*.js', gulp.series(mdDocs, htmlDocs, defaultTask));
}

const defaultTask = gulp.series(lint, build);

exports.lint = lint;
exports.build = build;
exports.mdDocs = mdDocs;
exports.htmlDocs = htmlDocs;
exports.serve = gulp.series(watch, serve);
exports.watch = watch;
exports.default = defaultTask;
