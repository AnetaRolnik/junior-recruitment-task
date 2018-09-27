const gulp = require("gulp");
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: ["./frontend", "./assets"],
        browser: "chrome"
    });
});

gulp.task('sass', function () {
  return gulp.src('./frontend/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle : "expanded" //nested, expanded, compact, compressed
    }))

    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('./frontend/css'))
    .pipe(browserSync.stream());
});

gulp.task("watch", function(){
  gulp.watch("./frontend/scss/**/*.scss", ["sass"]);
  gulp.watch("*.html").on('change', browserSync.reload);
});


gulp.task("default", function(){
  gulp.start(["sass", "browser-sync", "watch"]);
});
