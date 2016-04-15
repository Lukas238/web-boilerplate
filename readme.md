# web-boilerplate

My developer web pages boilerplate.

### Features
- jQuery
- [Bootstrap-3] library (css and js).
- [Bootstrap-3-SASS] library. Think _mixins_!
- SASS (SCSS) support.
- [Bower] for easy library managment.
- [bootstrap-select]. Replace all **select** tags with a bootstrap3 HTML version.
- [better-input-file]. Replace all **input:file** buttons with a HTML version.
- [Slick-carousel]: Responsibe carousel jQuery plugin.
- [Magnific Popup]: Responsibe popup jQuery plugin.


>**NOTE:** Use [Bower] to install new css/js libraries, and then add the appropriate file paths to the resources in **\master\gulp.config.js** file.

>The libraries added this way will be automatically appended to **js\vendors.js** and **css\vendors.css** files.


## Requirements

- [Git]
- [Node.js]
- [Gulp]
- [Bower]


## Gulp

### Available tasks

- **Default**:
	For developing and testing page teplates.

	This task will compile all files from **\src** folder to **\dev** folder, and start the web server for development.

	```
	$	gulp
	```
- **Components**:
	For developing and testing individual atomic components in **\components** folder.

	This task will compile all style/images/scripts files from **\src** folder to **\components** folder, and start the web server for component development.

	```
	$	gulp comp
	```
- **Distribution**:
	Compile all the site files.

	This task will compile all files from **\src** folder to **\_static** folder -inside the ASP solution folder- in order to get automatic deployed to DEV with the next SVN commit.

	```
	$	gulp dist
	```
- **Deploy**:
	Compile all the site files (same as **dist** task) and upload the files by FTP.

	```
	$	gulp deploy
	```


	
	
[Git]: http://git-scm.com/download/win
[Node.js]: http://nodejs.org/dist/v0.12.4/node-v0.12.4-x86.msi
[Gulp]: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
[Bower]: http://bower.io/search/

[Bootstrap-3]: http://getbootstrap.com/
[Bootstrap-3-SASS]: http://www.cheatography.com/lukas238/cheat-sheets/bootstrap3-sass-mixins/
[Bower]: http://bower.io/#install-bower
[better-input-file]: https://github.com/Lukas238/better-input-file
[bootstrap-select]: http://silviomoreto.github.io/bootstrap-select/
[Slick-carousel]: http://kenwheeler.github.io/slick/
[Magnific Popup]: https://github.com/dimsemenov/Magnific-Popup