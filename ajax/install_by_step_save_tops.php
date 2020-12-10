<?php 
require_once ('../config/initSite.php');
if (!isset($_SESSION["id_user"])) die('no_auth');
if ($_SESSION['id_groupe_user'] > 2) die('no_right');

if ($_POST['nb_tops'] == 1)
{
	Configuration::SetValue('INSTALL_STEP', 4);
	
	echo json_encode(array('next_step' => 'check', 'error' => ''));
}
else
{
	Configuration::SetValue('INSTALL_STEP', 3);
	
	echo json_encode(array('next_step' => 'select', 'error' => ''));
}

?>