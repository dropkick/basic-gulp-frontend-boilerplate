// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()

// Importing all the Gulp-related packages we want to use
const { src, dest, watch, series, parallel } = require('gulp');
const browsersync       = require('browser-sync').create();
const sass              = require('gulp-dart-sass');
const autoprefixer      = require('gulp-autoprefixer');
const sourcemaps        = require('gulp-sourcemaps');
const plumber           = require('gulp-plumber');
const sasslint          = require('gulp-sass-lint');
const cache             = require('gulp-cached');
const notify            = require('gulp-notify');
const beeper            = require('beeper');

// BrowserSync
const browsersync       = require('browser-sync').create();

// const concat        = require('gulp-concat');
// const uglify        = require('gulp-uglify');
const postcss          = require('gulp-postcss');
const cssnano          = require('cssnano');
// var replace         = require('gulp-replace');

// File paths
const files = { 
    scssPath:   'src/scss/**/*.scss',
    jsPath:     'src/js/**/*.js'
}

// Sass task: compiles the style.scss file into style.css
function buildStyles() {
    return src(files.scssPath)
        .pipe(plumbError()) // Global error handler through all pipes.
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('dist')
        .pipe(browsersync.reload({ stream: true }));
    ); // put final CSS in dist folder
}


// Sass task: compiles the style.scss file into style.css
// function scssTask(){    
//     return src(files.scssPath)
//         .pipe(sourcemaps.init()) // initialize sourcemaps first
//         .pipe(sass()) // compile SCSS to CSS
//         .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
//         .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
//         .pipe(dest('dist')
//     ); // put final CSS in dist folder
// }

// JS task: concatenates and uglifies JS files to script.js
function jsTask(){
    return src([
        files.jsPath
        //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
        ])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(dest('dist')
    );
}

// Sass linter
function sassLint() {
    return src(files.scssPath)
        .pipe(cache('sasslint'))
        .pipe(sasslint({
            configFile: '.sass-lint.yml'
        })
     )
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
}

// Error handler
function plumbError() {
    return plumber({
        errorHandler: function(err) {
            notify.onError({
                templateOptions: {
                    date: new Date()
                },
                title: "Gulp error in " + err.plugin,
                message:  err.formatted
            })(err);
            beeper();
            this.emit('end');
        }
    })
}

// Cachebust
function cacheBustTask(){
    var cbString = new Date().getTime();
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.'));
}


// BrowserSync
function browserSync(done) {
  browsersync.init({
      server: "./"
    // proxy: 'http://localhost'// Change this value to match your local URL.
    // socket: {
    //   domain: 'localhost:3000'
    // }
    // server: true
  });
  done();
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
    watch([files.scssPath, files.jsPath],
        {interval: 1000, usePolling: true}, //Makes docker work
        series(
            sassLint,
            parallel(
                buildStyles, 
                jsTask
            ),
            cacheBustTask
        )
    );    
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
    parallel(scssTask, jsTask), 
    cacheBustTask,
    watchTask
);


// Export commands.
exports.default = parallel(browserSync, watchTask); // $ gulp
exports.sass = buildStyles; // $ gulp sass
exports.watch = watchFiles; // $ gulp watch
exports.build = series(buildStyles); // $ gulp build
