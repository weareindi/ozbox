module.exports = (gulp, options, plugins) => {
    gulp.task('scss', gulp.series(
        gulp.parallel('scss-styles') // We compile enhanced after core as enhanced imports core and the task gets confused when running in parellel
    ));

    gulp.task('scss-styles', () => {
        return gulp.src(process.env.SCSS_SRC + 'styles.scss')
            .pipe(plugins.sass({
                importer: plugins.sassGlobbing
            }))
            .pipe(plugins.postcss([
                plugins.autoprefixer()
            ]))
            .pipe(gulp.dest(process.env.SCSS_DEST))
            .on('error', plugins.log.error);
    });

    gulp.task('scss-minify', () => {
        return gulp.src([
            process.env.SCSS_DEST + 'styles.css'
        ])
            .pipe(plugins.postcss([
                plugins.cssnano({
                    preset: 'default'
                })
            ]))
            .pipe(gulp.dest(process.env.SCSS_DEST))
            .on('error', plugins.log.error);
    });
};
