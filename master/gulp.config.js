module.exports = function () {  

    var config = {
		src:		'src', //Sources
		dev:		'dev',	//Develop
		comp:		'components', //Components
		dist:		'dist',	//Build
		directory_listing: false
	};
	
	config.deploy = {
			live : {
				host 			: '111.222.333.444',
				user 			: "username",
				password 		: "password",  
				port 			: 21,
				localFilesGlob 	: ['./dist/**/*'],
				remoteFolder 	: "/www/mysite/rootfolder",
			}
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
			config.paths.src_img + '/**/*'
		],
		css: [
			config.paths.src_css +'/*.css'
		],
		js: [
			config.paths.src_js + '/*.js',
			'!' + config.paths.src_js + '/scripts.js'
		],
		fonts: [
			config.paths.src_fonts + '/**/*'
		],
		misc: [
			config.src + '/*',
			'!' + config.src + '/*.{htm,html}'
		],
		vendors: {
			images: [
				config.paths.src_vendors + '/slick-carousel/slick/ajax-loader.gif'
			],
			img: [],
			css: [
				config.paths.src_vendors + '/bootstrap/dist/css/bootstrap.css',
				config.paths.src_vendors + '/font-awesome/css/font-awesome.css',
				config.paths.src_vendors + '/bootstrap-select/dist/css/bootstrap-select.css',
				config.paths.src_vendors + '/magnific-popup/dist/magnific-popup.css',
				config.paths.src_vendors + '/slick-carousel/slick/slick.css',
				config.paths.src_vendors + '/slick-carousel/slick/slick-theme.css'
			],
			js: [
				config.paths.src_vendors + '/jquery/dist/jquery.js',
				config.paths.src_vendors + '/bootstrap/dist/js/bootstrap.js',
				config.paths.src_vendors + '/bootstrap-select/dist/js/bootstrap-select.js',
				config.paths.src_vendors + '/magnific-popup/dist/jquery.magnific-popup.js',
				config.paths.src_vendors + '/slick-carousel/slick/slick.js',
			],
			fonts: [
				config.paths.src_vendors + '/bootstrap/fonts/*',
				config.paths.src_vendors + '/font-awesome/fonts/*',
				config.paths.src_vendors + '/slick-carousel/slick/fonts/*'
			],
			standalone_images: 	[],
			standalone_img: 	[],
			standalone_css: 	[],
			standalone_js: 		[]
		}
	};
	
    return config;
};



