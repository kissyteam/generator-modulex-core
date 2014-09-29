/**
 *  a build template for mx modules
 *  @author yiminghe@gmail.com
 */
var gulp = require('gulp');
var filter = require('gulp-filter');
var kclean = require('gulp-kclean');
var modulex = require('gulp-modulex');
var path = require('path');
var rename = require('gulp-rename');
var packageInfo = require('./package.json');
var cwd = process.cwd();
var src = path.resolve(cwd, 'lib');
var build = path.resolve(cwd, 'build');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var jscs = require('gulp-jscs');
var replace = require('gulp-replace');
var minifyCSS = require('gulp-minify-css');

gulp.task('lint', function () {
    return gulp.src(['./lib/**/*.js', '!./lib/**/xtpl/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'))
        .pipe(jscs());
});

gulp.task('clean', function () {
    return gulp.src(build, {
        read: false
    }).pipe(clean());
});

gulp.task('build', ['lint'], function () {
    var tag = '<%= appname %>';
    var packages = {};
    packages[tag] = {
        base: path.resolve(src, tag)
    };
    return gulp.src('./lib/' + tag + '.js')
        .pipe(modulex({
            modulex: {
                packages: packages
            }
        }))
        .pipe(kclean({
            files: [
                {
                    src: './lib/' + tag + '-debug.js',
                    outputModule: tag
                }
            ]
        }))
        .pipe(replace(/@VERSION@/g, packageInfo.version))
        .pipe(gulp.dest(path.resolve(build)))
        .pipe(filter(tag + '-debug.js'))
        .pipe(replace(/@DEBUG@/g, ''))
        .pipe(uglify())
        .pipe(rename(tag + '.js'))
        .pipe(gulp.dest(path.resolve(build)));
});

gulp.task('mx', function () {
    var aggregateBower = require('aggregate-bower');
    aggregateBower('bower_components/', 'mx_modules/');
});

gulp.task('auto-d', function () {
    require('auto-deps')(cwd);
});

gulp.task('watch', function () {
    gulp.watch('lib/**/*.xtpl', ['xtpl']);
});

gulp.task('xtpl', function () {
    var gulpXTemplate = require('gulp-xtemplate');
    var XTemplate = require('xtemplate');
    gulp.src('lib/**/*.xtpl').pipe(gulpXTemplate({
        wrap: false,
        runtime: 'xtemplate/runtime',
        suffix: '.xtpl',
        XTemplate: XTemplate
    })).pipe(gulp.dest('lib'))
});

gulp.task('less', function () {
    var less = require('gulp-less');
    return gulp.src('lib/date-picker/assets/dpl.less').pipe(less({
        paths: [path.join(__dirname, 'lib/date-picker/assets/')]
    }))
        .pipe(rename('dpl-debug.css'))
        .pipe(gulp.dest('lib/date-picker/assets/'))
        .pipe(rename('dpl.css'))
        .pipe(minifyCSS({keepBreaks: true}))
        .pipe(gulp.dest('lib/date-picker/assets/'));
});

gulp.task('default', ['build']);