const gulp = require('gulp');
const application = require('./application.js');
const css = require('./css.js');
const js = require('./js.js');
const other = require('./other.js');
const image = require('./image.js');



gulp.task('watch', (callback) => {
    gulp.watch(application.fileApplicationWatch, gulp.series('application'))
        .on('change', (event) => {
            console.log(event);
        });

    gulp.watch(css.fileAll, gulp.series('buildCss'))
        .on('change', (event) => {
            console.log(event);
        });

    gulp.watch(js.fileAll, gulp.series('buildJs'))
        .on('change', (event) => {
            console.log(event);
        });

    gulp.watch(other.fileOther, gulp.series('other'))
        .on('change', (event) => {
            console.log(event);
        });

    gulp.watch(image.fileImg, gulp.series('image'))
        .on('change', (event) => {
            console.log(event);
        });

    callback();
});