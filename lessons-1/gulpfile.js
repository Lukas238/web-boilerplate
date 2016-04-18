/******************************
	SETUP
******************************/


/*	PLUGINS
*********************/
var gulp	= require('gulp'),
	sass	= require('gulp-sass');
	
	
/******************************
	SUB-TASKS 
******************************/

//	SCSS
gulp.task('scss', function () {
	
	return gulp.src('./src/scss/styles.scss')
	.pipe(sass({
		errLogToConsole: true
	}))
	.pipe(gulp.dest('./src/css'));
});


/******************************
	TASKS 
******************************/

// DEFAULT
gulp.task('default', ['scss'], function(){	
	gulp.watch('./src/scss/**/*.scss', ['scss']);
});
