const gulp = require('gulp');
const del = require('del'); //npm install del --save-dev //https://www.npmjs.com/package/del
const configuration = require('./configuration.js');



const fileOther = [
    configuration.src + 'other/.htaccess',
    configuration.src + 'other/*',
    configuration.src + 'other/**',
    configuration.src + 'other/**/*',
    configuration.src + 'other/**/*.*'
];
const fileOtherPublic = [
    configuration.dist + '.htaccess',
    configuration.dist + '*.htaccess',
    configuration.dist + '*.txt'
];


function clean(path) {
    return del(path, { force: true }); // returns a promise
}

gulp.task('other_clean', function () {
    return clean(fileOtherPublic);
});

gulp.task('other_move', function (done) {
    return gulp
        .src(fileOther)
        .pipe(gulp.dest(configuration.dist));
    done();
});

gulp.task('other', gulp.series(
    'other_clean',
    'other_move',
    'beep'
));



module.exports = {
    fileOther: fileOther,
    fileOtherPublic: fileOtherPublic,
};