/******************************
	SETUP
******************************/

/*	VARIABLES
*********************/
var config = require('./gulp.config')();


/*	PLUGINS
*********************/
var gulp        	= require('gulp'),
	plumber     	= require('gulp-plumber'),
	notify      	= require('gulp-notify'),
	run         	= require('run-sequence'),
	sass     		= require('gulp-sass'),
	purge 			= require('gulp-css-purge'),
	autoprefixer	= require('gulp-autoprefixer'),
	rename      	= require('gulp-rename'),
	minifyCSS   	= require('gulp-minify-css'),
	concat      	= require('gulp-concat'),
	changed     	= require('gulp-changed'),
	browserSync 	= require('browser-sync').create(),
	uglify      	= require('gulp-uglify'),
	imagemin    	= require('gulp-imagemin'),
	jshint      	= require('gulp-jshint'),
	fs          	= require('fs'),
	path        	= require('path'),
	glob        	= require('glob'),
	merge       	= require('merge-stream'),
	del         	= require('del'),
	gutil 			= require('gulp-util'),
	ftp 			= require('vinyl-ftp'),
	package     	= require('./package.json'); 
	
var reload  		= browserSync.reload({stream:true});

	
/*	FUNCTIONS
************************************************/

//	ERROR HANDLING
var gulp_src = gulp.src;	
gulp.src = function() {
	return gulp_src.apply(gulp, arguments)
	.pipe(plumber({ errorHandler: notify.onError({
			title: "<%= error.plugin %>",
			message: "<%= error.message %>"
		})
	}))
};


// HELPER FUNCTION TO BUILD AN FTP CONNECTION
function getFtpConnection() {  
    return ftp.create({
        host: config.deploy.live.host,
        port: config.deploy.live.port,
        user: config.deploy.live.user,
        password: config.deploy.live.password,
        parallel: 5,
        log: gutil.log
    });
}

/******************************
	SUB-TASKS 
******************************/

//	CLEAN: DEV
gulp.task('clean:dev', function(){
	del.sync(config.dev+'/*');
});

//	CLEAN: DIST
gulp.task('clean:dist', function(){
	del.sync(config.dist+'/**/');
});


//	CLEAN: COMP
gulp.task('clean:comp', function(){
	del.sync([
		config.comp+'/*',
		'!'+config.comp+'/**/*.html'
	], cb);
});


// HTML	
gulp.task('html', function () {
	return gulp.src(config.src+'/*.html')
	.pipe(changed(config.wf))
	.pipe(gulp.dest(config.wf))
	.pipe(browserSync.reload({stream:true}));
});


//	SASS-INCLUDE
gulp.task('sass-includes', function (callback) {
	var all = '_all.scss';
	fs.writeFile(
		config.paths.src_scss+'/'+config.comp+'/'+all,
		'/** This is a dynamically generated file **/\n\n',
		{ overwrite: true },
		function (err) {		
			glob(config.src+'/scss/'+config.comp+'/' + all,
				function (error, files) {
					files.forEach(function (allFile) {
						var directory = path.dirname(allFile);
						var partials = fs.readdirSync(directory).filter(function (file) {
							return (
								// Exclude the dynamically generated file
								file !== all &&
								// Only include _*.scss files
								path.basename(file).substring(0, 1) === '_' &&
								path.extname(file) === '.scss'
							);
						});
						// Append import statements for each partial
						partials.forEach(function (partial) {
							fs.appendFileSync(allFile, '@import "' + partial + '";\n');
						});
					});
				}
			);
		}
	);
	callback();
	
	//To run this function just one time
	/*
	gulp.task('sass-includes', function (callback) {
		callback();
	})
	*/
	
});

//	SCSS
gulp.task('scss', ['sass-includes'], function () {
	
	return gulp.src(config.paths.src_scss+'/styles.scss')
	.pipe(sass({
		includePaths: config.paths.sass_includes,
		errLogToConsole: true
	}))
	.pipe(purge())
	.pipe(autoprefixer('last 4 version'))
	.pipe(gulp.dest( config.wf + config.paths.dest_css ))
	.pipe(minifyCSS({
		keepSpecialComments: 1,
		processImport: false
	}))
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest( config.wf + config.paths.dest_css ))
	.pipe(browserSync.reload({stream:true}));
	
});


// JAVASCRIPT
gulp.task('js', function(){
	return gulp.src(config.paths.src_js+'/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(config.wf+config.paths.dest_js))
	.pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.wf+config.paths.dest_js))
	.pipe(browserSync.reload({stream:true}));
});


//	IMAGES_OPTIMIZE
gulp.task('images_optimize', function(tmp) {
    return gulp.src(config.paths.img+'/*.{jpg,png,gif}')
    .pipe(imagemin({
		optimizationLevel: 5,
		progressive: true,
		interlaced: true 
	}))
	.pipe(gulp.dest(config.wf+config.paths.dest_img));
});


