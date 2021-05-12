<?php
$width_wanted = 414;
$height_wanted = 736;
$dirSource = $_POST['dirSource'];
$dirDest = $_POST['dirDest'];
foreach(scandir($dirSource) as $filename) {
	if (!($filename === '.' || $filename === '..' ) && strpos($filename,'.png') != false){
		$im = imagecreatefrompng($dirSource.'/'.$filename);
		$im2 = imagecrop($im, ['x' => $_POST['X'], 'y' => $_POST['Y'], 'width' => $_POST['WIDTH'], 'height' =>  $_POST['HEIGHT']]);
		if ($im2 !== FALSE) {
			imagepng($im2, $dirDest.'/'.$filename);
			imagedestroy($im2);
		}
		imagedestroy($im);
	}
}
echo "<a href='$dirDest'>Folder</a>";


?>
