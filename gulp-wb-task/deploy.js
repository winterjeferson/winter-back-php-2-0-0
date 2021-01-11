const gulp = require('gulp');
const project = require('./project.js');
const util = require('./util.js');
const image = require('./image.js');
const js = require('./js.js');
const application = require('./application.js');

gulp.task('deploy', gulp.series(
        'buildCssMinify',
        'buildJsRemoveCode',
        'buildJsMinify',
        'application_dist_move',
        'application_dist_move2',
        'project_move_dist',
        'application_minify',
        'image_imagemin',
        'beep'
));