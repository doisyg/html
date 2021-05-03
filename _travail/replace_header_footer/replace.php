<?php
$dirSource = $_POST['dirSource'];
$dirDest = $_POST['dirDest'];

$img_name = scandir($dirSource, 1)[0];
$im = imagecreatefrompng($dirSource.'/'.$img_name);
$width = imagesx($im);
$height = imagesy($im);
imagedestroy($im);

$x1 = 0;
$x2 = $width;

if(isset($_POST['header'])){
	$imHeader = imagecreatefrompng($_POST['header_name']);
	$y1 = imagesy($imHeader);
}
else
	$y1 =  0;

if(isset($_POST['footer'])){
	$imFooter = imagecreatefrompng($_POST['footer_name']);
	//$y2 = $height - imagesy($imFooter) - $y1;
	$y2 = $height - imagesy($imFooter);
}
else
	$y2 = $height;



foreach(scandir($dirSource) as $filename) {
	if (!($filename === '.' || $filename === '..' ) && strpos($filename,'.png') != false){
		$im = imagecreatefrompng($dirSource.'/'.$filename);
		//ADD FOOTER AND HEADER
		if(isset($imHeader)){
			imagecopymerge($im,$imHeader,0,0,0,0,imagesx($imHeader),imagesy($imHeader),100);
		}
		if(isset($imFooter)){
			imagecopymerge($im,$imFooter,0,$y2,0,0,imagesx($imFooter),imagesy($imFooter),100);
		}
		
		$fn = str_replace('step','normal',$filename);
		$dest = $dirDest.'/'.$fn;
		 
		imagepng($im,$dest);
		imagedestroy($im);
	}
}
if(isset($imHeader)){
	imagedestroy($imHeader);	
}
if(isset($imFooter)){
	imagedestroy($imFooter);	
}
echo "<a href='$dirDest'>Folder</a>";


?>
