/******************************
	SETUP
******************************/

/*	VARIABLES
*********************/
var config = require('./gulp.config')();


/*	PLUGINS
*********************/
var gulp        		= require('gulp'),
	plumber     	= require('gulp-plumber'),
	notify      		= require('gulp-notify'),
	run         		= require('run-sequence'),
	compass     	= require('gulp-compass'),
	sass     			= 	require('gulp-sass'),
	autoprefixer	= require('gulp-autoprefixer'),
	rename      	= require('gulp-rename'),
	minifyCSS   	= require('gulp-minify-css'),
	concat      	= require('gulp-concat'),
	changed     	= require('gulp-changed'),
	browserSync = require('browser-sync').create(),
	uglify      		= require('gulp-uglify'),
	imagemin    	= require('gulp-imagemin'),
	jshint      		= require('gulp-jshint'),
	fs          		= require('fs'),
	path        		= require('path'),
	glob        		= require('glob'),
	merge       	= require('merge-stream'),
	del         		= require('del'),
	package     	= require('./package.json'); 
	

/*	ERROR HANDLING
************************************************/
var gulp_src = gulp.src;	
gulp.src = function() {
	return gulp_src.apply(gulp, arguments)
	.pipe(plumber({ errorHandler: notify.onError({
			title: "<%= error.plugin %>",
			message: "<%= error.message %>"
		})
	}))
};

/******************************
	SUB-TASKS 
******************************/

//	CLEAN: DEV
gulp.task('clean:dev', function(cb){
	del(config.dev+'/*', cb);
});

//	CLEAN: COMP
gulp.task('clean:comp', function(cb){
	del([
		config.comp+'/*',
		'!'+config.comp+'/**/*.html'
	], cb);
});


//	CLEAN: FRONT
gulp.task('clean:build', function(cb){
	del(config.dist+'/*', {force: true}, cb);
});


//	HTML
gulp.task('html', function () {
	return gulp.src(config.src+'/**/*.html')
	.pipe(changed(config.wf))
	.pipe(gulp.dest(config.wf))
	.pipe(browserSync.reload({stream:true}));
});


//	SASS-INCLUDE
//	Import all the componentes files into the file _all.scss.
var sass_includes_runed = false;
gulp.task('sass-includes', function (callback) {
	
	if(sass_includes_runed == true){ callback(); return;}
	sass_includes_runed = true;
	
	var comps_list = '_all';
	var comps_list_path = config.paths.src_scss + '/' + config.comp + '/' +comps_list + '.scss';
	
	fs.writeFile(comps_list_path, '/** This is a dynamically generated file **/\n\n', { overwrite: true }, function (err) {		
		glob(config.paths.src_scss + '/' + config.comp + '/_*.scss', function (error, files) {
			var partials = [];
			files.forEach(function (allFile) {
				var filename = allFile.split('\\').pop().split('/').pop().split('.').shift();
				if ( filename != comps_list ){ 
					partials.push( filename );
				}			
			});
			// Append import statements for each partial
			var import_list = '';
			partials.forEach(function (partial) {
				import_list += '@import "' + partial + '";\n'; 
			});
			fs.appendFileSync(comps_list_path, import_list);
		});
	});
	callback();	
});

//	SCSS
gulp.task('scss', ['sass-includes'], function () {
	
	return gulp.src(config.paths.src_scss+'/styles.scss')
	
	/*
	.pipe(compass({
		project: __dirname,
		logging: false,
		sourcemap: false,
		import_path: config.paths.sass_includes,
		sass: config.paths.src_scss,
		css: config.wf+config.paths.dest_css
    }))
	*/
	
	.pipe(sass({
		includePaths: config.paths.sass_includes,
		errLogToConsole: true
	}))
	
	
	.pipe(autoprefixer('last 4 version'))
	.pipe(gulp.dest(config.wf+config.paths.dest_css))
	.pipe(minifyCSS({
		keepSpecialComments: 1,
		processImport: false
	}))
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest(config.wf+config.paths.dest_css))
	.pipe(browserSync.reload({stream:true}));
	
});


