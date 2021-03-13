# Front-end Boilerplate using Sass and Gulp 4

This is the boilerplate that I use for simple frontend development of websites that use HTML, SASS, and JavaScript. We're using Gulp 4 to compile, prefix, and minify my files.

This isn’t strictly a fork, but I used Jessica Chan’s [frontend-boilerplate](github/thecodercoder/
frontend-boilerplate) a a jumping off point. I very much like the way she thinks and structures things. If you’re just starting out with any of these things, I highly recomend Jessica’s blog [here](https://coder-coder.com/gulp-4-walk-through) on the topic.

## Quickstart guide

* Clone or download this Git repo.
* Install [Node.js](https://nodejs.org/en/) if you don't have it yet.
* Run `npm install`
* Run `gulp` to run the default Gulp task

In this proejct, Gulp is configured to run the following functions:

* Compile the SCSS files to CSS
* Autoprefix and minify the CSS file
* Concatenate the JS files
* Uglify the JS files
* Move final CSS and JS files to the `/dist` folder
 
