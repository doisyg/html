<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die();
if ($_SESSION['id_groupe_user'] > 2) die();

Configuration::SetValue('INSTALL_STEP', 1);

if ($_POST['id_lang'] != Configuration::GetValue('ID_LANG'))
{
	Configuration::SetValue('ID_LANG', $_POST['id_lang']);
	echo json_encode(array('need_restart' => 1, 'error' => ''));
}
else
	echo json_encode(array('need_restart' => 0, 'error' => ''));

?>