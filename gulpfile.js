var browserify = require('gulp-browserify');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');

// Define some paths.
var paths = {
  app_js: ['./app/js/routes.js'], // 'entry point'
  js: ['./app/js/**/*.js'],
  less_files: ['./app/styles/*.less'],
  build: './app/build/',
  style: './app/styles/',
  scripts: './app/js/',
  bundle: 'bundle.js',
};

// Our CSS task. It finds all our Less files and compiles them.
gulp.task('less', function () {
  gulp.src(paths.less_files)
    .pipe(less())
    .pipe(gulp.dest(paths.style));
});
 
gulp.task('js', function() {
  gulp.src(paths.app_js)
    .pipe(browserify({
      transform: ['mithrilify'],
      paths: [paths.scripts],
    }))
    .pipe(rename(paths.bundle))
    .pipe(gulp.dest(paths.build))
});
 
// Rerun tasks whenever a file changes.
gulp.task('watch', function() {
  gulp.watch(paths.less_files, ['less']);
  gulp.watch(paths.js, ['js']);
});
 
// Static server
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./app"
    }
  });
});

gulp.task('default', ['watch', 'js', 'less', 'browser-sync']);
