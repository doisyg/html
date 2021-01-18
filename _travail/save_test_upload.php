<?php

if(isset($_POST)){
	var_dump($_POST);
	if(isset($_POST['device']) && $_POST['device'] != '' && isset($_POST['img']) && $_POST['img'] != ''){
		$t = time() - intval(substr($_POST['timestamp'],0,10));
		echo $t." ";
	}else
		die('Bad post');
}else
	die('No post');