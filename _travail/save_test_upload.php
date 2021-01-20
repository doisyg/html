<?php

if(isset($_POST)){
	
	if(isset($_POST['device']) && $_POST['device'] != '' && isset($_FILES['img'])){
		$timestamp_upload = floatval(intval(substr($_POST['timestamp'],0,10)).".".intval(substr($_POST['timestamp'],-3))."0");
		$t = microtime(true) - $timestamp_upload;
		echo "Time to upload ".$t." s";
		$text = "Device ".$_POST['device']." - Filesize ".$_FILES['img']['size']."o - Time ".$t." s"."\n"; 
		file_put_contents ('save.txt' ,$text,FILE_APPEND);
	}else
		die('Bad post');
}else
	die('No post');