"use strict";

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    nunjucksRender = require('gulp-nunjucks-render'),
    server = require("browser-sync"),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    del = require('del'),
    runSequence = require('run-sequence').use(gulp),
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    rename = require('gulp-rename');

gulp.task('layout', function () {
    nunjucksRender.nunjucks.configure(['src/njc/templates/']);
    return gulp.src(['src/njc/pages/**/*.+(html|njc)'])
        .pipe(nunjucksRender())
        .pipe(gulp.dest('build'))
        .pipe(server.reload({stream: true}));
});

gulp.task('styles', function () {
    var processors = [
        autoprefixer({
            browsers: ['last 2 versions']
        }), cssnano
    ];
    return gulp.src('src/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css'))
        .pipe(server.reload({stream: true}));
});

gulp.task('images', function () {
    return gulp.src(['src/images/**/*'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('build/images'))
        .pipe(server.reload({stream: true}));
});

gulp.task('scripts', function () {
    return gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/swiper/dist/js/swiper.min.js',
        'bower_components/chosen/chosen.jquery.min.js',
        'src/js/**/*'
    ])
        .pipe(gulp.dest('build/js'))
        .pipe(server.reload({stream: true}));
});

gulp.task('svgstore', function () {
    return gulp
        .src('src/images/svg/*.svg')
        .pipe(svgmin())
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(rename({prefix: 'icon-'}))
        .pipe(svgstore({inlineSvg: true}))
        .pipe(cheerio({
            run: function ($) {
                $('svg').attr('style', 'display:none');
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest('build/images'));
});

gulp.task('fonts', function () {
    return gulp.src([
        'src/font/**/*'
    ])
        .pipe(gulp.dest('build/font'))
        .pipe(server.reload({stream: true}));
});

gulp.task('clean', function () {
    del('build/*');
});

gulp.task('build', function (callback) {
    runSequence('clean', 'layout', 'styles', 'scripts', 'images', 'fonts', 'svgstore', callback)
});

gulp.task('serve', ['layout', 'styles', 'scripts', 'images', 'fonts', 'svgstore'], function () {
    server.init({
        server: 'build',
        notify: false,
        open: true,
        ui: false
    });

    gulp.watch('src/**/*.{scss,sass}', ['styles']);
    gulp.watch('src/**/*.+(html|njc)', ['layout']);
    gulp.watch('src/**/*.js', ['scripts']);
    gulp.watch(['src/**/*.+(jpg,png)', 'src/**/**/*.+(jpg,png)'], ['images']);
    gulp.watch('src/**/*.+(woff,woff2)', ['fonts']);
    gulp.watch('src/**/**/*.svg', ['svgstore']);
});
