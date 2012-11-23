## testing/debugging on desktop

* index.html -> App for desktop browser (only chrome)
* frame.html -> App for desktop browser in a nice iPhone Frame

## build for Android
### preconditions
* git clone https://github.com/smeir/Berlin-Vegan-Guide.git
* installed android sdk
* installed IntelliJ IDEA [http://www.jetbrains.com/idea/]

### build apk
* run "ant prod.android" in root folder, this will minify css & javascript and copy everything to build folder
* open IntelliJ, open project
* Tools->Android->Export Signed Application Package

## regenerate css files

* update css files with "compass compile" in /resources/scss

##Supported Platforms

* Android 2.x
* iOS 3.x

## License

* Source code: GPLv2
* Content: CC BY-NC-SA 2.0

##Used Software and Tools

* Sencha Touch 1.1
* Include.js 1.0.4 http://capmousse.github.com/include.js/
* phonegap 0.9.4
* WebStorm 2.0/Intellij IDEA 11

