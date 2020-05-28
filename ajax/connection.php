<?php
session_start();
$_SESSION["id_user"] = $_POST['id'];
$_SESSION["api_key"] = $_POST['k'];
$_SESSION["id_groupe_user"] = $_POST['g'];
$_SESSION["IP"] = $_SERVER['REMOTE_ADDR'];

session_write_close();