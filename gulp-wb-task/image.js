const gulp = require('gulp');
const imagemin = require('gulp-imagemin'); //npm install gulp-imagemin --save-dev //https://www.npmjs.com/package/gulp-imagemin/
const newer = require('gulp-newer'); //npm install gulp-newer --save-dev // https://www.npmjs.com/package/gulp-newer/
const del = require('del'); //npm install del --save-dev //https://www.npmjs.com/package/del
const configuration = require('./configuration.js');



const fileImg = [
    configuration.src + 'img/*',
    configuration.src + 'img/**',
    configuration.src + 'img/**/*',
    configuration.src + 'img/**/*.*'
];

const fileImgPublic = [
    configuration.dist + 'img/*',
    configuration.dist + 'img/**',
    configuration.dist + 'img/**/*',
    configuration.dist + 'img/**/*.*'
];

gulp.task('image_move', function (done) {
    return gulp
        .src(configuration.src + 'img/**/*.*')
        .pipe(gulp.dest(configuration.dist + configuration.assets + "img/"));
    done();
});


// fix enoent problem: node node_modules/optipng-bin/lib/install.js
gulp.task('image_imagemin', function () {
    return gulp
        .src(configuration.dist + configuration.assets + 'img/**')
        .pipe(imagemin([
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(gulp.dest(configuration.dist + configuration.assets + "img/"));
});

gulp.task('image', gulp.series(
    'image_move',
    'beep'
));



module.exports = {
    fileImg: fileImg,
    fileImgPublic: fileImgPublic,
};