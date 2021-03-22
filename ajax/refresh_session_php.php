<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die('no_auth');
if ($_SESSION['id_groupe_user'] > 2) die('no_right');

echo json_encode(array('error' => ''));

?>