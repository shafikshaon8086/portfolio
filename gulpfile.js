var gulp = require('gulp');
var pug = require('gulp-pug');
var less = require('gulp-less');
var minifyCSS = require('gulp-csso');
var sourcemaps = require('gulp-sourcemaps');
var headerComment = require('gulp-header-comment');
var about = require('gulp-about');
var uglify = require('gulp-uglify');
var cloudinaryUpload = require('gulp-cloudinary-upload');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

gulp.task('html', function() {
  return gulp.src('*.html')
    .pipe(headerComment(`
      License: <%= pkg.license %>
      Generated on <%= moment().format('YYYY-MM-DD HH:mm') %>
      Author: <%= _.upperFirst(pkg.author) %>
    `))
    .pipe(gulp.dest('dist/'))
});

gulp.task('css', function() {
  return gulp.src('assets/css/*.css')
    .pipe(headerComment(`
      License: <%= pkg.license %>
      Generated on <%= moment().format('YYYY-MM-DD HH:mm') %>
      Author: <%= _.upperFirst(pkg.author) %>
    `))
    .pipe(less())
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifyCSS({compatibility: 'ie8', keepBreaks:false}))
    .pipe(gulp.dest('dist/css'))
});


// Minify JavaScript and uglify with UglifyJS3
gulp.task('js', function() {
  return gulp.src('assets/js/*.js')
    .pipe(headerComment(`
      License: <%= pkg.license %>
      Generated on <%= moment().format('YYYY-MM-DD HH:mm') %>
      Author: <%= _.upperFirst(pkg.author) %>
    `))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'))
});


// generating information about your application build, such as name, version
gulp.task('about', function() {
  return gulp.src('package.json')
    .pipe(about({
      keys: ['name', 'version', 'author'], // properties to pick from the source
      inject: { // custom properties to inject
        buildDate: Date.now()
      }
    }))
    .pipe(gulp.dest('dist/')); // writes dist/about.json
});

// Batch upload images to Cloudinary
gulp.task('cloudinary-image', () =>
  gulp.src('src/images/*')
  .pipe(cloudinaryUpload({
    config: {
      cloud_name: 'shafikshaon',
      api_key: '249458841427157',
      api_secret: 'W96rBdVP0tMB3bSubUSYCqmx2t0'
    }
  }))
);


// Static Server + watching scss/html files
// https://browsersync.io/docs
gulp.task('serve', function() {

  browserSync.init({
    server: "./"
  });

  // gulp.watch("app/scss/*.scss", ['sass']);
  gulp.watch("*.html").on('change', browserSync.reload);
  gulp.watch("assets/css/*.css").on('change', browserSync.reload);
  gulp.watch("assets/js/*.js").on('change', browserSync.reload);
  gulp.watch("assets/img/*").on('change', browserSync.reload);
});


gulp.task('default', ['html', 'css', 'js', 'serve', 'cloudinary-image', 'about']);