// IMAGES
gulp.task('images', ['images_optimize'], function() {
    return gulp.src( config.files.img )
    .pipe(gulp.dest(config.wf+config.paths.dest_img))
	.pipe(browserSync.reload({stream:true}));
});



// VENDORS
gulp.task('vendors', function(){
	return merge(
	
		//	SCRIPTS
		gulp.src( config.files.vendors.js )
		.pipe(concat('vendors.js', {newLine: ';'}))
		.pipe(gulp.dest(config.wf+config.paths.dest_js))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(config.wf+config.paths.dest_js)),
		
		//	CSS
		gulp.src( config.files.vendors.css )
		.pipe(concat('vendors.css'))
		.pipe(gulp.dest(config.wf+config.paths.dest_css))
		.pipe(minifyCSS({processImport: false}))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(config.wf+config.paths.dest_css)),
		
		// IMAGES
		gulp.src( config.files.vendors.img )
		.pipe(changed( config.wf+config.paths.dest_img ))
		.pipe(gulp.dest( config.wf+config.paths.dest_img )),
		
		//	FONTS
		gulp.src(config.files.vendors.fonts)
		.pipe(changed( config.wf+config.paths.dest_fonts ))
		.pipe(gulp.dest( config.wf+config.paths.dest_fonts ))
	
	); //End merge
});

// CSS STYLES
gulp.task('css', function(){
	gulp.src( config.files.css )
	.pipe(changed( config.wf+config.paths.dest_css ))
	.pipe(gulp.dest( config.wf+config.paths.dest_css ));
});


//	FONTS
gulp.task('fonts', function () {
    gulp.src( config.files.fonts )
	.pipe(changed( config.wf+config.paths.dest_fonts  ))
	.pipe(gulp.dest( config.wf+config.paths.dest_fonts ))
	.pipe(browserSync.reload({stream:true}));
});


//	STANDALONE FILES
gulp.task('standalone', function(){
	return merge(

		// STANDALONE: MISC
		gulp.src( config.files.misc )
		.pipe(changed( config.wf  ))
		.pipe(gulp.dest( config.wf )),
		
		// STANDALONE: CSS
		gulp.src( config.files.css )
		.pipe(changed( config.wf  ))
		.pipe(gulp.dest( config.wf+config.paths.dest_css )),
		
		// STANDALONE: JS
		gulp.src( config.files.js )
		.pipe(changed( config.wf  ))
		.pipe(gulp.dest( config.wf+config.paths.dest_js ))
		
	); //End merge	
});


//	BROWSER-SYNC
gulp.task('browser-sync', function() {
    browserSync.init(null, {
		notify: false,
        server: {
            baseDir: config.wf,
			directory: config.directory_listing,
        }
    });
});



/******************************************
	TASKS
*******************************************/


// DEFAULT
gulp.task('default', ['clean:dev'], function(){
	
	config.wf = config.dev;
	config.directory_listing = false;
	
	run(['html', 'scss', 'css', 'js', 'images', 'fonts', 'vendors', 'standalone', 'browser-sync'], function(){		
		gulp.watch(config.src+'/*.html', ['html']);
		gulp.watch(config.src+'/scss/**/*', ['scss']);
		gulp.watch(config.src+'/css/**/*', ['css']);
		gulp.watch(config.src+'/js/**/*.js', ['js']);
		gulp.watch(config.src+'/img/**/*', ['images']);
	});
	
});



//COMPONENTS
gulp.task('comp', ['clean:comp'], function () {
	
	config.wf = config.comp;
	config.directory_listing = true;
	
	run(['scss', 'css', 'js', 'images', 'fonts', 'vendors', 'standalone', 'browser-sync'], function(){		
		gulp.watch(config.src+'/*.html', ['html']);
		gulp.watch(config.src+'/scss/**/*.scss', ['scss']);
		gulp.watch(config.src+'/css/**/*.css', ['css']);
		gulp.watch(config.src+'/js/**/*.js', ['js']);
		gulp.watch(config.src+'/img/**/*', ['images']);
	});

});


// DIST
gulp.task('dist', ['clean:dist'], function(){
	config.wf = config.dist;
	run(['html', 'scss', 'css', 'js', 'images', 'fonts', 'vendors', 'standalone']);
});


// DEPLOY
gulp.task('deploy', ['dist'], function(){
	config.wf = config.dist;
	run(['html', 'scss', 'css', 'js', 'images', 'fonts', 'vendors', 'standalone'], function(){
		var conn = getFtpConnection();
		return gulp.src(config.deploy.live.localFilesGlob,{
			base: './'+config.dist,
			buffer: false
		})
		.pipe(conn.newer( config.deploy.live.remoteFolder )) // only upload newer files 
		.pipe(conn.dest( config.deploy.live.remoteFolder ));
	});
});

