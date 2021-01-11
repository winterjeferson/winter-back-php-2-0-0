const gulp = require('gulp');
const image = require('./image.js');
const js = require('./js.js');
const application = require('./application.js');

gulp.task('deploy', gulp.series(
    'buildCssMinify',
    'buildJsRemoveCode',
    'buildJsMinify',
    'buildApplicationMinify',
    'buildImageMinify',
));