<?php
/*
			phpHyphenator 1.5
			Developed by yellowgreen designbüro
			PHP version of the JavaScript Hyphenator 10 (Beta) by Matthias Nater
			
			Licensed under Creative Commons Attribution-Share Alike 2.5 Switzerland
			http://creativecommons.org/licenses/by-sa/2.5/ch/deed.en
			
			Associated pages:
			http://yellowgreen.de/soft-hyphenation-generator/
			http://yellowgreen.de/phphyphenator/
			http://www.dokuwiki.org/plugin:hyphenation
			
			Special thanks to:
			Dave Gööck (webvariants.de)
			Markus Birth (birth-online.de)
*/

			mb_internal_encoding("utf-8");

// FUNCTIONS

			// Convert patterns
			function convert_patterns($patterns) {
				$patterns = mb_split(' ', $patterns);
				$new_patterns = array();
				for($i = 0; $i < count($patterns); $i++) {
					$value = $patterns[$i];
					$new_patterns[preg_replace('/[0-9]/', '', $value)] = $value;
				}
				return $new_patterns;
			}
			
			// Split string to array
			function mb_split_chars($string) {
				$strlen = mb_strlen($string);
				while($strlen) {
					$array[] = mb_substr($string, 0, 1, 'utf-8');
					$string = mb_substr($string, 1, $strlen, 'utf-8');
					$strlen = mb_strlen($string);
				}
				return $array;
			}

// GET DATA
			// Set defaults
			if(!isset($GLOBALS["language"])) $GLOBALS["language"] = "en";
			if(!isset($GLOBALS["path_to_patterns"])) $GLOBALS["path_to_patterns"] = "patterns/";
			if(!isset($GLOBALS["dictionary"])) $GLOBALS["dictionary"] = "dictionary.txt";
			if(!isset($GLOBALS["hyphen"])) $GLOBALS["hyphen"] = "&shy;";
			if(!isset($GLOBALS["leftmin"])) $GLOBALS["leftmin"] = 2;
			if(!isset($GLOBALS["rightmin"])) $GLOBALS["rightmin"] = 2;
			if(!isset($GLOBALS["charmin"])) $GLOBALS["charmin"] = 2;
			if(!isset($GLOBALS["charmax"])) $GLOBALS["charmax"] = 10;
			if(!isset($GLOBALS["exclude_tags"])) $GLOBALS["exclude_tags"] = array("code", "pre", "script", "style");

			// Get patterns
			if(file_exists($GLOBALS["path_to_patterns"] . $GLOBALS["language"] . ".php")) { include($GLOBALS["path_to_patterns"] . $GLOBALS["language"] . ".php"); $GLOBALS["patterns"] = convert_patterns($patterns); } else $GLOBALS["patterns"] = array();
			
			// Get dictionary
			file_exists($GLOBALS["dictionary"]) ? $GLOBALS["dictionary"] = file($GLOBALS["dictionary"]) : $GLOBALS["dictionary"] = array();
			
			foreach($GLOBALS["dictionary"] as $entry) {
				$entry = trim($entry);
				$GLOBALS['dictionary words'][str_replace('/', '', mb_strtolower($entry))] = str_replace('/', $GLOBALS['hyphen'], $entry);
			}

// HYPHENATION

			// Word hyphenation
			function word_hyphenation($word) {
				if(mb_strlen($word) < $GLOBALS["charmin"]) return $word;
				if(mb_strpos($word, $GLOBALS["hyphen"]) !== false) return $word;
				if(isset($GLOBALS['dictionary words'][mb_strtolower($word)])) return $GLOBALS['dictionary words'][mb_strtolower($word)];
				
				$text_word = '_' . $word . '_';
				$word_length = mb_strlen($text_word);
				$single_character = mb_split_chars($text_word);
				$text_word = mb_strtolower($text_word);
				$hyphenated_word = array();
				$numb3rs = array('0' => true, '1' => true, '2' => true, '3' => true, '4' => true, '5' => true, '6' => true, '7' => true, '8' => true, '9' => true);
				
				for($position = 0; $position <= ($word_length - $GLOBALS["charmin"]); $position++) {
					$maxwins = min(($word_length - $position), $GLOBALS["charmax"]);

					for($win = $GLOBALS["charmin"]; $win <= $maxwins; $win++) {
						if(isset($GLOBALS["patterns"][mb_substr($text_word, $position, $win)])) {
							$pattern = $GLOBALS["patterns"][mb_substr($text_word, $position, $win)];
							$digits = 1;
							$pattern_length = mb_strlen($pattern);
							
							for($i = 0; $i < $pattern_length; $i++) {
								$char = $pattern[$i];
								if(isset($numb3rs[$char])) {
									$zero = ($i == 0) ? $position - 1 : $position + $i - $digits;
									if(!isset($hyphenated_word[$zero]) || $hyphenated_word[$zero] != $char) $hyphenated_word[$zero] = $char;
									$digits++;				
								}
							}
						}
					}
				}
				
				$inserted = 0;
				for($i = $GLOBALS["leftmin"]; $i <= (mb_strlen($word) - $GLOBALS["rightmin"]); $i++) {
					if(isset($hyphenated_word[$i]) && $hyphenated_word[$i] % 2 != 0) {
						array_splice($single_character, $i + $inserted + 1, 0, $GLOBALS["hyphen"]);
						$inserted++;
					}
				}
				
				return implode('', array_slice($single_character, 1, -1));
			}

			// Text hyphenation
			function hyphenation($text) {
				global $exclude_tags; $word = ""; $tag = ""; $tag_jump = 0; $output = array();
				$word_boundaries = "<>\t\n\r\0\x0B !\"§$%&/()=?….,;:-–_„”«»‘’'/\\‹›()[]{}*+´`^|©℗®™℠¹²³";
				$text = $text . " ";
				
				for($i = 0; $i < mb_strlen($text); $i++) {
					$char = mb_substr($text, $i, 1);
					if(mb_strpos($word_boundaries, $char) === false && $tag == "") {
						$word .= $char;
					} else {
						if($word != "") { $output[] = word_hyphenation($word); $word = ""; }
						if($tag != "" || $char == "<") $tag .= $char;
						if($tag != "" && $char == ">") {
							$tag_name = (mb_strpos($tag, " ")) ? mb_substr($tag, 1, mb_strpos($tag, " ") - 1) : mb_substr($tag, 1, mb_strpos($tag, ">") - 1);
							if($tag_jump == 0 && in_array(mb_strtolower($tag_name), $exclude_tags)) { 
								$tag_jump = 1;
							} else if($tag_jump == 0 || mb_strtolower(mb_substr($tag, -mb_strlen($tag_name) - 3)) == '</' . mb_strtolower($tag_name) . '>') { 
								$output[] = $tag;
								$tag = '';
								$tag_jump = 0;
							} 
						}
						if($tag == "" && $char != "<" && $char != ">") $output[] = $char;
					}
				}
				
				$text = join($output);
				return substr($text, 0, strlen($text) - 1);
			}
?>