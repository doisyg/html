<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die();
if ($userConnected->id_groupe_user > 2) die();


$plan = new Map((int)$_POST['id_map']);
if ($plan->id_map > 0)
{
	$plan->SetAsActive();	
	
	// A REVOIR
	// On sauve les images directement dans le dossier de config sur le robot
	
	$plan->SendToRobot();
	
	echo json_encode(array('error' => ''));
}
else
	 echo json_encode(array('error' => 'not allow'));
?>
