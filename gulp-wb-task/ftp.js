const gulp = require('gulp');
const ftp = require('vinyl-ftp'); //npm install --save-dev vinyl-ftp //https://www.npmjs.com/package/vinyl-ftp
const util = require('gulp-util'); //npm install --save-dev gulp-util // https://www.npmjs.com/package/gulp-util
const configuration = require('./configuration.js');


const folderFtp = '/www/test/' + configuration.projectName + '/' + configuration.projectVersion + '/';
const ftpHost = '';
const ftpPort = '';
const ftpUser = '';
const ftpPassword = '';





gulp.task('ftp', function () {
    const conn = ftp.create({
        host: ftpHost,
        port: ftpPort,
        user: ftpUser,
        password: ftpPassword,
        parallel: 10,
        log: util.log
    });

    const globs = [
        configuration.dist + '**/*.*',
        configuration.dist + '.htaccess'
    ];

    return gulp
        .src(globs, { buffer: true })
        .pipe(conn.newer(folderFtp))
        .pipe(conn.dest(folderFtp));
});