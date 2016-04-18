# web-boilerplate: Lesson #1

This lesson is about learning how to setup a basic boilerplate with Gulp in order to live compile **.scss** files.


## Gulp tasks

- **Default** task:
	This task will compile the file **\src\scss\styles.scss** into **\src\css\styles.css**, and then will watch all the .scss files for any change and recompile.
	
	```
	$	gulp
	```
	
## Requirements

- [Node.js]
- [Gulp]
- **gulp-sass** plugin.


## Folder tree

	|   index.html
	|   
	+---css
	|       styles.css
	|       
	+---js
	|       scripts.js
	|       
	\---scss
		|   styles.scss
		|   _base.scss
		|   _fonts.scss
		|   _functions.scss
		|   _globals.scss
		|   _layout.scss
		|   _mixins.scss
		|   _variables.scss
		|   
		\---components
				_all.scss





[Node.js]: http://nodejs.org/dist/v0.12.4/node-v0.12.4-x86.msi
[Gulp]: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md