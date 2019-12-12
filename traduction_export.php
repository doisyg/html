<?php 
require_once ('./config/initSite.php');

if (!isset($_SESSION["id_user"])) {exit; }

$sectionMenu = "traduction";
$sectionSousMenu = "";

if (!$userConnected->CanDo($sectionMenu, $sectionSousMenu, 'view')) {  exit; }
$langues = array();
$languesDB = Lang::GetLangs();
foreach ($languesDB as $lang)
{
	$langues[$lang->iso] = Translate::GetTraductions($lang->iso);
}



header("Content-Type: application/csv");
header("Content-disposition: filename=export-lang-".date("Y-m-d-H-i-s").".csv");

$texte = '"ID"';
foreach ($languesDB as $lang)
	$texte .= ';"'.$lang->iso.'"';
	
echo $texte."\r\n";

foreach ($langues['fr'] as $key => $value)
{
	$texte = '"'.$key.'"';
	foreach ($languesDB as $lang)
		$texte .= ';"'.utf8_decode((isset($langues[$lang->iso][$key])?$langues[$lang->iso][$key]:'')).'"';
		
	echo $texte."\r\n";
}
?>