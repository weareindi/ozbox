module.exports = (gulp, options, plugins) => {
    gulp.task('watch', gulp.series(
        gulp.parallel('watch-scss', 'watch-js')
    ));

    gulp.task('watch-scss', () => {
        return gulp.watch([
            process.env.SCSS_SRC + '**/*.scss'
        ], gulp.series(
            gulp.parallel('scss'),
            gulp.parallel('sync-reload')
        ));
    });

    gulp.task('watch-js', () => {
        return gulp.watch([
            process.env.JS_SRC + '**/*.js'
        ], gulp.series(
            gulp.parallel('js'),
            gulp.parallel('sync-reload')
        ));
    });
};
