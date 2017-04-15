var gulp = require('gulp');

var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var casper = require('gulp-casperjs-local').default;

/* Tests */
gulp.task('test', ['mocha'], function() {
	// Run all tests
	gulp.run('testclient');
	// process.exit(1);
});

gulp.task('testclient', ['server', 'casper'], function() {
	// Run client side tests once
	process.exit(0);
});

gulp.task('watch', function() {
	// Run server-side tests whenever a server-side test changes
	gulp.watch(['lib/**/*.js', '!lib/**/*.test.js', '!lib/server/static/*.js'], ['mocha']);
});

gulp.task('watchclient', function() {
	// Run client-side tests whenever a client-side test changes
	gulp.watch(['!lib/**/*.js', 'lib/**/*.test.js', 'lib/server/static/*.js'], ['server', 'casper']);
});

gulp.task('mocha', function() {
	// Run server-side tests once
	return gulp
		.src(['lib/**/*.spec.js'])
		.pipe(mocha());
});

gulp.task('casper', function() {
	// Run client-side testrunner (needs server)
	return gulp
		.src(['lib/**/*.test.js'])
		.pipe(casper({
			verbose: true
		})); 
});

/* Launch the app or parts of it */
gulp.task('start', function() {
  // Start the app
  nodemon({
  	script: 'app.js'
  });
});

gulp.task('server', function() {
	// Just start the server
	nodemon({
		script: 'lib/server/server.js',
		ext: '.js',
		ignore: ['*.spec.js', '*.test.js']
	});
});