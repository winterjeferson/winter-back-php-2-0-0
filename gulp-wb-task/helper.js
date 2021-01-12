const gulp = require('gulp');
const del = require('del'); //npm install del --save-dev //https://www.npmjs.com/package/del
const image = require('./image.js');
const css = require('./css.js');
const js = require('./js.js');
const application = require('./application.js');
const other = require('./other.js');

gulp.task('deploy', gulp.series(
    'buildCssMinify',
    'buildJsRemoveCode',
    'buildJsMinify',
    // 'buildApplicationMinify',
    'buildImageMinify',
));

gulp.task('initialize', gulp.series(
    'buildCss',
    'buildJs',
    'buildImage',
    'buildOther',
));

clean = function (path) {
    del(path, {
        force: true
    });
};

exports.default = clean;