<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die();

if ($_POST['id_lang'] != Configuration::GetValue('ID_LANG'))
{
	Configuration::SetValue('ID_LANG', $_POST['id_lang']);
	echo json_encode(array('need_restart' => 2, 'error' => ''));
}
else
	echo json_encode(array('need_restart' => 0, 'error' => ''));

?>