// JAVASCRIPT
gulp.task('js', function(){
	return gulp.src(config.paths.src_js+'/scripts.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(config.wf+config.paths.dest_js))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.wf+config.paths.dest_js))
	.pipe(browserSync.reload({stream:true}));
});


//	IMAGES_OPTIMIZE
//	Compressing images. Handle SVG files too.
gulp.task('images_optimize', function(tmp) {
    return gulp.src([
		config.paths.images+'/*.jpg',
		config.paths.images+'/*.png'
	])
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
	.pipe(gulp.dest(config.wf+config.paths.dest_images));
});


// IMAGES
gulp.task('images', function() {

    return merge(
	
		//IMAGES
		gulp.src( config.files.images + '/**/*' )
		.pipe(gulp.dest(config.wf+config.paths.dest_images))
		.pipe(browserSync.reload({stream:true})),
		
		//IMG
		gulp.src( config.files.img + '/**/*' )
		.pipe(gulp.dest(config.wf+config.paths.dest_img))
		.pipe(browserSync.reload({stream:true}))
		
	); //End merge
});


// VENDORS
gulp.task('vendors', function(){
	return merge(

		// IMAGES
		gulp.src( config.files.vendors.images )
		.pipe(changed( config.wf+config.paths.dest_images ))
		.pipe(gulp.dest( config.wf+config.paths.dest_images )),
		
		// IMG
		gulp.src( config.files.vendors.img )
		.pipe(changed( config.wf+config.paths.dest_img ))
		.pipe(gulp.dest( config.wf+config.paths.dest_img )),
		
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
		
		//	FONTS
		gulp.src(config.files.vendors.fonts)
		.pipe(changed( config.wf+config.paths.dest_fonts ))
		.pipe(gulp.dest( config.wf+config.paths.dest_fonts ))
		
	
	); //End merge
});

//	STANDALONE FILES
gulp.task('standalone', ['standalone_js', 'standalone_vendors_js', 'standalone_misc']);



// STANDALONE: SCRIPTS
gulp.task('standalone_js', function(){
		return gulp.src( config.files.js )
		//.pipe(changed( config.wf+config.paths.dest_js ))
		.pipe(gulp.dest( config.wf+config.paths.dest_js ));
});

// STANDALONE: VENDORS SCRIPTS
gulp.task('standalone_vendors_js', function(){
	return gulp.src(  config.files.vendors.standalone_js )
		.pipe(changed( config.wf+config.paths.dest_js ))
		.pipe(gulp.dest( config.wf+config.paths.dest_js ));
});

// STANDALONE: MISC
gulp.task('standalone_misc', function(){
	return	gulp.src( config.files.misc )
		.pipe(changed( config.wf  ))
		.pipe(gulp.dest( config.wf ));
});



//	FONTS
gulp.task('fonts', function () {
    gulp.src( config.files.fonts )
	.pipe(changed( config.wf+config.paths.dest_fonts  ))
	.pipe(gulp.dest( config.wf+config.paths.dest_fonts ))
	.pipe(browserSync.reload({stream:true}));
});

//	SCSS SOURCECES
gulp.task('scss:sources', function () {
	return merge(
		
		//SCSS
		gulp.src(config.paths.src_scss+'/**/*' )
		.pipe(gulp.dest( config.wf+'/sources/scss' ))
		.pipe(browserSync.reload({stream:true})),
		
		//Vendors SCSS
		gulp.src(config.paths.sass_includes+'/**/*')
		.pipe(gulp.dest( config.wf+'/sources/sass_includes' ))
		.pipe(browserSync.reload({stream:true}))
	)
});


gulp.task('browser-sync', function() {
    browserSync.init(null, {
		notify: false,
        server: {
            baseDir: config.wf,
			directory: config.directory_listing,
        }
    });
});


gulp.task('bs-reload', function () {
    browserSync.reload();
});


/******************************************
	TASKS
*******************************************/


// DEFAULT
gulp.task('default', ['temp']);


// TEMPLATES
gulp.task('temp', ['clean:dev'], function(){
	
	config.wf = config.dev;
	config.directory_listing = true;
	
	run(['html', 'scss', 'js', 'images', 'fonts', 'vendors', 'standalone', 'browser-sync'], function(){		
		gulp.watch(config.src+'/**/*.html', ['html']);
		gulp.watch(config.src+'/scss/**/*.scss', ['scss']);
		gulp.watch(config.src+'/js/**/*.js', ['js', 'standalone_js']);
		gulp.watch(config.src+'/images/**/*', ['images']);
	});
});




//COMPONENTS
gulp.task('comp', ['clean:comp'], function () {
	
	config.wf = config.comp;
	config.directory_listing = true;
	
	run(['scss', 'js', 'images', 'fonts', 'vendors', 'standalone', 'browser-sync'], function () {
		gulp.watch(config.wf + '/**/*.html', ['bs-reload']);
		gulp.watch(config.src + '/scss/**/*.scss', ['scss']);
		gulp.watch(config.src + '/js/**/*.js', ['js', 'standalone_js']);
		gulp.watch(config.src + '/images/**/*', ['images']);
	});	
});


// BUILD:FRONT
gulp.task('build', ['clean:build'], function(){
	config.wf = config.dist;
	run(['html', 'scss', 'js', 'images', 'fonts', 'vendors', 'standalone']);
});


