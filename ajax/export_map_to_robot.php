<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) { header("location:login.php"); }

$sectionMenu = "maps";
$sectionSousMenu = "";

if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'add')) { echo json_encode(array('id_map' => $plan->id_plan, 'error' => 'not allow')); exit; }

$plan = new Plan((int)$_POST['id_plan']);
if ($plan->id_plan > 0)
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
