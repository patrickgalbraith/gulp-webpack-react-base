var gulp             = require('gulp');
var sass             = require('gulp-sass');
var gutil            = require('gulp-util');
var rename           = require('gulp-rename');
var plumber          = require('gulp-plumber');
var cssnano          = require('gulp-cssnano');
var sourcemaps       = require('gulp-sourcemaps');
var webpack          = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig    = require('./webpack.config.js');

gulp.task('sass', function() {
  return gulp.src('./scss/main.scss')
    .pipe(plumber({
      errorHandler: function(err) {
        gutil.log("[sass]", err);
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      precision: 10
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass-min', ['sass'], function() {
  return gulp.src('./dist/bundle.css')
    .pipe(plumber({
      errorHandler: function(err) {
        gutil.log("[sass-min]", err);
      }
    }))
    .pipe(cssnano())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task("webpack", function(callback) {
  webpack(webpackConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString());
    callback();
  });
});

gulp.task("webpack-dev-server", function(callback) {
  var compiler = webpack(require('./webpack.config.js'));

  new WebpackDevServer(compiler).listen(8080, "localhost", function(err) {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
    gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
  });
});

gulp.task('build', ['sass', 'sass-min', 'webpack']);

gulp.task('watch', ['sass', 'sass-min', 'webpack-dev-server'], function() {
  gulp.watch([
    './scss/*.scss',
    './scss/*/*.scss'
  ], [
    'sass',
    'sass-min'
  ]);
});
