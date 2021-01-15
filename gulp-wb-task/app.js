const gulp = require('gulp');
const rename = require("gulp-rename"); //npm install gulp-rename --save-dev // https://www.npmjs.com/package/gulp-rename/
const htmlmin = require('gulp-htmlmin'); //npm install gulp-htmlmin --save-dev  //https://www.npmjs.com/package/gulp-htmlmin/
const debug = require("gulp-debug"); //npm install --save-dev gulp-debug // https://www.npmjs.com/package/gulp-debug
const del = require('del'); //npm install del --save-dev //https://www.npmjs.com/package/del
const configuration = require('./configuration.js');
const helper = require('./helper.js');
const folderApp = 'app/';
const folderView = 'view/';


const extension = 'php';
const srcApplication = configuration.src + folderApp;
const fileIndex = `${srcApplication + configuration.index}.${extension}`;
const fileAll = [
    srcApplication + configuration.allFolderFile,
    `!${fileIndex}`,
];

gulp.task('buildAppClean', (done) => {
    clean(configuration.dist + folderApp);
    done();
});

gulp.task('buildAppMove', (done) => {
    gulp
        .src(fileAll)
        .pipe(debug())
        .pipe(gulp.dest(configuration.dist + folderApp))
    return done();
});

gulp.task('buildAppMoveIndex', (done) => {
    gulp
        .src(fileIndex)
        .pipe(debug())
        .pipe(gulp.dest(configuration.dist))
    return done();
});

gulp.task('buildAppMinify', (done) => {
    gulp
        .src(configuration.dist + folderApp + folderView + configuration.allFolderFile)
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(configuration.dist + folderApp + folderView));
    return done();
});

gulp.task('buildApp', gulp.series(
    'buildAppClean',
    'buildAppMoveIndex',
    'buildAppMove',
));





module.exports = {
    fileAll: fileAll,
};