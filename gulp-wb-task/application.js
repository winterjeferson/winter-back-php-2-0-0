const gulp = require('gulp');
const rename = require("gulp-rename");//npm install gulp-rename --save-dev // https://www.npmjs.com/package/gulp-rename/
const htmlmin = require('gulp-htmlmin'); //npm install gulp-htmlmin --save-dev  //https://www.npmjs.com/package/gulp-htmlmin/
const del = require('del'); //npm install del --save-dev //https://www.npmjs.com/package/del
const configuration = require('./configuration.js');
const util = require('./util.js');
const application = 'application/';
const folderView = 'view/';



const folderApplication = configuration.src + application;
const fileApplication = [
    folderApplication + '**/*.*',
    '!' + folderApplication + 'index.php',
];
const fileApplicationWatch = [
    folderApplication + '**/*.*',
    folderApplication + 'index.php',
];


function clean(path) {
    return del(path, { force: true }); // returns a promise
}

gulp.task('application_clean', function () {
    const files = [
        configuration.dist + application + '**/*.*',
        configuration.dist + application + '**/*.*',
    ];
    return clean(files);
});

gulp.task('application_move', function (done) {
    return gulp
        .src(fileApplication)
        .pipe(gulp.dest(configuration.dist + application))
    done();
});

gulp.task('application_move2', function (done) {
    return gulp
        .src(configuration.src + application + 'index.php')
        .pipe(gulp.dest(configuration.dist))
    done();
});

gulp.task('application_dist_move', function (done) {
    return gulp
        .src(fileApplication)
        .pipe(gulp.dest(configuration.dist + application))
    done();
});

gulp.task('application_dist_move2', function (done) {
    return gulp
        .src(configuration.src + application + 'index.php')
        .pipe(gulp.dest(configuration.dist))
    done();
});

gulp.task('application_minify', function (done) {
    return gulp
        .src(configuration.dist + application + folderView + '**/*.*')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(configuration.dist + application + folderView));
    done();
});

gulp.task('application', gulp.series(
    'application_clean',
    'application_move',
    'application_move2',
    'beep'
));





module.exports = {
    fileApplication: fileApplication,
    fileApplicationWatch: fileApplicationWatch,
};