<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die();
if ($userConnected->id_groupe_user > 2) die();

if(count($_POST['id_tops']) > 0)
{

	Top::DisabledAll();

	if (count($_POST['id_tops']) == 1)
	{
		Top::DesactivateAll();
		foreach($_POST['id_tops'] as $id_top)
		{
			$top = new Top($id_top);
			$top->available = 1;
			$top->active = 1;
			$top->Save();
		}
		
		$confStep = Configuration::GetFromVariable('INSTALL_STEP');
		$confStep->valeur = 5;
		$confStep->Save();
		
		echo json_encode(array('next_step' => 'check', 'error' => ''));
	}
	else
	{
		foreach($_POST['id_tops'] as $id_top)
		{
			$top = new Top($id_top);
			$top->available = 1;
			$top->Save();
		}
		
		$confStep = Configuration::GetFromVariable('INSTALL_STEP');
		$confStep->valeur = 4;
		$confStep->Save();
		
		
		echo json_encode(array('next_step' => 'select', 'error' => ''));
	}

}
else
	echo json_encode(array('error' => 'No top available'));

?>