var gulp = require('gulp'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    fileinclude = require('gulp-file-include'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create();

var config = {
  path: {
    src: {
      styles: './src/stylesheets/styles.scss',
      templates : './src/templates/*.html',
      js: './src/javascripts/**/*.js',
      fonts: './src/fonts/**',
      images: './src/images/**'
    },
    dest: {
      styles: './build/stylesheets/',
      templates: './build/',
      js: './build/javascripts/',
      fonts: './build/fonts/',
      images: './build/images/'
    },
    build: './build/',
    watch: {
      styles: './src/stylesheets/**/*.scss',
      templates: './src/templates/**/*.html',
      js: './src/javascripts/**/*',
      images: './src/images/**/*'
    }
  }
};

gulp.task('styles', function() {
	return gulp.src(config.path.src.styles)
    .pipe(plumber())
		.pipe(sass({
      outputStyle: 'compressed'
    }))
    .on('error', notify.onError({
      message: "<%= error.message %>",
      title: "Stylus Error"
    }))
		.pipe(gulp.dest(config.path.dest.styles))
    .pipe(browserSync.stream());
});

gulp.task('templates', function() {
	return gulp.src(config.path.src.templates)
    .pipe(fileinclude({
      prefix: '@',
      basepath: './src/templates/blocks'
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(plumber())
    .on('error', notify.onError({
      message: "<%= error.message %>",
      title: "HTML Error"
    }))
    .pipe(gulp.dest(config.path.dest.templates))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src(config.path.src.js)
    .pipe(plumber())
    .on('error', notify.onError({
      message: "<%= error.message %>",
      title: "JS Error"
    }))
    .pipe(gulp.dest(config.path.dest.js))
    .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
  return gulp.src(config.path.src.fonts)
    .pipe(plumber())
    .on('error', notify.onError({
      message: "<%= error.message %>",
      title: "Fonts Error"
    }))
    .pipe(gulp.dest(config.path.dest.fonts))
    .pipe(browserSync.stream());
});

gulp.task('images', function() {
  gulp.src(config.path.src.images)
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5
    }))
    .pipe(plumber())
    .on('error', notify.onError({
      message: "<%= error.message %>",
      title: "IMG Error"
    }))
    .pipe(gulp.dest(config.path.dest.images))
    .pipe(browserSync.stream());
});

gulp.task('clean', function() {
  return gulp.src(config.path.build, {read: false})
    .pipe(clean({force: true}))
});

gulp.task('browser-sync', function() {
  browserSync.init({
      server: config.path.build
  });
});

gulp.task('build', ['styles', 'templates', 'images', 'js', 'fonts']);

gulp.task('watch', function() {
	gulp.watch(config.path.watch.styles, ['styles']);
  gulp.watch(config.path.watch.templates, ['templates']);
  gulp.watch(config.path.watch.images, ['images']);
  gulp.watch(config.path.watch.js, ['js']);
});

gulp.task('default', ['build', 'browser-sync', 'watch']);
