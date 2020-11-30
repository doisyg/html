<?php 
$notCloseSession = true;
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die();
if ($_SESSION['id_groupe_user'] > 2) die();


Configuration::SetValue('INSTALL_STEP', 0);

echo json_encode(array('error' => ''));

@session_destroy();
@session_start();

?>