const gulp = require('gulp');
const concat = require('gulp-concat');//npm install gulp-concat --save-dev //https://www.npmjs.com/package/gulp-concat/
const uglify = require("gulp-uglifyes");//npm install gulp-uglifyes --save-dev //https://www.npmjs.com/package/gulp-uglifyes
const removeCode = require('gulp-remove-code');//npm install gulp-remove-code --save-dev https://www.npmjs.com/package/gulp-remove-code
const configuration = require('./configuration.js');



const fileJs_DefaultFinal = 'wb-theme.js';
const fileJs_AdminFinal = 'wb-admin.js';
const fileJs_ = [
    configuration.src + 'js/wb-theme/_WbDebug.js',
    configuration.src + 'js/wb-theme/**/!(_)*.js',
    configuration.src + 'js/wb-theme/_main.js'
];
const fileJs_admin_ = [
    configuration.src + 'js/wb-admin/**/*.*'
];







gulp.task('js_default_concat', function () {
    return gulp.src(fileJs_)
        .pipe(concat(fileJs_DefaultFinal))
        .pipe(gulp.dest(configuration.dist + configuration.assets + 'js/'));
});


gulp.task('js_default', gulp.series(
    'js_default_concat',
    'beep'
));






gulp.task('js_admin_default_concat', function () {
    return gulp.src(fileJs_admin_)
        .pipe(concat(fileJs_AdminFinal))
        .pipe(gulp.dest(configuration.dist + configuration.assets + 'js/'));
});

gulp.task('js_admin_default', gulp.series(
    'js_admin_default_concat',
    'beep'
));






gulp.task('js_remove_code', function () {
    return gulp.src(configuration.dist + configuration.assets + 'js/*.js')
        .pipe(removeCode({ dist: true }))
        .pipe(removeCode({ noDevFeatures: false, commentStart: '/*', commentEnd: '*/' }))
        .pipe(gulp.dest(configuration.dist + configuration.assets + 'js/'));
});


gulp.task('js_minify', function () {
    return gulp.src(configuration.dist + configuration.assets + 'js/*.*')
        .pipe(uglify())
        .pipe(gulp.dest(configuration.dist + configuration.assets + 'js/'));
});




module.exports = {
    fileJs_: fileJs_,
    fileJs_admin_: fileJs_admin_,
};