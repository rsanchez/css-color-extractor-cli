var gulp = require('gulp');

var files = ['index.js', 'cli.js', 'gulpfile.js'];

gulp.task('lint', function () {
    var eslint = require('gulp-eslint');
    return gulp.src(files)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint']);

gulp.task('watch', function () {
    gulp.watch(files, ['lint']);
});
