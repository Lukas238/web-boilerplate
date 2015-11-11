##Built in vendors plugins:

- [Bootstrap-3]: CSS & [JS components].
- [Bootstrap-3-SASS]: Mixins.
- jQuery 1.11.3: a jQuery version compatible with older browsers (_I'm talking to you, IE8_).
- [better-input-file]:  a jQuery plugin that replaces the _&lt;input type=&quot;file&quot;&gt;_ button with an improved -and translatable- html5 button.
- [bootstrap-select]: a jQuery plugin that replace the &lt;select&gt; tag with a bootstrap3 dropdown.
- [Slick-slider]: a responsibe carousel jQuery plugin.


**Note:** To add new vendors resources, use [Bower], and then add the appropriate paths to the resources in the corrsponding *gulpfile.js* task.
The resources will be automatically added to the files **js\vendors.js** and **css\vendors.css** of the project.


---


##Gulp Tasks


####Default
##### For developing and testing page teplates.

This task will compile all files from **\src** folder to **\dev** folder, and start the web server for development.

```
$	gulp
```

### comp
##### For developing and testing individual components.

This task will compile all style/images/scripts files from **\src** folder to **\components** folder, and start the web server for component development.

```
$	gulp comp
```


### build
##### Prepare the necessary files for the static  site  preview.

This task will compile all files from **\src** folder to **\_static** folder -inside the ASP solution folder- in order to get automatic deployed to DEV with the next SVN commit.

```
$	gulp build
```


---

##Folder structure
	+---Site
		+---front
			+---components
			+---dev
			+---dist
			+---src
				+---fonts
				+---images
				+---js
				+---scss
				¦	+---components
				+---vendors

				
####Front files
- **\src**:  Page templates HTML layout files.
	- **\fonts**: fonts files.
	- **\images**: images files.
	- **\scss**: SCSS and CSS styles files.
		- **\componentes**: Componentes scss style files.
	- **\js**: Scripts files.
- **\components**: Componentes HTML layout files. Where **comp** task will compile the project files and run a live web server.
- **\dev**: Where **temp** task will compile the project files and run a live web server.
	
---
	
##Requirements:

- [Git]
- [Node.js]
- [Gulp] for [Node.js]
- [Bower] for [Node.js]

**Note**: In some networks Node.js or bower fail to access the packages because the _git://_ protocole is blocked. A workaround is to configure **Git** to globally use the protocol _https://_ instead.

Jus open the git console and run this command:

	$ git config --global url."https://".insteadOf git://

	
---

###Misc
To view this document more easily, install chrome [Markdown Preview Plus] plugin.  
1. Set the extention .md to always opened in Chrome.
2. Give the addon permission to access local files on Chrome's extension page.
3. And setup the addon to display the markdown file using _"GitHub"_ theme.



[Markdown Preview Plus]: https://chrome.google.com/webstore/detail/markdown-preview-plus/febilkbfcbhebfnokafefeacimjdckgl?utm_source=chrome-app-launcher-info-dialog

[Git]: http://git-scm.com/download/win
[Node.js]: http://nodejs.org/dist/v0.12.4/node-v0.12.4-x86.msi
[Gulp]: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
[Bower]: http://bower.io/search/

[Bootstrap-3]: http://getbootstrap.com/
[JS components]: http://getbootstrap.com/components/
[Bootstrap-3-SASS]: http://www.cheatography.com/lukas238/cheat-sheets/bootstrap3-sass-mixins/
[Bower]: http://bower.io/#install-bower
[better-input-file]: https://github.com/Lukas238/better-input-file
[bootstrap-select]: http://silviomoreto.github.io/bootstrap-select/
[Slick-slider]: http://kenwheeler.github.io/slick/