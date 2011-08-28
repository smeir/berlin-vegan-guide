<?php

/*
	This example file shows how to use web hyphenation
	in 3 easy steps.
		
	STEP 1: ENCODING
	Use UTF-8 encoding:
*/	

	header('content-type: text/html; charset=utf-8');

/*
	STEP 2: SETTINGS
	Settings must be applied before including the
	"hyphenation.php". These are the default values:

	$GLOBALS["language"] = "en";
		Values: de, en, fr, nl
		
	$GLOBALS["path_to_patterns"] = "patterns/";
		Where the patterns are located.
		
	$GLOBALS["dictionary"] = "dictionary.txt";
		You can create a text file with special words
		and those hyphenations line by line.
		Use the / to mark a hyphenation.
		For example: hyphe/nation
		Be sure to use UNIX line encoding LF
		
	$GLOBALS["hyphen"] = "&shy;";
		Entity or single character for hyphenation.
	
	$GLOBALS["leftmin"] = 2;
	$GLOBALS["rightmin"] = 2;
	$GLOBALS["charmin"] = 2;
	$GLOBALS["charmax"] = 10;
		Minimum characters on left / right side and
		characters length of a word.
		
	$GLOBALS["exclude_tags"] = array("code", "pre", "script", "style");
		HTML tags to exclude from hyphenation.
	
	
	STEP 3: INCLUDING HYPHENATION.PHP
*/

	include("hyphenation.php");

/*	
	After including the file, hyphenation is available as
	normal function.
*/
	
	$text = 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?';
	
	echo hyphenation($text);
?>