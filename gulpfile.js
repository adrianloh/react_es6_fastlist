var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');

// Basic usage
gulp.task('scripts', function() {

    var entryFile = './jsx/app.jsx';

    var bundler = browserify(entryFile, {extensions: [ ".js", ".jsx" ]});

    bundler.transform('babelify', {presets: ['es2015', 'react']});

    var stream = bundler.bundle();

    stream.on('error', function (err) { console.error(err.toString()) });

    stream
        .pipe(source(entryFile))
        .pipe(rename('index.js'))
        .pipe(gulp.dest('.'));

});

gulp.task('watch', function() {
    gulp.watch(['./jsx/**/*'], ['scripts']);
});

// What runs when you just type `gulp`
gulp.task('default', ['watch']);