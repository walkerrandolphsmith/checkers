var gulp = require('gulp');
var shell = require('gulp-shell');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var browserSync = require("browser-sync");
var karma = require('karma').server;
var pkg = require('./package.json');

var config = {
    port: 4000,
    styles: {
        src: './src/styles/styles.less',
        dest: './public/styles',
        name: pkg.name + '.css'
    },
    scripts: {
        src: [
            './src/scripts/third-party/*.js',

            './src/scripts/modules/*.js',
            './src/scripts/services/index.js',
            './src/scripts/services/*.js',
            './src/scripts/directives/index.js',
            './src/scripts/directives/*.js',
            './src/scripts/controllers/index.js',
            './src/scripts/controllers/*.js',
            './src/scripts/filters/index.js',
            './src/scripts/filters/*.js',
            './src/scripts/app.js'
        ],
        dest: './public/scripts',
        name: pkg.name + '.js'
    },


    html: {
        src: ['./src/index.html'],
        dest: './public',
        name: 'index.html'
    },
    views: {
        src: './src/views/**/*.html',
        dest: './public/views/'
    },
    assets: {
        src: './src/assets/**/*.*',
        dest: './public/assets/'
    }
};

gulp.task('html', function () {
    gulp.src(config.views.src)
        .pipe(gulp.dest(config.views.dest));

    return gulp.src(config.html.src)
        .pipe(gulp.dest(config.html.dest));
});

gulp.task('styles', function () {
    gulp.src(config.styles.src)
        .pipe(less())
        .pipe(concat(config.styles.name))
        .pipe(minifyCss())
        .pipe(gulp.dest(config.styles.dest))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('assets', function () {
    gulp.src(config.assets.src)
        .pipe(gulp.dest(config.assets.dest))
});

gulp.task('scripts', function () {
    return gulp.src(config.scripts.src)
        .pipe(concat(config.scripts.name))
        //.pipe(uglify())
        .pipe(gulp.dest(config.scripts.dest));
});

gulp.task('default', ['dev'], function () {
});

gulp.task('dev', ['browser-sync', 'build'], function () {
    gulp.watch('./src/styles/**/*.*', ['styles']);
    gulp.watch(config.html.src, ['html', 'bs-reload']);
    gulp.watch(config.views.src, ['html', 'bs-reload']);
    gulp.watch('./src/scripts/**/*.js', ['scripts', browserSync.reload]);
});

gulp.task('bs-reload', function () {
    browserSync.reload();
})

gulp.task('browser-sync', function () {
    browserSync({
        port: config.port,
        server: {
            baseDir: config.html.dest
        }
    });
});

gulp.task('build', ['scripts', 'styles', 'html', 'assets'], function () {
});

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});


