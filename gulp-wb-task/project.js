const gulp = require('gulp');
const del = require('del'); //npm install del --save-dev //https://www.npmjs.com/package/del
const configuration = require('./configuration.js');


gulp.task('project_move_dist', function () {
    gulp
        .src(configuration.dist + '*.php')
        .pipe(gulp.dest(configuration.dist));
    gulp
        .src(configuration.dist + '*.txt')
        .pipe(gulp.dest(configuration.dist));
    gulp
        .src(configuration.dist + '*.xml')
        .pipe(gulp.dest(configuration.dist));
    gulp
        .src(configuration.dist + configuration.assets + '/php/**/*.*')
        .pipe(gulp.dest(configuration.dist + configuration.assets + '/php/'));

    return gulp
        .src(configuration.dist + '.htaccess')
        .pipe(gulp.dest(configuration.dist));
});