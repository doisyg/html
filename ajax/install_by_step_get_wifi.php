<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die();
if ($userConnected->id_groupe_user > 2) die();

Wifi::Scan();
$list = Wifi::GetWifiList();

echo json_encode(array('error' => '', 'list' => $list));

?>