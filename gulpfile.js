"use strict";

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	cssnano = require('cssnano'),
	nunjucksRender = require('gulp-nunjucks-render'),
	server = require("browser-sync"),
	sourcemaps = require('gulp-sourcemaps'),
	runSequence = require('run-sequence').use(gulp),
	del = require('del'),
    rigger = require('gulp-rigger'),
    uglify = require('gulp-uglify'),
	svgSprite = require('gulp-svg-sprites'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace');



gulp.task('svg-sprite', function () {
	return gulp.src("src/images/icons-svg/*.svg")
	// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill and style declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[style]').removeAttr('style');
				$('[stroke]').removeAttr('stroke');
			},
			parserOptions: { xmlMode: true }
		}))
		// cheerio plugin create unnecessary string '>', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
				mode: "symbols",
				preview: false,
				selector: "icon-%f",
				svg: {
					symbols: 'sprite.svg'
				}
			}
		))
		.pipe(gulp.dest("src/images/"));
});


gulp.task('layout', function () {
	nunjucksRender.nunjucks.configure(['src/njc/templates/']);
	return gulp.src(['src/njc/pages/**/*.+(html|njc)'])
		.pipe(nunjucksRender())
		.pipe(gulp.dest('build'))
		.pipe(server.reload({stream: true}));
});

gulp.task('js-build', function () {
	gulp.src('src/js/c*.js')
        .pipe(rigger())
        .pipe(uglify())
		.pipe(gulp.dest('build/js'))
        .pipe(server.reload({stream:true}))

});

gulp.task('styles', function () {
	var processors = [
		autoprefixer({
			browsers: ['last 2 versions']
		}),
	];
	return gulp.src('src/scss/style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(processors))
		.pipe(gulp.dest('build/css'))
		.pipe(server.reload({stream: true}));
});

gulp.task('images', function () {
	return gulp.src(['src/images/*'])
		.pipe(gulp.dest('build/images'))
		.pipe(server.reload({stream: true}));
});

gulp.task('fonts', function () {
	return gulp.src(['src/fonts/*'])
		.pipe(gulp.dest('build/fonts'))
		.pipe(server.reload({stream: true}));
});

gulp.task('clean', function () {
	del('build/*');
});

gulp.task('build', function (callback) {
	runSequence('clean', 'layout', 'styles', 'js-build', 'svg-sprite', 'images', 'fonts', /*'svgstore',*/ callback)
});

gulp.task('serve', ['layout', 'styles', 'js-build', 'svg-sprite', 'images', 'fonts' /*, 'svgstore'*/], function () {
	server.init({
		server: 'build',
		notify: false,
		open: true,
		ui: false
	});
	gulp.watch('src/**/*.{scss,sass}', ['styles']);
	gulp.watch('src/**/*.+(html|njc)', ['layout']);
	gulp.watch('src/**/*.js', ['js-build']);
	gulp.watch(['src/**/*.+(jpg,png,svg)', 'src/**/**/*.+(jpg,png,svg)'], ['images']);
	gulp.watch('src/**/**/*.svg', ['svg-sprite'], ['images']);
	gulp.watch('src/**.+(woff,woff2)', ['fonts']);
});