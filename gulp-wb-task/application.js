const gulp = require('gulp');
const rename = require("gulp-rename"); //npm install gulp-rename --save-dev // https://www.npmjs.com/package/gulp-rename/
const htmlmin = require('gulp-htmlmin'); //npm install gulp-htmlmin --save-dev  //https://www.npmjs.com/package/gulp-htmlmin/
const del = require('del'); //npm install del --save-dev //https://www.npmjs.com/package/del
const configuration = require('./configuration.js');
const helper = require('./helper.js');
const application = 'app/';
const folderView = 'view/';


const extension = 'php';
const folderApplication = configuration.src + application;
const fileApplication = [
    folderApplication + configuration.allFolderFile,
    `!${folderApplication + configuration.index}.${extension}`,
];
const fileApplicationWatch = [
    folderApplication + configuration.allFolderFile,
    folderApplication + `${configuration.index}.${extension}`,
];


gulp.task('buildApplicationClean', (done) => {
    clean(configuration.dist + application + configuration.allFolderFile);
    done();
});

gulp.task('buildApplicationMove', (done) => {
    return gulp
        .src(fileApplication)
        .pipe(gulp.dest(configuration.dist + application))
    done();
});

gulp.task('buildApplicationMove2', (done) => {
    return gulp
        .src(configuration.src + application + `${configuration.index}.${extension}`)
        .pipe(gulp.dest(configuration.dist))
    done();
});

gulp.task('buildApplicationMinify', (done) => {
    return gulp
        .src(configuration.dist + application + folderView + configuration.allFolderFile)
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(configuration.dist + application + folderView));
    done();
});

gulp.task('buildApplication', gulp.series(
    'buildApplicationClean',
    'buildApplicationMove',
    'buildApplicationMove2',
));





module.exports = {
    fileApplication: fileApplication,
    fileAll: fileApplicationWatch,
};