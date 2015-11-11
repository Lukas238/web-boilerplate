module.exports = function () {  

    var config = {
		src:		'src', //Sources
		dev:		'dev',	//Develop
		comp:	'components', //Components
		dist:		'dist',	//Build
		directory_listing: false
	};
	
	config.wf = config.dev; //Default Working Folder

	config.paths = {
		src_css: 			config.src + '/css',
		src_scss: 			config.src + '/scss',
		src_js: 				config.src + '/js',
		src_images:		config.src + '/images',
		src_img:			config.src + '/img',
		src_fonts:			config.src + '/fonts',
		src_vendors: 		config.src + '/vendors',
		
		dest_css: 			'/css',
		dest_js: 			'/js',
		dest_images:	'/images',
		dest_img:			'/img',
		dest_fonts:		'/fonts'
	};
	
	config.paths.sass_includes = [ 
		config.paths.src_vendors + '/bootstrap-sass/assets/stylesheets/'
	];
	
	config.files = {
		images: [
			config.paths.src_images
		],
		img: [
			config.paths.src_img
		],
		css: [
			config.paths.src_css +'/*.css'
		],
		js: [
			config.paths.src_js + '/*.js',
			'!' + config.paths.src_js + '/scripts.js'
		],
		fonts: [
			config.paths.src_fonts + '/*'
		],
		misc: [
			config.src + '/favicon.ico'
		],
		vendors: {
			images: [
				config.paths.src_vendors + '/slick.js/slick/ajax-loader.gif'
			],
			img: [],
			css: [
				config.paths.src_vendors + '/slick.js/slick/slick.css',
				config.paths.src_vendors+ '/slick.js/slick/slick-theme.css',
				config.paths.src_vendors + '/bootstrap-select/dist/css/bootstrap-select.css'
			],
			js: [
				config.paths.src_vendors + '/jquery/dist/jquery.js',
				config.paths.src_vendors + '/slick.js/slick/slick.js',
				config.paths.src_vendors + '/better-input-file/dist/betterInputFileButton.js',
				config.paths.src_vendors + '/bootstrap-select/dist/js/bootstrap-select.js',
				config.paths.src_vendors + '/jquery-validation/dist/jquery.validate.js'
			],
			fonts: [
				config.paths.src_vendors + '/bootstrap-sass/assets/fonts/bootstrap/*',
				config.paths.src_vendors + '/slick.js/slick/fonts/*'
			],
			standalone_images: [],
			standalone_img: [],
			standalone_css: [],
			standalone_js: [
				config.paths.src_vendors + '/html5shiv/dist/html5shiv.min.js',
				config.paths.src_vendors + '/respond/dest/respond.min.js'
			]
		}
	};
	
    return config;
};




