var gulp = require('gulp');
var gutil = require('gulp-util');
var exec = require('gulp-exec');
var gulpif = require('gulp-if');

// Include Our Plugins
var jshint = require('gulp-jshint');
var jade = require('gulp-jade');
var coffee = require('gulp-coffee');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

connect = require('gulp-connect');
lr = require('tiny-lr');

//Generate Our Templates
gulp.task('jade', function(){
    var YOUR_LOCALS = {};
    gulp.src('./src/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest('./app/'))
});

// Compile Our Sass

gulp.task('less', function() {
    return gulp.src('src/styles/styles.less')
        .pipe(less())
        .pipe(gulp.dest('app/content/styles'));
});
gulp.task('css', function() {
    return gulp.src('src/styles/*.css')
        .pipe(gulp.dest('app/content/styles'));
});

//Minify CSS
gulp.task('styles', function(){
    gulp.src('app/content/styles/styles.css')
        .pipe(concat('styles.css'))
        .pipe(minifyCSS(opts))
        .pipe(gulp.dest('app/content/styles'))
});

// Concatenate & Minify JS
gulp.task('coffee', function() {
    return gulp.src('src/scripts/*')
        .pipe(gulpif(/[.]coffee$/,coffee()))
        .pipe(gulp.dest('deploy/scripts'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('deploy/scripts/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('deploy/scripts'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/scripts'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/scripts/*.js', ['lint', 'scripts']);
    gulp.watch('src/styles/*.scss', ['sass']);
    gulp.watch('src/*.jade', ['jade']);
});

gulp.task('connect', function(){
    connect.server({
        root: ['app'],
        port: 4000,
        liverreload: true
    });
});

/*
 * Deploy to gh-pages
 * //on master branch
 * git add .
 * git add -u
 * git commit -m "Saving master branch state."
 * git checkout gh-pages
 * rm -rf .
 * git checkout master -- app
 * // update main.js config paths to ../hire/app/
 * git add .
 * git commit -m "Deployed to gh-pages."
 * git push origin gh-pages
 *
 * //Push
 *
 * git add .
 * git commit -m <message>
 * git push origin source
 *
 */

gulp.task('run', ['connect', 'watch']);
gulp.task('gen', ['jade','less', 'css', 'styles', 'coffee', 'scripts']);

// Default Task
gulp.task('default', ['gen', 'run']);