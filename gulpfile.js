'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const rupture = require('rupture'); // braikpoints for CSS
const uglify = require('gulp-uglify'); // minify JS
const rename = require('gulp-rename'); // rename files
const concat = require('gulp-concat'); // склеивает файлы в один
const clear = require('gulp-clean'); // clean directory
const order = require('gulp-order'); // упорядочивает поток файлов
const imagemin = require('gulp-imagemin'); // minify images
const pngquant = require('imagemin-pngquant');
const jpegtran = require('imagemin-jpegtran');
const csso = require('gulp-csso'); // minify CSS
const autoprefixer = require('gulp-autoprefixer'); // autoprefixer
const stylus = require('gulp-stylus'); // compile Stylus
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps'); // карта файлов
const plumber = require('gulp-plumber'); // ловит ошибки
const babel = require('gulp-babel'); // for ES6

var path = {

    src: {
      common: './assets/styles/common.styl',
      styles: './assets/styles/**/*.styl',
      js: './assets/scripts/modules/**/*.js',
      img: './media/dev/**/*.{png,jpg,jpeg,svg}',
      html: './**/*.html',
      clear: './assets/build/*'
    },

    watch: ['./**/*.styl', './**/*.js', './**/*.html' ],

    dest: {
      styles: './assets/build/',
      js: './assets/build/',
      img: './media/images/',
    }

}

// BrowserSync
function bsReload() {
    browserSync.init({
        proxy: 'boilerplate/'
    });
}

// BrowserSync Reload
function browserSyncReload(cb) {
    browserSync.reload();
    cb();
}

// CSS
function css() {
    return gulp.src(path.src.common)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(stylus({use:[rupture()]}))
    .pipe(autoprefixer({browsers: ['last 2 versions', 'ie 11', 'Android >= 4.1', 'Safari >= 8', 'iOS >= 8']}))
    .pipe(csso())
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('../maps/'))
    .pipe(gulp.dest(path.dest.styles))
    .pipe(browserSync.stream());
}

// JS
function js() {
    return gulp.src(path.src.js)
	.pipe(sourcemaps.init())
	.pipe(plumber())
	.pipe(babel({
		 presets: ['@babel/env']
	}))
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(rename('main.min.js'))
	.pipe(sourcemaps.write('../maps/'))
	.pipe(gulp.dest(path.dest.js))
	.pipe(browserSync.stream());
}

// Watch files
function watchFiles() {
    gulp.watch(path.src.styles, css);
    gulp.watch(path.src.js, js);
    gulp.watch(path.src.img, imageCompress);
    gulp.watch(path.src.html, browserSyncReload);
}

// Image optimize
function imageCompress() {
  return gulp.src(path.src.img)
    .pipe(plumber())
    .pipe(imagemin([
        imagemin.gifsicle(),// default
        imagemin.jpegtran({
            progressive: true
        }),
        imagemin.optipng(),// default
        imagemin.svgo()// default
    ]))
    .pipe(gulp.dest(path.dest.img));
}

// Clean
function clean() {
    return gulp.src(path.src.clear)
      .pipe(clear());
}

let build = gulp.parallel(js, css);

exports.imageCompress = imageCompress;
exports.build = build;
exports.watch = watchFiles;
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.default = gulp.series(clean, build, gulp.parallel(bsReload, watchFiles));
