module.exports = (gulp, options, plugins) => {
    gulp.task('sync', () => {
        return plugins.browsersync.init({
            proxy: 'localhost:8080',
            open: false,
            notify: false
        });
    });

    gulp.task('sync-reload', (done) => {
        plugins.browsersync.reload();
        done();
    });
};
