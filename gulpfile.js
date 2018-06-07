const gulp = require('gulp'),
    pug = require('gulp-pug'),
    fs = require('fs'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    spritesmith = require('gulp.spritesmith'),
    sassGlob = require('gulp-sass-glob'),
    sourcemaps = require('gulp-sourcemaps'),
    csso = require('gulp-csso'),
    autoprefixer = require('gulp-autoprefixer'),
    cssunit = require('gulp-css-unit');

// server
gulp.task('server', function () {
    return browserSync.init({
        open: false,
        notify: false,
        server: {
          baseDir: "./build",
    }
  });
});

gulp.task('sass', () => {
    return gulp.src('./source/styles/main.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers : ['> 5%'],
            cascade : false
        }))
        // .pipe(cssunit({
        // 	type     :    'px-to-rem',
        // 	rootSize  :    16
        // }))
        .pipe(csso())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css/'))
        .pipe(reload({stream : true}));
});

gulp.task('pug', () => {
  return gulp.src('source/views/pages/**/*.pug')
    .pipe(plumber())
    .pipe(pug({
        locals : JSON.parse(fs.readFileSync('./content.json', 'utf8')),
      pretty: true,
    }))
    .pipe(gulp.dest('build'))
    .pipe(reload({ stream: true }));
});

gulp.task('sprite', function (cb) {
    const spriteData = gulp.src(
        './source/img/icons/*.png'
    ).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.scss',
        cssFormat: 'css',
        imgPath: '../img/sprite.png',
        padding: 70
    }));

    spriteData.img.pipe(gulp.dest('./build/img'));
    spriteData.css.pipe(gulp.dest('./source/styles/sprite'));
    cb();
});

gulp.task('watch', () => {
  gulp.watch('source/**/*.pug', gulp.series('pug'));
  gulp.watch('source/**/*.scss', gulp.series('sass'));
});

gulp.task('default', gulp.series(
    'pug',
    gulp.parallel ( 'sass', 'sprite'),
    gulp.parallel ('server', 'watch'),
));
