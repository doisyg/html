<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die();
if ($_SESSION['id_groupe_user'] > 2) die();

Configuration::SetValue('INSTALL_STEP',5);

echo json_encode(array('error' => ''));

?>