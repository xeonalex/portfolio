var gulp = require('gulp'),
    concat = require('gulp-concat'),// Склейка файлов
    browserSync  = require('browser-sync'), // BrowserSync
    jade = require('gulp-jade'), // Jade обработчик html
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssnano = require('gulp-cssnano'), //Минификация CSS
    autoprefixer = require('gulp-autoprefixer'), // Автопрефиксы CSS
    imagemin = require('gulp-imagemin'),// Сжатие JPG, PNG, SVG, GIF
    uglify = require('gulp-uglify'), // Минификация JS
    plumber = require('gulp-plumber'),
    shorthand = require('gulp-shorthand'), // шорт код
    uncss = require('gulp-uncss'), // удаление не используемых стилей
    rename = require('gulp-rename'),
    watch = require('gulp-watch');

// удаление не используемых стилей  - вызывается после сборки проекта

//Собираем Jade ( html )
gulp.task('jade-templates', function() {
  return gulp.src(['./src/jade/*.jade','!./src/jade/_*.jade'])
    .pipe(plumber())
    .pipe(jade({
       pretty: false
    }))
    .on('error', console.log)
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream());
  });

// Собираем CSS из SASS файлов
gulp.task('sass-dev', function() {
  return gulp.src('src/sass/**/*.scss')
    .pipe(plumber())
    // .pipe(sourcemaps.init())
    .pipe(sass({
      style: 'compressed',
      errLogToConsole: true,
      sourcemaps : false
      }))
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 15 versions'],
      cascade: true
     }))
    .pipe(shorthand())
    .pipe(cssnano({
        discardComments: {
          removeAll: true
        }
    }))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css/'))    
    .pipe(browserSync.stream());
});
gulp.task('uncss', function() {
  return gulp.src('build/css/styles.css')
    .pipe(uncss({
      html: ['build/*.html']
    }))
    .pipe(rename('main.css'))
    .pipe(gulp.dest('build/css/'));
});

//Сжатие изображений
gulp.task('img', function() {
  return gulp.src('src/img/**/**/**')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true}))
    .pipe(gulp.dest('build/img/'));
});

//Копируем JS
gulp.task('js', function(){
  return gulp.src('src/js/*.js')
  .pipe(plumber())
  .pipe(uglify())
  .pipe(concat('script.js'))
  .pipe(gulp.dest('build/js/'))
  .pipe(browserSync.stream());
});

//Копируем JS-vendor
gulp.task('js-vendor', function(){
  return gulp.src('src/js/vendor/*.js')
  .pipe(plumber())
  .pipe(uglify())
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('build/js/vendor/'))
  .pipe(browserSync.stream());
});

// Favicon
gulp.task('favicon', function(){
  return gulp.src('src/favicon/*')
  .pipe(plumber())
  .pipe(gulp.dest('build/favicon/'))
  .pipe(browserSync.stream());
});

// Fonts
gulp.task('fonts', function(){
  return gulp.src('src/fonts/*')
  .pipe(plumber())
  .pipe(gulp.dest('build/css/fonts/'))
  .pipe(browserSync.stream());
});

// WATCH
gulp.task('default', ['jade-templates','sass-dev','img','js-vendor','js','favicon','fonts'], function () {
    
    browserSync.init({
      server : './build'
    });

    watch('./src/jade/**/*.jade', function() {    
      gulp.start('jade-templates');
      // gulp.start('uncss');
    });

    watch(["./src/sass/**/*.scss",'./src/sass/_*.scss'], function() {
      gulp.start('sass-dev');
    });
    
    watch('./src/js/*.js', function() {
      gulp.start('js');
    });

    watch('./src/js/vendor/*.js', function() {
      gulp.start('js-vendor');
    });

    watch('./src/img/**/*', function() {
      gulp.start('img');
    });

    watch('./src/favicon/*', function() {
      gulp.start('favicon');
    });

    watch('./src/fonts/*', function() {
      gulp.start('fonts');
    });

});