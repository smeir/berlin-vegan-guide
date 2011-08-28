<?php

/* load all files from $startdir into an javascript array, use hyphenator for "de" files
 TODO: hyphenation für "en" files
 */
$GLOBALS["language"] = "de";
$GLOBALS["path_to_patterns"] = "phpHyphenator/patterns/";
if(!isset($GLOBALS["leftmin"])) $GLOBALS["leftmin"] = 3;
if(!isset($GLOBALS["rightmin"])) $GLOBALS["rightmin"] = 3;

include("phpHyphenator/hyphenation.php");

$startdir = "../data/";
$jsArrayName = "BVApp.models.Data";
$outPutFile = "../src/data/Textfiles.js";
$result ="";


$result .= $jsArrayName . "= [];\n";
$files = directoryToArray($startdir,true);
foreach ($files as $file) {
    $content = file_get_contents($file);
    //$content = nl2br($content);
    $content = str_replace("\"","\\\"",$content); // encode quotes
    $content = str_replace("\n", "", $content);
    $content = str_replace("\r", "", $content);
    if(strstr($file,"/de/")){
     $content = hyphenation($content);
    }
    $file = str_replace($startdir,"",$file);
    if(strstr($file,"html")){ // only html files
        $result .= $jsArrayName . "[\"".$file."\"] = \"".$content."\";\n";
    }
}

$file = fopen ($outPutFile, "w");
fwrite($file, $result);
fclose ($file);

function directoryToArray($directory, $recursive) {
	$array_items = array();
	if ($handle = opendir($directory)) {
		while (false !== ($file = readdir($handle))) {
			if ($file != "." && $file != "..") {
				if (is_dir($directory. "/" . $file)) {
					if($recursive) {
						$array_items = array_merge($array_items, directoryToArray($directory. "/" . $file, $recursive));
					}
					$file = $directory . "/" . $file;
					$array_items[] = preg_replace("/\/\//si", "/", $file);
				} else {
					$file = $directory . "/" . $file;
					$array_items[] = preg_replace("/\/\//si", "/", $file);
				}
			}
		}
		closedir($handle);
	}
	return $array_items;
}
?>