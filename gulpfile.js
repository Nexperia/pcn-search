'use strict';

var gulp = require('gulp'),
    del = require('del'),
    browserify = require('browserify'),
    ngAnnotate = require('browserify-ngannotate'),
    resolutions = require('browserify-resolutions'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    plugins = require('gulp-load-plugins')(),
    cachebust = new plugins.cachebust(),
    argv = require('yargs').default('environment', 'dev').argv,
    app = require('./package.json');

var lib_paths = {
    images: [ 'app/images/**' ],
    js: [],
    css: [
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/bootstrap/dist/css/bootstrap.min.css.map'
    ],
    fonts: [
        'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
        'bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2'
    ]
};

// cleans the build output
gulp.task('clean', function () {
    return del([
        './tmp',
        './dist/css',
        './dist/js',
        './dist/*.html'
    ]);
});

// runs bower to install frontend dependencies
gulp.task('bower', function () {
    return gulp.src(['./bower.json'])
        .pipe(plugins.install());
});

// runs less, creates css source maps
gulp.task('build-css', ['clean'], function () {
    return gulp.src('./app/css/*.less')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.less())
        .pipe(plugins.if(argv.environment !== 'dev', plugins.cleanCss()))
        .pipe(cachebust.resources())
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css'));
});

// builds the Angular template cache
gulp.task('build-template-cache', ['clean'], function () {
    return gulp.src('./app/views/*.html')
        .pipe(plugins.ngHtml2js({
            moduleName: 'app',
            prefix: 'app/views/'
        }))
        .pipe(plugins.concat('templateCache.js'))
        .pipe(gulp.dest('./tmp'));
});

// builds environment config module
gulp.task('environment-config', ['clean'], function () {
    gulp.src('./app/config.json')
        .pipe(plugins.ngConfig('app.config', {
            environment: ['env.' + argv.environment, 'global']
        }))
        .pipe(gulp.dest('./tmp'))
});

// runs jshint
gulp.task('jshint', function () {
    gulp.src('./app/*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'));
});

// Build a minified Javascript bundle
gulp.task('build-js', ['clean', 'jshint', 'build-template-cache', 'environment-config'], function () {
    return browserify({
        entries: './app/app.js',
        debug: true,
        transform: [ngAnnotate]
    })
        .plugin(resolutions, ['angular'])
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(cachebust.resources())
        .pipe(plugins.sourcemaps.init({loadMaps: true}))
        .pipe(plugins.if(argv.environment !== 'dev', plugins.uglify()))
        .on('error', plugins.util.log)
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/js'));
});

// copy all other files to dist directly
gulp.task('copy', ['build-css', 'build-js'], function() {
    gulp.src(lib_paths.images)
        .pipe(gulp.dest('./dist/images'));

    gulp.src(lib_paths.js)
        .pipe(gulp.dest('./dist/js'));

    gulp.src(lib_paths.css)
        .pipe(gulp.dest('./dist/css'));

    gulp.src(lib_paths.fonts)
        .pipe(gulp.dest('./dist/fonts'));
});

// full build, applies cache busting to the main page css and js bundles
gulp.task('build', ['clean', 'build-css', 'jshint', 'build-template-cache', 'environment-config', 'build-js', 'copy'], function () {
    return gulp.src('./index.html')
        .pipe(cachebust.references())
        .pipe(gulp.dest('./dist'));
});

// creates build zip
gulp.task('zip', ['build'], function () {
    return gulp.src('./dist/**')
        .pipe(plugins.zip(app.name + '-' + app.version + '-' + argv.environment + '.zip'))
        .pipe(gulp.dest('./build'));
});

// watches file system and triggers a build when a modification is detected
gulp.task('watch', ['build'], function () {
    return gulp.watch(['./index.html','./app/**/*.*'], ['build']);
});

// launches a web server that serves files in the current directory
gulp.task('webserver', ['watch'], function() {
    gulp.src(['dist', 'bower_components'])
        .pipe(plugins.webserver({
            livereload: false,
            fallback: 'index.html',
            open: true
        }));
});

// launch a build upon modification and publish it to a running server
gulp.task('dev', ['webserver']);

// installs and builds everything, including sprites
gulp.task('default', ['build']);
