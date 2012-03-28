# Delineate the directory for our SASS/SCSS files (this directory)
sass_path = File.dirname(__FILE__)
 
# Delineate the CSS directory (under resources/css in this demo)
css_path = File.join(sass_path, "..", "css")
 
# Delinate the images directory
images_dir = File.join(sass_path, "..", "imgages")
 
# Load the sencha-touch framework
load File.join(sass_path, '..', '..','lib','touch','resources','themes')
 
# Specify the output style/environment
output_style = :compressed
environment = :production