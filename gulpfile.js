var browserify = require('gulp-browserify');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');


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
 
function buildJS(isProduction) {
	return function() {
		try {
			gulp.src(paths.app_js)
				.pipe(plumber())
				.pipe(browserify({
					transform: ['mithrilify'],
					paths: [paths.scripts],
				}))
				.pipe(gulpif(isProduction, uglify()))
				.pipe(rename(paths.bundle))
				.pipe(gulp.dest(paths.build))
		} catch (e) {
			console.log(e);
		}
	};
}

gulp.task('js', buildJS());
gulp.task('js-prod', buildJS(true));

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
gulp.task('serve', function() {
	gulp.src('app')
		.pipe(webserver({
			port: 3000
		}));
});

gulp.task('default', ['watch', 'js', 'less', 'serve']);

gulp.task('build', ['js-prod', 'less']);
