<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die();
if ($userConnected->id_groupe_user > 2) die();

$confStep = Configuration::GetFromVariable('INSTALL_STEP');
$confStep->valeur = 1;
$confStep->Save();

if ($_POST['id_lang'] != Configuration::GetValue('ID_LANG'))
{
	$confLang = Configuration::GetFromVariable('ID_LANG');
	$confLang->valeur = $_POST['id_lang'];
	$confLang->Save();
	
	echo json_encode(array('need_restart' => 1, 'error' => ''));
}
else
	echo json_encode(array('need_restart' => 0, 'error' => ''));

?>