var gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	nib = require('nib'),
	autoprefixer = require('autoprefixer'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	stylus = require('gulp-stylus'),
	poststylus = require('poststylus'),
	postcss = require('gulp-postcss'),
	imagemin = require('gulp-imagemin'),
	lost = require('lost'),
	rupture = require('rupture');
	jade = require('gulp-jade'),
	gulputil = require('gulp-util'),
	githubPages = require('gulp-gh-pages'),
	browserSync = require('browser-sync').create();

gulp.task('default', ['build-all'], function () {
	browserSync.init({server: {baseDir: "./public"}
	});

	// watch changes.
	gulp.watch('src/**/*.jade', ['templates']);
	gulp.watch('src/scripts/**/*.coffee', ['scripts']);
	gulp.watch('src/styles/*.styl', ['styles']);
});

gulp.task('publish', function(){
	return gulp.src('./public/**/*').pipe(githubPages());
});

gulp.task('build-all', ['styles', 'templates', 'scripts', 'imagemin']);

gulp.task('styles', function () {
	return gulp.src('src/styles/main.styl')
		.pipe(sourcemaps.init())
		.pipe(stylus({
			paths: ['node_modules'], import: ['nib'], use: [nib(), rupture()]
		}))
		.pipe(postcss([
			lost(),
			autoprefixer()
		]))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('public/styles/'))
		.pipe(browserSync.stream());
});

gulp.task('templates', function () {
	return gulp.src('src/**/*.jade')
		.pipe(jade())
		.pipe(gulp.dest('public/'))
		.pipe(browserSync.stream());
});

gulp.task('imagemin', function() {
	return gulp.src('src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('public/images/'));
});

gulp.task('scripts', ['scripts:vendor', 'coffee', 'concat']);

gulp.task('coffee', function () {
	return gulp.src('src/scripts/*.coffee')
		.pipe(coffee({ bare: true }).on('error', gulputil.log))
		.pipe(gulp.dest('.tmp/src/scripts/'));
});

gulp.task('concat', function () {
	return gulp.src('.tmp/src/scripts/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('scripts.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public/scripts/'))
		.pipe(browserSync.stream());
});

gulp.task('scripts:vendor', function (callback) {
	return gulp.src(['./node_modules/jquery/dist/jquery.min.js'])
		.pipe(sourcemaps.init())
		.pipe(concat('vendor.js'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('public/scripts/'));
});

