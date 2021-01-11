const gulp = require('gulp');
const sass = require('gulp-sass');//npm install gulp-sass --save-dev // https://www.npmjs.com/package/gulp-sass/
const concat = require('gulp-concat');//npm install gulp-concat --save-dev //https://www.npmjs.com/package/gulp-concat/
const csso = require('gulp-csso');//npm install gulp-csso --save-dev //https://www.npmjs.com/package/gulp-csso/
const configuration = require('./configuration.js');
const project = require('./project.js');
const util = require('./util.js');
const folderSass = 'sass';
const pathSass = configuration.src + 'css/' + folderSass + '/*.scss';


const fileCssAdmin = [
    pathSass,
    configuration.src + 'css/wb-admin/*.scss'
];

const fileCssTheme = [
    pathSass,
    configuration.src + 'css/wb-theme/*.scss'
];
const cssAdminConcat = fileCssAdmin;
const cssThemeConcat = fileCssTheme;
const fileAdmin = 'wb-admin';
const fileTheme = 'wb-theme';










gulp.task('css_admin_concat', function () {
    return gulp
        .src(cssAdminConcat)
        .pipe(concat(fileAdmin + '.scss'))
        .pipe(gulp.dest(configuration.dist + folderSass + '/'));
});

gulp.task('css_admin_sass', function () {
    return gulp
        .src(configuration.dist + folderSass + '/' + fileAdmin + '.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest(configuration.dist + configuration.assets + 'css/'));
});

gulp.task('css_admin', gulp.series(
    'css_admin_concat',
    'css_admin_sass',
    'beep'
));






gulp.task('css_theme_concat', function () {
    return gulp
        .src(cssThemeConcat)
        .pipe(concat(fileTheme + '.scss'))
        .pipe(gulp.dest(configuration.dist + folderSass + '/'));
});

gulp.task('css_theme_sass', function () {
    return gulp
        .src(configuration.dist + folderSass + '/' + fileTheme + '.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest(configuration.dist + configuration.assets + 'css/'));
});

gulp.task('css_theme', gulp.series(
    'css_theme_concat',
    'css_theme_sass',
    'beep'
));




gulp.task('css_minify', function () {
    return gulp
        .src(configuration.dist + configuration.assets + 'css/*.*')
        .pipe(csso())
        .pipe(gulp.dest(configuration.dist + configuration.assets + 'css/'));
});




module.exports = {
    cssAdminConcat: cssAdminConcat,
    cssThemeConcat: cssThemeConcat
};