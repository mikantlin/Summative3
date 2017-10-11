'use strict';
 
const gulp = require('gulp');

// css plugins
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

// browser plugin
const browserSync = require('browser-sync').create();

// tasks
gulp.task('sass', () => {
  return gulp.src('./sass/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
    port: 3030,
    https: true,
  })
});

gulp.task('watch', ['browserSync','sass'], function() {
  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch('./*.html', browserSync.reload);
  gulp.watch('./js/**/*.js', browserSync.reload);
});