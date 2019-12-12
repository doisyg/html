<?php 
require_once ('../../config/initSite.php');
if (!isset($_SESSION["id_developer"])) { header("location:login.php"); }


$site = new Site((int)$_POST['id_site']);
$plan = new Plan((int)$_POST['id_plan']);
if (!$userConnected->HaveAccesSite($site->id_site)) die();
if (!$userConnected->HaveAccesPlan($plan->id_plan)) die();


$plans = Plan::GetPlans();
foreach($plans as $p)
{
	if ($p->id_site == $site->id_site)
	{
		$p->id_site = -1;
		$p->Save();
	}
}



$plan->id_site = $site->id_site;
$plan->Save();
