<?php
session_start();

if (isset($_POST['cp']))
 $_SESSION["need_change_password"] = false;
elseif (isset($_POST['id']))
{
	$_SESSION["id_user"] = $_POST['id'];
	$_SESSION["api_key"] = $_POST['k'];
	$_SESSION["id_groupe_user"] = $_POST['g'];
	$_SESSION["need_change_password"] = ($_POST['ncp'] == 'true')?true:false;
	$_SESSION["IP"] = $_SERVER['REMOTE_ADDR'];
}
session_write_close();