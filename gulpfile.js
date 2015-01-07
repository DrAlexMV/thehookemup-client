var browserify = require('gulp-browserify');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');

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
	try {
		gulp.src(paths.app_js)
			.pipe(plumber())
			.pipe(browserify({
				transform: ['mithrilify'],
				paths: [paths.scripts],
			}))
			.pipe(rename(paths.bundle))
			.pipe(gulp.dest(paths.build))
	} catch (e) {
		console.log(e);
	}
});
 
// Rerun tasks whenever a file changes.
gulp.task('watch', function() {
	try {
		gulp.watch(paths.less_files, ['less']);
		gulp.watch(paths.js, ['js']);
	} catch(e) {
		console.log(e);
	}
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

gulp.task('build', ['js', 'less']);
