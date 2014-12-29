var gulp = require('gulp');
var msx = require('msx');
var through = require('through2');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');

var watch_dir = './app/profile/';

function msxTransform(name) {
  return through.obj(function (file, enc, cb) {
    try {
      file.contents = new Buffer(msx.transform(file.contents.toString()));
      file.path = gutil.replaceExtension(file.path, '.js');
    }
    catch (err) {
      err.fileName = file.path;
      this.emit('error', new gutil.PluginError('msx', err))
    }
    this.push(file);
    cb()
  })
}

gulp.task('msx', function() {
  return gulp.src(watch_dir+'*.jsx')
    .pipe(plumber())
    .pipe(msxTransform())
    .on('error', function(e) {
      console.error(e.message + '\n  in ' + e.fileName);
    })
    .pipe(gulp.dest(watch_dir))
});

gulp.task('watch', function() {
  gulp.watch([watch_dir+'*.jsx'], ['msx'])
});

// Static server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "./app"
		}
	});
});

gulp.task('default', ['watch', 'msx', 'browser-sync']);

